import { ArrowUpRight, Play } from "lucide-react";
import Image from "next/image";

export const SecondSection = () => {
  return (
    <section id="tutorial" className="bg-white px-10 lg:px-[200px]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          <div className="lg:col-span-5 relative w-full rounded-xl overflow-hidden shadow-xl cursor-pointer group">
            <Image
              src="/video-thumbnail.png"
              alt="Video thumbnail of fashion analysis"
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-[#323232]/10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-20 w-20 lg:h-24 lg:w-24 bg-[#FFC6C6] rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                <Play className="h-10 w-10 lg:h-12 lg:w-12 fill-white ml-2" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4 w-full">
            <div className="bg-[#FFC6C6] p-6 rounded-2xl flex flex-col gap-6 w-full">
              <a href="/login">
                <div className="bg-[#2C2C2E] p-4 rounded-xl flex justify-between items-center cursor-pointer transition-transform hover:scale-105 shadow-md">
                  <span className="text-[#FFC6C6] font-semibold text-lg">
                    Coba Sekarang Juga
                  </span>
                  <div className="bg-white/20 p-2 rounded-full border-2 border-[#FFC6C6]">
                    <ArrowUpRight className="h-6 w-6 text-[#FFC6C6]" />
                  </div>
                </div>
              </a>

              <div className="flex flex-col -space-y-4">
                <h2 className="font-oswald text-[48px] text-[#2C2C2E] tracking-tight">
                  Cuman
                </h2>
                <h2 className="font-oswald font-bold text-[48px] text-[#2C2C2E] tracking-tight">
                  Rp 10 Ribuan
                </h2>
              </div>

              <p className="text-[#4F4F4F] text-lg leading-relaxed">
                Nggak perlu mahal! Cukup dengan{" "}
                <strong className="font-bold text-[#2C2C2E]">
                  10 Ribuan Aja
                </strong>
                , kamu udah bisa buka semua hasil analisa AI, lengkap dan
                rekomendasi.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#323232] p-4 rounded-2xl flex flex-col justify-center items-center aspect-square">
                <p className="font-poppins text-3xl lg:text-[48px] font-bold text-[#FFC6C6]">
                  {"<"}2m
                </p>
                <p className="text-xl text-white mt-1 text-cente font-poppins">
                  Hasil Selesai
                </p>
              </div>
              <div className="bg-[#323232] p-4 rounded-2xl flex flex-col justify-center items-center aspect-square">
                <p className="font-poppins text-3xl lg:text-[48px] font-bold text-[#FFC6C6]">
                  100%
                </p>
                <p className="text-xl text-white mt-1 text-center font-poppin">
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
