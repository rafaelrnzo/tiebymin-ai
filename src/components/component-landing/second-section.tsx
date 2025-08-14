import { ArrowUpRight, Play } from "lucide-react";
import Image from "next/image";

export const SecondSection = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 relative w-full rounded-xl overflow-hidden shadow-xl cursor-pointer group">
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

          <div className="lg:col-span-1 flex flex-col gap-4 w-full">
            <div className="bg-[#F9ECEF] p-6 rounded-2xl flex flex-col gap-6 max-w-md mx-auto">
              <div className="bg-[#2C2C2E] p-4 rounded-xl flex justify-between items-center cursor-pointer transition-transform hover:scale-105">
                <span className="text-white font-semibold text-lg">
                  Coba Sekarang Juga
                </span>
                <div className="bg-white/20 p-2 rounded-full">
                  <ArrowUpRight className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="flex flex-col -space-y-4">
                <h2 className="font-oswald text-[56px] text-[#2C2C2E] tracking-tight">
                  Cuman
                </h2>
                <h2 className="font-oswald font-bold text-[64px] text-[#2C2C2E] tracking-tight">
                  Rp 10 Ribuan
                </h2>
              </div>

              {/* Bagian 3: Teks Deskripsi */}
              <p className="text-[#4F4F4F] text-lg leading-relaxed">
                Nggak perlu mahal! Cukup dengan{" "}
                <strong className="font-bold text-[#2C2C2E]">
                  10 Ribuan Aja
                </strong>
                , kamu udah bisa buka semua hasil analisa AI, lengkap dan
                rekomendasi.
              </p>
            </div>

            {/* Dua Kartu Statistik */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FFE5ED] p-4 rounded-md flex flex-col justify-center items-center aspect-square">
                <p className="font-poppins text-3xl lg:text-[48px] font-bold text-[#EF789B]">
                  {"<"}2m
                </p>
                <p className="text-[22px] text-[#EF789B] mt-1 text-center">
                  Hasil Selesai
                </p>
              </div>
              <div className="bg-[#FFE5ED] p-4 rounded-md flex flex-col justify-center items-center aspect-square">
                <p className="font-poppins text-3xl lg:text-[48px] font-bold text-[#EF789B]">
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
