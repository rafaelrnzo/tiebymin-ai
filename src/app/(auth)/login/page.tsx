"use client";

import LeftSideSection from "@/components/component-login/left-side-section";
import { ErrorModal } from "@/components/sections/error-modal";
import { useUserData } from "@/hooks/useUserData";
import { secureUrl } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useUserData();

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      router.push("/ai-overview/profile");
    } catch (err) {
      setErrorModalMessage(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat login. Silakan coba lagi."
      );
      setIsErrorModalOpen(true);
    }
  };

  const handleGoogleLogin = () => {
    // Directly redirect to the backend's Google OAuth endpoint
    // This avoids CORS issues since it's not an AJAX request
    window.location.href = secureUrl("/v1/auth/google/login");
  };

  const steps = [
    { number: "01", title: "Login Akun", active: true },
    { number: "02", title: "Lengkapi Data", active: false },
    { number: "03", title: "Analisa", active: false },
  ];

  return (
    <main className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 flex items-center justify-center">
      <div className="container mx-auto w-full max-w-[85rem] flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-16">
        <div className="w-full lg:flex-1 lg:max-w-[45%]">
          <LeftSideSection
            steps={steps}
            currentStepNumber={1}
            showExtendedSteps={false}
          />
        </div>
        <div className="w-full lg:flex-1 lg:max-w-[55%] lg:px-4">
          <div className="bg-[#f0f0f0] lg:h-full h-[73vh] backdrop-blur-sm shadow-xl lg:rounded-2xl rounded-t-2xl border-0 py-6 px-4 sm:py-12 sm:px-6 md:px-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-oswald text-left">
              Login Akun
            </h2>

            <ErrorModal
              isOpen={isErrorModalOpen}
              onClose={() => setIsErrorModalOpen(false)}
              errorMessage={errorModalMessage}
            />

            <form className="space-y-6" onSubmit={handleSubmit}>
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
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
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
                  required
                  disabled={isLoading}
                />
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
                    "Masuk"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
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
                  Sign in with Google
                </button>
              </div>

              {/* Don't have account text */}
              <div className="text-center mt-6 mb-[10rem] lg:mb-0">
                <p className="text-gray-600 text-sm font-poppins">
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    className="text-[#ED80A7] hover:text-pink-600 font-medium transition-colors"
                    onClick={() => router.push("/register")}
                  >
                    Daftar
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
