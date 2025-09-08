"use client";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

export const SecondSection = () => {
  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      const userToken = localStorage.getItem("userToken");
      setIsLoggedIn(
        !!(accessToken && accessToken.trim()) ||
          !!(userToken && userToken.trim())
      );
    }
  }, []);

  return (
    <section
      id="tutorial"
      className="bg-[#f0f0f0] px-4 sm:px-10 lg:px-[110px] lg:mb-[100px] mb-[65px]"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-7 lg:gap-8 gap-4">
          <div className="lg:col-span-5 relative w-full h-full sm:h-80 md:h-full rounded-xl overflow-hidden shadow-xl group">
            <iframe
              src="https://drive.google.com/file/d/1ps5A1C76RYtD3pO1mkzMSqjQ-2n5acGy/preview"
              width="100%"
              height="100%"
              allow="autoplay"
              className="group-hover:scale-105 transition-transform duration-300 rounded-xl"
              title="Fashion Analysis Video"
              frameBorder="0"
              allowFullScreen
            />
          </div>

          <div className="lg:col-span-2 flex flex-col lg:gap-8 gap-4 w-full">
            <div className="bg-[#FFC6C6] p-6 rounded-2xl flex flex-col gap-6 w-full">
              <a
                href={
                  isLoggedIn ? "/register?startStep=measurements" : "/register"
                }
              >
                <div className="bg-[#323232] px-4 py-2 rounded-xl flex justify-between items-center cursor-pointer transition-transform hover:scale-105 shadow-md">
                  <span className="text-[#FFC6C6] font-semibold text-base sm:text-lg">
                    Coba Sekarang Juga
                  </span>
                  <div className="bg-[#f0f0f0]/20 p-2 rounded-full border-2 border-[#FFC6C6]">
                    <ArrowUpRight className="h-6 w-6 text-[#FFC6C6]" />
                  </div>
                </div>
              </a>

              <div className="flex flex-col lg:space-y-2">
                <h2 className="font-oswald text-4xl sm:text-5xl text-[#2C2C2E] tracking-tight">
                  Hanya Dengan
                </h2>
                <div className="flex items-center w-full gap-2">
                  <h2 className="font-oswald font-bold text-4xl sm:text-5xl text-[#2C2C2E] tracking-tight">
                    Rp 9,999
                  </h2>
                  <h2 className="text-[#323232]/30 text-3xl font-oswald line-through">
                    Rp 20,000
                  </h2>
                </div>
              </div>

              <p className="text-[#323232] text-base sm:text-lg leading-relaxed font-poppins">
                Nggak perlu mahal! Cukup dengan{" "}
                <strong className="font-bold text-[#2C2C2E]">
                  Rp 9 Ribuan Aja
                </strong>
                , kamu udah bisa buka semua hasil analisa AI, lengkap dan
                rekomendasi.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-5 lg:mt-0">
              <div className="bg-[#323232] p-4 rounded-2xl flex flex-col justify-center items-center aspect-square">
                <p className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFC6C6]">
                  {"<"}2m
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-[#f0f0f0] mt-1 text-center font-poppins">
                  Hasil Selesai
                </p>
              </div>
              <div className="bg-[#323232] p-4 rounded-2xl flex flex-col justify-center items-center aspect-square">
                <p className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFC6C6]">
                  100%
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-[#f0f0f0] mt-1 text-center font-poppins">
                  Buatan Lokal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
