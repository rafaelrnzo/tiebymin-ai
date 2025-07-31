import React from "react";
import Image from "next/image";
import { Gem, Hourglass, Star, Snowflake, ShoppingBag } from "lucide-react";
import { Card } from "../ui/card";

export const HeroSection = () => {
  return (
    <main className="relative w-full bg-[radial-gradient(ellipse_at_center,_#FFC8D8,_#EE769A)] -mt-20 pt-28 pb-16 overflow-hidden">
      <div className="container mx-auto px-4 z-20 relative">
        <div className="text-center">
          <h1 className="text-[62px] lg:text-[128px] font-bold text-white tracking-tight">
            AI Temukan
            <br />
            <div className="flex text-center gap-4 justify-center lg:justify-evenly items-center">
              <span className="block mt-2 lg:mr-[12rem]">Gaya</span>
              <span className="block mt-2 lg:mr-[4rem]">Kamu</span>
            </div>
          </h1>
        </div>

        <div className="absolute inset-x-0 -bottom-16 lg:-bottom-24 flex justify-center z-10">
          <Image
            src="/hero-model.png"
            alt="AI Fashion Model"
            width={891}
            height={893}
            priority
            className="object-contain object-bottom w-[450px] h-auto md:w-[650px] lg:w-[891px]"
          />
        </div>

        {/* === Kartu Informasi === */}
        <div className="relative z-20 mt-10 lg:mt-24">
          <div className="flex flex-row gap-4 overflow-x-auto snap-x snap-mandatory lg:overflow-visible pb-4">
            <Card className="bg-white border-0 snap-start flex-shrink-0 w-4/5 md:w-2/5 lg:w-auto lg:flex-1 flex flex-col justify-between p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-[20px] text-[#33333] font-semibold">
                    Yasmin
                  </p>
                  <p className="text-[12px]">Hasil Analisa Wajah</p>
                </div>
                <Gem className="h-8 w-8 bg-[#EC7498] p-1 rounded-lg text-white" />
              </div>
              <p className="text-[9px] my-2">
                bentuk wajah dengan tulang pipi yang lebar dan menonjol, dahi
                dan rahang yang lebih sempit, serta dagu yang cenderung lancip
                atau runcing.
              </p>
              <div className="flex flex-col">
                <p className="text-[20px] text-[#33333] font-semibold">
                  Bentuk Diamond
                </p>
                <p className="text-[9px]">
                  Berarti kamu cocok pakai gaya hijab yang lebih longgar di
                  bagian dagu untuk memberikan keseimbangan bentuk wajah yang
                  sempurna.
                </p>
              </div>
            </Card>
            <Card className="bg-white border-0 snap-start flex-shrink-0 w-4/5 md:w-2/5 lg:w-auto lg:flex-1 flex flex-col justify-between p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-[20px] text-[#33333] font-semibold">
                    Cool Winter
                  </p>
                  <p className="text-[12px]">Hasil Analisa Kulit</p>
                </div>
                <Snowflake className="h-8 w-8 bg-[#EC7498] text-white p-1 rounded-md" />
              </div>
              <p className="text-[9px] my-2">
                Ini berarti kulitmu memiliki undertone dingin dengan hint biru
                atau pink yang memberikan kesan elegan dan kontras tinggi.
              </p>
              <div className="flex flex-col">
                <p className="text-[20px] text-[#33333] font-semibold">
                  Warna Terbaik
                </p>
                <div className="flex gap-0.5">
                  <div className="bg-sky-500 h-2 w-full"></div>
                  <div className="bg-red-500 h-2 w-full"></div>
                  <div className="bg-amber-500 h-2 w-full"></div>
                  <div className="bg-pink-500 h-2 w-full"></div>
                  <div className="bg-green-500 h-2 w-full"></div>
                </div>
                <div className="flex gap-0.5 mt-0.5">
                  <div className="bg-slate-900 h-2 w-full"></div>
                  <div className="bg-stone-900 h-2 w-full"></div>
                  <div className="bg-blue-900 h-2 w-full"></div>
                  <div className="bg-zinc-900 h-2 w-full"></div>
                  <div className="bg-purple-900 h-2 w-full"></div>
                </div>
              </div>
            </Card>
            <Card className="bg-white border-0 snap-start flex-shrink-0 w-4/5 md:w-2/5 lg:w-auto lg:flex-1 flex flex-col justify-between p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-[20px] text-[#33333] font-semibold">
                    Hourglass
                  </p>
                  <p className="text-[12px]">Hasil Analisa Tubuh</p>
                </div>
                <Hourglass className="h-8 w-8 bg-[#EC7498] text-white p-1 rounded-md" />
              </div>
              <p className="text-[9px] my-2">
                Proporsi pinggang yang lebih kecil dibandingkan bahu dan
                pinggul. Bentuk ini sangat feminin dan seimbang.
              </p>
              <div className="flex flex-col">
                <p className="text-[20px] text-[#33333] font-semibold">
                  Karakteristik Utama
                </p>
                <div className="flex flex-col">
                  <p className="text-[9px]">
                    • Bahu dan pinggul memiliki lebar yang sama
                  </p>
                  <p className="text-[9px]">
                    • Pinggang terlihat jelas dan ramping
                  </p>
                  <p className="text-[9px]">
                    • Proporsi tubuh cenderung simetris dan elegan
                  </p>
                </div>
              </div>
            </Card>
            <Card className="bg-white border-0 snap-start flex-shrink-0 w-4/5 md:w-2/5 lg:w-auto lg:flex-1 flex flex-col justify-between p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-[20px] text-[#33333] font-semibold">
                    Dewi Sandra
                  </p>
                  <p className="text-[12px]">Selebriti yang Mirip Kamu</p>
                </div>
                <div className="flex flex-col rounded-lg bg-[#EC7498] p-1">
                  <p className="text-[14px] text-white font-bold">97%</p>
                  <p className="text-[8px] text-white text-center font-semibold">
                    cocok
                  </p>
                </div>
              </div>
              <Image
                src="/dewisandra.png"
                alt="rec1"
                width={500}
                height={500}
                className="w-full h-auto object-contain mt-2"
              />
            </Card>
            <Card className="bg-white border-0 snap-start flex-shrink-0 w-4/5 md:w-2/5 lg:w-auto lg:flex-1 flex flex-col justify-between p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-[20px] text-[#33333] font-semibold">
                    Rekomendasi
                  </p>
                  <p className="text-[12px]">Produk Terbaik Untuk Kamu</p>
                </div>
                <ShoppingBag className="h-8 w-8 bg-[#EC7498] text-white p-1 rounded-md" />
              </div>
              <Image
                src="/hero-grid.png"
                alt="rec1"
                width={500}
                height={500}
                className="w-full h-auto object-contain mt-2"
              />
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};
