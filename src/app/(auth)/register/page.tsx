"use client";

import LeftSideSection from "@/components/component-login/left-side-section";
import RegistrationFlow, {
  RegistrationStep,
} from "@/components/registration-flow/RegistrationFlow";
import { ErrorModal } from "@/components/sections/error-modal";
import { secureUrl } from "@/lib/api";
import { useRegistrationFlow } from "@/hooks/useLocalStorage";
import { useStepsProgress } from "@/hooks/useStepsProgress";
import { useUserData } from "@/hooks/useUserData";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, login, isLoading, userProfile } = useUserData();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("register");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const { markStepCompleted, getCurrentStepFromStorage } = useStepsProgress(1);
  const {
    currentStep: persistedCurrentStep,
    setCurrentStep: setPersistedCurrentStep,
  } = useRegistrationFlow();

  // Initialize step from localStorage and URL parameters only once on component mount
  useEffect(() => {
    if (!isInitialized) {
      try {
        // Check for startStep URL parameter (for logged-in users)
        const startStepParam = searchParams.get("startStep");
        const accessToken = localStorage.getItem("accessToken");
        const userToken = localStorage.getItem("userToken");
        const isLoggedIn =
          !!(accessToken && accessToken.trim()) ||
          !!(userToken && userToken.trim());

        if (isLoggedIn && startStepParam === "measurements") {
          // Logged-in user wants to start at measurements step
          setCurrentStep("measurements");
          setPersistedCurrentStep(2);
          setIsInitialized(true);
          return;
        }

        // If user is already logged in but no startStep parameter, redirect to home
        if (isLoggedIn && !startStepParam) {
          router.push("/");
          return;
        }

        const savedStep = getCurrentStepFromStorage();
        const savedStepFromRegistration = persistedCurrentStep;

        // Use the higher step value between the two storage mechanisms
        const stepToUse = Math.max(savedStep, savedStepFromRegistration);

        if (stepToUse > 1) {
          // Convert numeric step to RegistrationStep
          const stepMap: { [key: number]: RegistrationStep } = {
            1: "register",
            2: "measurements",
            3: "body-shape",
            4: "body-shape",
            5: "face-scan",
          };
          const savedRegistrationStep = stepMap[stepToUse] || "register";
          setCurrentStep(savedRegistrationStep);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing step from storage:", error);
        setIsInitialized(true);
      }
    }
  }, [
    isInitialized,
    getCurrentStepFromStorage,
    persistedCurrentStep,
    searchParams,
    userProfile,
    setPersistedCurrentStep,
  ]);

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStepChange = (step: RegistrationStep) => {
    setCurrentStep(step);

    // Also update the persisted step
    const stepNumberMap: { [key in RegistrationStep]: number } = {
      register: 1,
      measurements: 2,
      "body-shape": 4,
      "face-scan": 5,
    };

    setPersistedCurrentStep(stepNumberMap[step]);
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.push("Nama lengkap minimal 2 karakter");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.push("Format email tidak valid");
    }

    if (!formData.phone || formData.phone.length < 10) {
      errors.push("Nomor telepon minimal 10 digit");
    }

    if (formData.password.length < 6) {
      errors.push("Password minimal 6 karakter");
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push("Password dan konfirmasi password tidak sama");
    }

    return errors;
  };

  const handleGoogleSignup = () => {
    // Directly redirect to the backend's Google OAuth endpoint
    // This avoids CORS issues since it's not an AJAX request
    window.location.href = secureUrl("/v1/auth/google/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi form terlebih dahulu
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrorModalMessage(validationErrors.join(", "));
      setIsErrorModalOpen(true);
      return;
    }

    try {
      const uniqueGoogleId = generateUUID();

      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName =
        nameParts.length > 1
          ? nameParts.slice(1).join(" ")
          : nameParts[0] || "";

      const phoneNumber = formData.phone.replace(/\D/g, "");

      await register({
        email: formData.email.trim().toLowerCase(),
        first_name: firstName,
        last_name: lastName || "",
        google_id: uniqueGoogleId,
        is_active: true,
        phone_number: parseInt(phoneNumber) || null,
        password: formData.password,
      });

      // Automatically login the user after successful registration
      await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Mark step 1 as completed and move to step 2
      markStepCompleted(1);
      setPersistedCurrentStep(2);
      setCurrentStep("measurements");
    } catch (err) {
      setErrorModalMessage(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat registrasi. Silakan coba lagi."
      );
      setIsErrorModalOpen(true);
    }
  };

  // Show registration flow for steps after register
  if (currentStep !== "register") {
    return (
      <RegistrationFlow
        currentStep={currentStep}
        onStepChange={handleStepChange}
      />
    );
  }

  // Don't render the registration form until we've checked localStorage
  if (!isInitialized) {
    return (
      <main className="min-h-screen bg-[url('/login-bg.png')] bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 flex items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f0f0f0]"></div>
        </div>
      </main>
    );
  }

  const steps = [
    { number: "01", title: "Buat Akun", active: true },
    { number: "02", title: "Lengkapi Data", active: false },
    { number: "03", title: "Analisa", active: false },
    { number: "04", title: "Pilih Bentuk Tubuh Kamu", active: false },
    { number: "05", title: "Scan Wajah Kamu", active: false },
  ];

  return (
    <main className="min-h-screen bg-[url('/login-bg.png')] bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 flex items-center justify-center">
      <div className="container mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-16">
        <LeftSideSection
          steps={steps}
          currentStepNumber={1}
          showExtendedSteps={false}
        />
        <div className="w-full lg:flex-1 lg:max-w-[65%] lg:mr-[50px]">
          <div className="bg-[#f0f0f0]/95 lg:h-full h-[73vh] backdrop-blur-sm shadow-xl lg:rounded-2xl rounded-t-2xl border-0 py-6 px-4 sm:py-12 sm:px-6 md:px-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-oswald text-left">
              Buat Akun Baru
            </h2>

            <ErrorModal
              isOpen={isErrorModalOpen}
              onClose={() => setIsErrorModalOpen(false)}
              errorMessage={errorModalMessage}
            />

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-gray-600 font-medium text-xs lg:text-sm"
                >
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="w-full text-xs lg:text-sm border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-2 focus:border-gray-600 focus:outline-none focus:ring-0"
                  placeholder="Masukkan nama lengkap (minimal 2 karakter)"
                  required
                  minLength={2}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-gray-600 font-medium text-xs lg:text-sm"
                >
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full text-xs lg:text-sm border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-2 focus:border-gray-600 focus:outline-none focus:ring-0"
                  placeholder="Masukkan email"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-gray-600 font-medium text-xs lg:text-sm"
                >
                  Nomor Telepon *
                </label>
                <div className="flex items-center border-gray-300 focus-within:border-gray-600 transition-colors">
                  <span className="text-gray-700 pl-1 text-xs lg:text-sm">
                    +62
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full text-xs lg:text-sm border-b-gray-300 border-b-2 bg-transparent px-2 py-2 focus:outline-none focus:ring-0"
                    placeholder="81234567890 (minimal 10 digit)"
                    required
                    minLength={10}
                  />
                </div>
              </div>

              <div className="flex flex-row w-full justify-center gap-4">
                <div className="space-y-2 w-full">
                  <label
                    htmlFor="password"
                    className="block text-gray-600 font-medium text-xs lg:text-sm"
                  >
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="w-full text-xs lg:text-sm border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-2 focus:border-gray-600 focus:outline-none focus:ring-0"
                    placeholder="Minimal 6 karakter"
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2 w-full sm:mt-0">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-600 font-medium text-xs lg:text-sm"
                  >
                    Konfirmasi Password *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="w-full text-xs lg:text-sm border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-2 focus:border-gray-600 focus:outline-none focus:ring-0"
                    placeholder="Konfirmasi password"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  className="w-full bg-[#323232] hover:bg-pink-400 hover:text-[#f0f0f0] text-[#ffc6c6] lg:h-[50px] h-[40px] rounded-lg font-bold transition-colors text-xs lg:text-xl flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-[#f0f0f0]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Daftar Sekarang"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full text-xs lg:text-lg bg-[#f0f0f0] hover:bg-gray-50 text-[#323232] border-2 border-gray-300 py-3 h-[40px] lg:h-[50px] rounded-lg font-poppins transition-colors flex items-center justify-center gap-3"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </button>
              </div>

              {/* Already have account text */}
              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm font-poppins">
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    className="text-[#ED80A7] hover:text-pink-600 font-medium transition-colors"
                    onClick={() => router.push("/login")}
                  >
                    Masuk
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[url('/login-bg.png')] bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 flex items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f0f0f0]"></div>
          </div>
        </main>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
