// components/component-landing/second-section.tsx

import Image from "next/image";
import { Play, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button"; // Pastikan path ini benar

export const SecondSection = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Kolom Video (3/4 dari lebar) */}
          <div className="lg:col-span-3 relative w-full aspect-video rounded-md overflow-hidden shadow-xl cursor-pointer group">
            <Image
              src="/video-thumbnail.png"
              alt="Video thumbnail of fashion analysis"
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-20 w-20 lg:h-24 lg:w-24 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                <Play className="h-10 w-10 lg:h-12 lg:w-12 fill-white ml-2" />
              </div>
            </div>
          </div>

          {/* Kolom Konten (1/4 dari lebar) */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Kartu Promo */}
            <div className="bg-[#EC7498] p-6 rounded-md flex flex-col">
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-grow px-4 py-3 rounded-full text-white font-semibold border border-white bg-transparent hover:bg-white hover:text-[#EC7498] transition-colors"
                >
                  <span>Coba Sekarang!</span>
                </Button>
                <ArrowUpRight className="h-14 w-14 bg-white p-1 rounded-full text-[#EC7498]" />
              </div>

              <div className="flex flex-col">
                <h2 className="mt-4 text-[60px] font-serif font-bold text-white">
                  Cuman
                </h2>
                <h2 className="text-[70px] font-serif font-bold text-white">
                  Rp 10k
                </h2>
              </div>

              <p className="mt-4 text-white text-[20px]">
                Nggak perlu mahal! Dengan cuma
                <strong className="font-bold text-white">10 Ribuan Aja</strong>
                kamu udah bisa buka semua Hasil analisa AI, lengkap dan
                rekomendasi.
              </p>
            </div>

            {/* Dua Kartu Statistik */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FFE5ED] p-4 rounded-md flex flex-col justify-center items-center aspect-square">
                <p className="font-serif text-3xl lg:text-[48px] font-bold text-[#EF789B]">
                  {"<"}2m
                </p>
                <p className="text-[22px] text-[#EF789B] mt-1 text-center">
                  Hasil Selesai
                </p>
              </div>
              <div className="bg-[#FFE5ED] p-4 rounded-md flex flex-col justify-center items-center aspect-square">
                <p className="font-serif text-3xl lg:text-[48px] font-bold text-[#EF789B]">
                  100%
                </p>
                <p className="text-[22px] text-[#EF789B] mt-1 text-center">
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
