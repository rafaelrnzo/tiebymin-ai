import { UserData } from "@/types";
import Image from "next/image";
import { Footer } from "./footer-pdf";
import { PageHeader } from "./header-pdf";

export const Cover = ({ userData }: { userData: UserData }) => (
  <div className="flex items-center justify-center w-full h-screen">
    <div className="relative bg-[#F0F0F0] w-full min-h-screen flex flex-col self-center overflow-hidden">
      <div className="ml-10">
        <header className="flex justify-between items-center my-4">
          <Image
            src="/vector/tie-by-min-logo.svg"
            alt="Logo Tie By Min"
            width={60}
            height={50}
            quality={100}
            priority
            className="w-[140px] h-auto"
          />
          <div className="font-poppins bg-[#323232] text-white text-xs sm:text-sm font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-sm text-start w-[140px] sm:w-[180px] truncate">
            {userData.name}
          </div>
        </header>
      </div>
      <main className="flex flex-col justify-center px-10 w-full">
        <h1 className="font-oswald text-[64px] font-extrabold text-gray-800">
          HASIL ANALISA LENGKAP
        </h1>
      </main>
      <div className="absolute bottom-0 left-0 right-0 h-[60%]">
        <Image
          src="/many-flower.png"
          alt="Pola Bunga Latar Belakang"
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute -bottom-12 left-0 right-0">
        <Footer page="01" className="bg-[#F0F0F0] w-full py-[3rem] px-10" />
      </div>
    </div>
  </div>
);
