import {
  Gem,
  Hourglass,
  Snowflake,
  Sparkle,
  UserRoundSearch,
} from "lucide-react";
import Image from "next/image";
import { Card } from "../ui/card";

export const HeroSection = () => {
  return (
    <main
      className="relative w-full -mt-20 pt-28 pb-16 overflow-hidden 
             bg-cover bg-center bg-[url('/noise.png')]"
    >
      <div className="container mx-auto px-4 z-20 relative">
        <div className="text-center">
          <h1 className="font-serif text-[64px] lg:text-[128px] font-bold text-white tracking-tight">
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
            width={520}
            height={520}
            priority
            className="invisible lg:visible"
          />
        </div>

        <div className="relative z-20 mt-10 lg:mt-24">
          <div className="flex flex-row gap-4 overflow-x-auto snap-x snap-mandatory lg:overflow-visible pb-4">
            <Card className="bg-white border-0 snap-start flex-shrink-0 w-4/5 md:w-2/5 lg:w-auto lg:flex-1 flex flex-col gap-6 p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-[22px] text-[#33333] font-semibold">
                    Diamond
                  </p>
                  <p className="text-[12px]">Hasil Analisa Wajah</p>
                </div>
                <Gem className="h-[2.5rem] w-[2.5rem] bg-[#EC7498] p-2 rounded-lg text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[20px] text-[#33333] font-semibold">
                  Fakta Unik
                </p>
                <div className="flex flex-col items-center bg-[#FFE5ED] rounded-md p-4">
                  <p className="text-[16px] font-bold">Hanya 5–8% Manusia</p>
                  <p className="text-[16px]">Yang memiliki bentuk wajah ini</p>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-[20px] text-[#33333] font-semibold">
                  Penjelasan
                </p>
                <p className="text-[12.5px]">
                  Berarti kamu cocok pakai hijab yang lebih longgar di bagian
                  dagu untuk memberikan keseimbangan.
                </p>
              </div>
            </Card>
            <Card className="bg-white border-0 snap-start flex-shrink-0 w-4/5 md:w-2/5 lg:w-auto lg:flex-1 flex flex-col p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-[22px] text-[#33333] font-semibold">
                    Cool Winter
                  </p>
                  <p className="text-[12px]">Hasil Analisa Kulit</p>
                </div>
                <Snowflake className="h-[2.5rem] w-[2.5rem] bg-[#EC7498] p-2 rounded-lg text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[16px] text-[#33333] font-semibold">
                  Warna Terbaik
                </p>
                <div className="flex gap-0.5">
                  <div className="bg-[#94E1E7] h-12 w-full"></div>
                  <div className="bg-[#F2CEDA] h-12 w-full"></div>
                  <div className="bg-[#B58FFF] h-12 w-full"></div>
                  <div className="bg-[#4C7BFF] h-12 w-full"></div>
                  <div className="bg-[#1A347E] h-12 w-full"></div>
                </div>
                <p className="text-[16px] text-[#33333] font-semibold">
                  Hindari Warna Ini
                </p>
                <div className="flex gap-0.5 mt-0.5">
                  <div className="bg-[#E2E97B] h-12 w-full"></div>
                  <div className="bg-[#FF714D] h-12 w-full"></div>
                  <div className="bg-[#D85636] h-12 w-full"></div>
                  <div className="bg-[#AD2300] h-12 w-full"></div>
                  <div className="bg-[#9A4732] h-12 w-full"></div>
                </div>
              </div>
            </Card>
            <Card className="bg-white border-0 snap-start flex-shrink-0 w-4/5 md:w-2/5 lg:w-auto lg:flex-1 flex flex-col gap-[1.7rem] p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-[20px] text-[#33333] font-semibold">
                    Hourglass
                  </p>
                  <p className="text-[12px]">Hasil Analisa Tubuh</p>
                </div>
                <Hourglass className="h-[2.5rem] w-[2.5rem] bg-[#EC7498] p-2 rounded-lg text-white" />
              </div>
              <div className="flex flex-col">
                <p className="text-[20px] text-[#33333] font-semibold">
                  Karakteristik Utama
                </p>
                <div className="flex flex-col">
                  <p className="text-[12px]">
                    • Bahu dan pinggul memiliki lebar yang sama
                  </p>
                  <p className="text-[12px]">
                    • Pinggang terlihat jelas dan ramping
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-[20px] text-[#33333] font-semibold">
                  BMI Index
                </p>
                <div className="w-full ">
                  <div className="relative">
                    <div className="h-[35px] w-full bg-gradient-to-r from-sky-400 via-cyan-300 via-green-400 via-yellow-300 to-red-500" />
                    <div className="absolute" style={{ left: "28%" }}>
                      <div className="absolute -top-9 h-[4rem] w-0.5 -translate-x-1/2 transform bg-black" />
                      <div className="absolute top-full mt-2 -translate-x-1/2 transform">
                        <div className="whitespace-nowrap rounded-full bg-[#DFF7E5] px-3 py-1 text-[10px] font-medium text-black shadow">
                          52.2 (Normal)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="bg-white border-0 snap-start flex-shrink-0 w-4/5 md:w-2/5 lg:w-auto lg:flex-1 flex flex-col gap-[2.5rem] p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-[20px] text-[#33333] font-semibold">
                    Dewi Sandra
                  </p>
                  <p className="text-[12px] text-gray-500">
                    Selebriti yang Mirip Kamu
                  </p>
                </div>
                <UserRoundSearch className="h-[2.5rem] w-[2.5rem] bg-[#EC7498] p-2 rounded-lg text-white" />
              </div>
              <div className="relative mt-3">
                <Image
                  src="/dewisandra.png"
                  alt="Dewi Sandra"
                  width={500}
                  height={500}
                  className="w-full h-auto object-contain rounded-lg"
                />
                <div className="absolute top-2 left-2 rounded-full bg-[#EF789B] px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  97% Cocok
                </div>
              </div>
            </Card>
            <Card className="bg-white border-0 snap-start flex-shrink-0 w-4/5 md:w-2/5 lg:w-auto lg:flex-1 flex flex-col gap-[2.5rem] p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-[20px] text-[#33333] font-semibold">
                    Rekomendasi
                  </p>
                  <p className="text-[12px]">Produk Terbaik Untuk Kamu</p>
                </div>
                <Sparkle className="h-[2.5rem] w-[2.5rem] bg-[#EC7498] p-2 rounded-lg text-white" />
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
