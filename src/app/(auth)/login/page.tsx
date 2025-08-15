"use client";

import LeftSideSection from "@/components/component-login/left-side-section";
import { Button } from "@/components/ui/button";
import { secureUrl } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
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
            first_name: formData.first_name,
            last_name: formData.last_name,
            google_id: uniqueGoogleId,
            is_active: true,
            password: "qweqweasd",
          }),
        });
      } catch (fetchErr) {
        setError(
          "Tidak dapat terhubung ke server. Silakan coba lagi nanti atau hubungi admin."
        );
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const result = await response.json();
      console.log("Registration successful:", result);

      if (result.id) {
        localStorage.setItem("userId", result.id);
        localStorage.setItem(
          "namaUser",
          `${result.first_name} ${result.last_name}`
        );
        console.log(
          "User ID saved to localStorage:",
          result.id,
          result.first_name
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
        setError(
          "Gagal menghubungi server. Pastikan koneksi internet Anda stabil atau hubungi admin jika masalah berlanjut."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mendaftar"
        );
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
    <main className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 flex items-center justify-center py-4">
      <div className="mx-2 lg:mx-10 container w-full max-w-[85rem] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
        <div className="w-full lg:flex-1 lg:max-w-[45%]">
          <LeftSideSection
            steps={steps}
            currentStepNumber={1}
            showExtendedSteps={false}
          />
        </div>
        <div className="w-full lg:flex-1 lg:max-w-[55%] px-4 sm:px-0">
          <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border-0 py-6 px-4 sm:py-12 sm:px-6 md:px-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-oswald text-center lg:text-left">
              Buat Akun Baru
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* First Name */}
              <div className="flex w-full justify-center gap-4">
                <div className="space-y-2 w-full">
                  <label
                    htmlFor="first_name"
                    className="block text-gray-600 font-medium text-sm"
                  >
                    Nama Depan
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                    className="w-full border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-2 focus:border-gray-600 focus:outline-none focus:ring-0"
                    placeholder="Masukkan nama depan"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2 w-full">
                  <label
                    htmlFor="last_name"
                    className="block text-gray-600 font-medium text-sm"
                  >
                    Nama Belakang
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                    className="w-full border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-2 focus:border-gray-600 focus:outline-none focus:ring-0"
                    placeholder="Masukkan nama belakang"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

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
                  disabled={isLoading}
                />
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full bg-[#323232] hover:bg-gray-700 text-[#ffc6c6] py-4 h-[50px] rounded-lg font-bold mt-8 transition-colors"
              >
                {isLoading ? "Sedang Mendaftar..." : "Daftar"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
