"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LeftSideSection from "@/components/component-login/left-side-section";

export default function LoginPage() {
  const router = useRouter();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login data submitted:", formData);
    router.push("/analyze/prepare-face");
  };

  const steps = [
    { number: "01", title: "Login", active: true },
    { number: "02", title: "Lengkapi Data", active: false },
    { number: "03", title: "Analisa", active: false },
  ];

  return (
    <main className="min-h-screen bg-[url('/login-bg.png')] bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 flex items-center justify-center p-4">
      <div className="w-full max-w-[85rem] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
        <LeftSideSection steps={steps} />

        {/* Right Side - Login Form */}
        <div className="w-full lg:flex-1 lg:max-w-[65%]">
          <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border-0 py-8 px-4 sm:py-12 sm:px-6 md:px-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-oswald text-center lg:text-left">
              Masuk ke Akun
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-gray-600 font-medium text-sm"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-2 focus:border-gray-600 focus:outline-none focus:ring-0"
                  placeholder="Masukkan email"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-gray-600 font-medium text-sm"
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
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-2 focus:border-gray-600 focus:outline-none focus:ring-0"
                  placeholder="Masukkan password"
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-[#323232] hover:bg-gray-700 text-[#ffc6c6] py-3 rounded-lg font-bold mt-8 transition-colors"
              >
                Masuk
              </button>

              {/* Social Login */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
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
                  <span className="text-sm text-gray-700">
                    Masuk dengan Google
                  </span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span className="text-sm text-gray-700">
                    Masuk dengan Apple
                  </span>
                </button>
              </div>

              {/* Register Link */}
              <p className="text-center text-gray-500 text-sm mt-6">
                Belum punya akun?{" "}
                <a
                  href="/register"
                  className="text-gray-800 ml-1 font-extrabold underline"
                >
                  Daftar
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
