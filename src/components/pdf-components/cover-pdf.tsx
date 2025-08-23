import { UserData } from "@/types";
import Image from "next/image";
import { Footer } from "./footer-pdf";

export const Cover = ({ userData }: { userData: UserData }) => (
  <div className="flex flex-col min-h-screen bg-[#f0f0f0]">
    <header className="flex justify-between items-center pt-[50px] pl-10">
      <Image
        src="/vector/tie-by-min-logo.svg"
        alt="Logo Tie By Min"
        width={140}
        height={50}
        quality={100}
        priority
        className="w-[140px] h-auto"
      />
      <div className="font-poppins bg-[#323232] text-white text-xs sm:text-sm font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-sm text-start w-[140px] sm:w-[180px] truncate">
        {userData.name}
      </div>
    </header>

    <div className="flex flex-col">
      <main className="px-10">
        <h1 className="font-oswald my-10 text-[64px] font-extrabold text-gray-800">
          HASIL ANALISA LENGKAP
        </h1>
      </main>

      <div className="mt-auto">
        <Image
          src="/many-flower.png"
          alt="Pola Bunga Latar Belakang"
          width={1920}
          height={80}
          className="h-[600px] object-cover"
        />
      </div>
    </div>
    <Footer page="01" className="bg-[#F0F0F0] w-full py-6 px-10" />
  </div>
);
