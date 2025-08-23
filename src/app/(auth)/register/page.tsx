"use client";

import LeftSideSection from "@/components/component-login/left-side-section";
import { Button } from "@/components/ui/button";
import { secureUrl } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ErrorModal } from "@/components/sections/error-modal";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const uniqueGoogleId = generateUUID();

      const endpoint = secureUrl(`/v1/users/`);
      console.log("fetch endpoint:", endpoint);

      let response;
      try {
        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          redirect: "follow",
          body: JSON.stringify({
            email: formData.email,
            first_name: formData.fullName.split(" ")[0] || "",
            last_name: formData.fullName.split(" ").slice(1).join(" ") || "",
            google_id: uniqueGoogleId,
            is_active: true,
            phone_number: parseInt(formData.phoneNumber) || 0,
            password: formData.password,
          }),
        });
      } catch (fetchErr) {
        setErrorModalMessage(
          "Gagal menghubungi server. Pastikan koneksi internet Anda stabil atau coba lagi nanti."
        );
        setIsErrorModalOpen(true);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        let errorMsg =
          "Terjadi kesalahan saat menghubungi server. Silakan coba lagi.";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {}
        setErrorModalMessage(
          `Gagal menghubungi server. Pastikan koneksi internet Anda stabil atau coba lagi nanti. ${errorMsg}`
        );
        setIsErrorModalOpen(true);
      }

      const result = await response.json();
      console.log("Registration successful:", result);

      if (result.id) {
        localStorage.setItem("userId", result.id);
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("firstName", result.first_name);
        localStorage.setItem("lastName", result.last_name);
        console.log(
          "User ID saved to localStorage:",
          result.id,
          result.first_name,
          result.last_name
        );
      }

      router.push("/analyze/first");
    } catch (err) {
      console.error("Registration error:", err);
      if (
        err instanceof TypeError &&
        err.message &&
        err.message.toLowerCase().includes("failed to fetch")
      ) {
        setErrorModalMessage(
          "Gagal menghubungi server. Pastikan koneksi internet Anda stabil atau hubungi admin jika masalah berlanjut."
        );
        setIsErrorModalOpen(true);
      } else {
        if (
          err instanceof Error &&
          err.message.includes("user with this email already exists")
        ) {
          setErrorModalMessage("Email Anda sudah terdaftar");
          setIsErrorModalOpen(true);
        } else {
          setErrorModalMessage(
            "Maaf, Alamat email yang kamu masukan sudah di gunakan"
          );
          setIsErrorModalOpen(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: "01", title: "Buat Akun", active: true },
    { number: "02", title: "Lengkapi Data", active: false },
    { number: "03", title: "Analisa", active: false },
  ];

  return (
    <main className="min-h-screen bg-[url('/login-bg.png')] bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 flex items-center justify-center">
      <div className="w-full max-w-[85rem] flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-16">
        <LeftSideSection
          steps={steps}
          currentStepNumber={1}
          showExtendedSteps={false}
        />
        <div className="w-full lg:flex-1 lg:max-w-[65%]">
          <div className="bg-white/95 h-full backdrop-blur-sm shadow-xl rounded-t-2xl border-0 py-6 px-4 sm:py-12 sm:px-6 md:px-10">
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
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="w-full text-xs lg:text-sm border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-2 focus:border-gray-600 focus:outline-none focus:ring-0"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-gray-600 font-medium text-xs lg:text-sm"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full text-xs lg:text-sm border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-2 focus:border-gray-600 focus:outline-none focus:ring-0"
                  placeholder="Masukkan email"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="block text-gray-600 font-medium text-xs lg:text-sm"
                >
                  Nomor Telepon
                </label>
                <div className="flex items-center border-gray-300 focus-within:border-gray-600 transition-colors">
                  <span className="text-gray-700 pl-1 text-xs lg:text-sm">
                    +62
                  </span>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    className="w-full text-xs lg:text-sm border-b-gray-300 border-b-2 bg-transparent px-2 py-2 focus:outline-none focus:ring-0"
                    placeholder="81234567890"
                  />
                </div>
              </div>

              <div className="flex flex-row w-full justify-center gap-4">
                <div className="space-y-2 w-full">
                  <label
                    htmlFor="password"
                    className="block text-gray-600 font-medium text-xs lg:text-sm"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="w-full text-xs lg:text-sm border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-2 focus:border-gray-600 focus:outline-none focus:ring-0"
                    placeholder="Masukkan password"
                  />
                </div>

                <div className="space-y-2 w-full sm:mt-0">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-600 font-medium text-xs lg:text-sm"
                  >
                    Konfirmasi Password
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
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#323232] hover:bg-pink-400 hover:text-white text-[#ffc6c6] lg:h-[50px] h-[40px] rounded-lg font-bold transition-colors text-xs lg:text-xl flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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

              <div className="flex lg:flex-row flex-col gap-4">
                <button
                  type="button"
                  className="w-full text-xs lg:text-xl bg-white hover:bg-gray-50 text-[#323232] border-2 border-gray-300 py-3 h-[40px] lg:h-[50px] rounded-lg font-medium transition-colors flex items-center justify-center gap-3"
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

                <button
                  type="button"
                  className="w-full bg-black hover:bg-gray-800 text-white h-[40px] lg:h-[50px] rounded-lg font-medium transition-colors flex items-center justify-center gap-3 text-xs lg:text-xl"
                  disabled={isLoading}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Sign up with Apple
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
