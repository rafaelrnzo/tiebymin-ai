"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const INSTRUCTION_CARDS = [
  {
    title: "Lepaskan Kacamata",
    description: "Lepaskan Kacamata Kamu Supaya Wajah Terlihat Jelas",
    icon: "/vector/kacamata.svg",
  },
  {
    title: "Hapus Makeup",
    description: "Hapus Makeup Agar AI Menganalisa Kulit Kamu Yang Natural",
    icon: "/vector/perempuan.svg",
  },
  {
    title: "Pencahayaan Terang",
    description: "Ambil Gambar Dengan Pencahayaan Yang Terang Natural",
    icon: "/vector/sun.svg",
  },
];

export default function FaceScanFinalPage() {
  const router = useRouter();

  const handleNext = () => {
    // Implement navigation or next step here
  };

  return (
    <div className="min-h-screen w-full bg-[url('/login-bg.png')]  px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-3 lg:gap-20 items-start">
        {/* Left Column - Progress Steps */}
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:col-span-1 flex flex-col items-center justify-center space-y-4">
          <div className="mb-8 w-full flex justify-center">
            <Image
              src="/tie-by-min-logo.png"
              alt="Tiebymin Logo"
              width={200}
              height={64}
              priority
              className="object-contain"
              style={{ width: "auto", height: "auto", maxWidth: "100%" }}

            />
          </div>

          {/* Step 1: Analisa */}
          <div className="bg-[#F0F0F0] rounded-xl px-4 py-3 flex items-center justify-between w-full">
            <span className="text-gray-800 font-bold text-base md:text-lg">Analisa</span>
            <span className="text-gray-800 font-bold text-base md:text-lg">03</span>
          </div>

          {/* Step 2: Pilih Bentuk Tubuh */}
          <div className="bg-[#F0F0F0] rounded-xl px-4 py-3 flex items-center justify-between w-full">
            <span className="text-gray-800 font-bold text-base md:text-lg">Pilih bentuk Tubuh Kamu</span>
            <Image
              src="/stars.png"
              alt="stars"
              width={24}
              height={24}
              style={{ filter: "brightness(0)" }}
            />
          </div>

          {/* Step 3: Scan Wajah (Active) */}
          <div className="bg-[#EF789B] rounded-2xl p-4 md:p-5 text-white w-full">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base md:text-lg font-bold">Scan Wajah Kamu</h2>
              <Image src="/stars.png" alt="stars" width={24} height={24} />
            </div>  
            <p className="text-xs md:text-sm leading-relaxed text-white">
              Kami butuh foto selfie-mu biar bisa analisis bentuk wajah dan warna kulit dengan akurat. Dengan begitu, rekomendasi hijab yang kami kasih bisa lebih sesuai.
            </p>
          </div>
        </div>

        {/* Right Column - Instructions */}
        <div className="w-full lg:col-span-2 flex flex-col items-center lg:items-start mt-10 lg:mt-0">
          <div className="flex flex-col mb-8 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-oswald font-bold text-[#333333] text-center lg:text-left">
              Ambil Gambar Wajah Kamu
            </h1>
            <p className="mt-2 sm:mt-3 text-center lg:text-left text-base md:text-lg">
              Supaya Bisa Di Analisa Ambil Foto Dulu Ya...
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full mb-8">
            {INSTRUCTION_CARDS.map((card, index) => (
              <div
                key={index}
                className="bg-transparent border border-black rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center space-y-3 sm:space-y-4"
              >
                <div className="h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center mb-2">
                  <Image
                    src={card.icon}
                    alt={`${card.title} icon`}
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-gray-800">{card.title}</h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-snug">{card.description}</p>
              </div>
            ))}
          </div>

          <button
            className="bg-[#323232] text-white rounded-lg w-full py-3 px-8 font-semibold text-base sm:text-lg hover:bg-black transition-colors"
            onClick={handleNext}
          >
            Selanjutnya &gt;
          </button>
        </div>
      </div>
    </div>
  );
}