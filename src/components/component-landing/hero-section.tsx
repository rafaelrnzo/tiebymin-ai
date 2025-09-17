"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export const HeroSection = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
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
    <main id="hero-section" className="relative w-full overflow-hidden">
      {/* Container untuk Gambar Latar */}
      <div className="w-full">
        {/* Gambar Desktop */}
        <Image
          src="/hero-desktop.webp"
          alt="Analisa Gaya Anda"
          width={1920}
          height={1080}
          className="w-full h-auto lg:block hidden"
          priority
        />
        {/* Gambar Mobile */}
        <Image
          src="/hero-mobile.webp"
          alt="Analisa Gaya Anda - Mobile"
          width={768}
          height={1024}
          className="w-full h-auto lg:hidden block mt-10"
        />
      </div>

      <div className="absolute bottom-0 right-0 w-full h-full pointer-events-none">
        <div className="relative w-full h-full">
          <div
            className="absolute pointer-events-auto
                         bottom-[21%] right-[18%]
                         xs:bottom-[16%] xs:right-[18%]
                         sm:bottom-[23%] sm:right-[18%] 
                         md:bottom-[23%] md:right-[15%]
                         lg:bottom-[10%] lg:right-[23%]
                         xl:bottom-[11%] xl:right-[23%]
                         2xl:bottom-[12%] 2xl:right-[23%]"
          >
            <a
              href={
                isLoggedIn ? "/register?startStep=measurements" : "/register"
              }
              className="inline-block"
            >
              <div
                className="flex items-center justify-center bg-gradient-to-r from-[#FF7EA4] to-[#FFA2BD] rounded-xl md:rounded-2xl gap-2 md:gap-3 
                               px-3 py-2
                               xs:px-4 xs:py-2
                               sm:px-5 sm:py-2.5 
                               md:px-10 md:py-4
                               lg:px-8 lg:py-4 
                               xl:px-10 xl:py-4
                               2xl:px-12 2xl:py-5
                               hover:shadow-lg transition-all duration-300 hover:scale-105 
                               transform-gpu will-change-transform"
              >
                <svg
                  className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7"
                  viewBox="0 0 8 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.92233 1.51074C3.15555 0.828236 4.09857 0.807566 4.37508 1.44873L4.39848 1.51113L4.71321 2.43153C4.78534 2.64261 4.90189 2.83576 5.05502 2.99797C5.20814 3.16018 5.39427 3.28766 5.60085 3.37182L5.68548 3.40341L6.60588 3.71775C7.28838 3.95097 7.30905 4.89399 6.66828 5.1705L6.60588 5.1939L5.68548 5.50863C5.47432 5.58071 5.28109 5.69724 5.11881 5.85037C4.95654 6.00349 4.829 6.18965 4.7448 6.39627L4.71321 6.48051L4.39887 7.4013C4.16565 8.0838 3.22263 8.10447 2.94651 7.4637L2.92233 7.4013L2.60799 6.4809C2.53591 6.26974 2.41937 6.07651 2.26625 5.91423C2.11312 5.75196 1.92697 5.62441 1.72035 5.54022L1.63611 5.50863L0.715707 5.19429C0.0328173 4.96107 0.0121474 4.01805 0.653307 3.74193L0.715707 3.71775L1.63611 3.40341C1.84719 3.33128 2.04035 3.21472 2.20255 3.0616C2.36476 2.90847 2.49224 2.72234 2.5764 2.51577L2.60799 2.43153L2.92233 1.51074ZM6.7806 0.166016C6.85356 0.166016 6.92506 0.186482 6.98697 0.22509C7.04888 0.263697 7.09872 0.318897 7.13082 0.384416L7.14954 0.430046L7.28604 0.830186L7.68657 0.966686C7.75969 0.991527 7.82378 1.03752 7.87074 1.09882C7.91769 1.16013 7.94539 1.234 7.95032 1.31106C7.95524 1.38813 7.93718 1.46492 7.89842 1.53171C7.85966 1.5985 7.80195 1.65228 7.73259 1.68624L7.68657 1.70496L7.28643 1.84146L7.14993 2.24199C7.12504 2.31508 7.07902 2.37915 7.01769 2.42606C6.95636 2.47298 6.88248 2.50063 6.80542 2.50552C6.72836 2.5104 6.65158 2.4923 6.58481 2.45351C6.51804 2.41472 6.4643 2.35698 6.43038 2.28762L6.41166 2.24199L6.27516 1.84185L5.87463 1.70535C5.80151 1.6805 5.73741 1.63452 5.69046 1.57321C5.6435 1.5119 5.61581 1.43803 5.61088 1.36097C5.60595 1.2839 5.62401 1.20711 5.66277 1.14032C5.70153 1.07353 5.75925 1.01975 5.82861 0.985796L5.87463 0.967076L6.27477 0.830576L6.41127 0.430046C6.43757 0.352992 6.48732 0.2861 6.55355 0.23875C6.61979 0.1914 6.69918 0.165967 6.7806 0.166016Z"
                    fill="#F0F0F0"
                  />
                </svg>
                <p
                  className="font-poppins text-white font-bold whitespace-nowrap
                              text-[10px] xs:text-base sm:text-base md:text-base lg:text-base xl:text-lg 2xl:text-xl"
                >
                  Coba Sekarang
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};
