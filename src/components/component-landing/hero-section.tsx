import {
  Gem,
  Hourglass,
  Package2,
  Snowflake,
  Sparkles,
  UserRoundSearch,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

type AnalysisCardProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  isAnalytics?: boolean;
  titleClassName?: string;
  className?: string;
};

const AnalysisCard = ({
  icon,
  title,
  subtitle,
  isAnalytics,
}: AnalysisCardProps) => {
  return (
    <div
      className={`flex w-full lg:w-[300px] flex-row items-center gap-4 rounded-xl p-4 shadow-lg ${
        isAnalytics ? "bg-[#EF789B]" : "bg-white"
      }`}
    >
      {/* Icon */}
      <div className={isAnalytics ? "fill-white" : ""}>{icon}</div>

      {/* Text Content */}
      <div className="flex flex-col">
        <p
          className={`text-xl font-bold ${
            isAnalytics ? "text-white" : "text-gray-800"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-sm ${isAnalytics ? "text-white" : "text-gray-600"}`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export const HeroSection = () => {
  return (
    <main
      className="relative w-full -mt-24 pt-28 pb-16 overflow-hidden 
             bg-cover bg-center bg-[url('/hero-bg.png')]"
    >
      <div className="container mx-auto px-4 z-20 relative">
        <div className="text-center pt-12 lg:pt-0">
          <h1 className="font-oswald text-[64px] translate-y-12 lg:text-[128px] font-bold text-black tracking-tight">
            AI Temukan
            <br />
            <div className="flex text-center gap-12 lg:gap-64 justify-center lg:justify-center items-center">
              <span className="block lg:mt-2 lg:mr-[0rem] font-handlee italic">
                Gaya
              </span>
              <span className="block lg:mt-2 lg:pl-[8rem] font-handlee italic">
                Kamu
              </span>
            </div>
          </h1>
          <div className="mx-10 mt-24 md:mt-8 flex justify-center gap-4 visible lg:invisible">
            <Button
              size="lg"
              className="rounded-full bg-[#EF789B] text-white text-xl py-6 border-0"
            >
              <p>Coba Sekarang</p>
            </Button>
            <Button
              size="lg"
              className="rounded-full border-2 text-xl bg-[#EF789B]/10 py-[1.4rem] border-[#EF789B]"
            >
              <p className="text-[#EF789B]">Cara Kerja AI</p>
            </Button>
          </div>
        </div>

        <div className="absolute inset-x-0 -bottom-24 lg:-bottom-[7rem] hidden lg:flex justify-center z-10">
          <Image
            src="/hero-model.png"
            alt="AI Fashion Model"
            width={560}
            height={560}
            priority
            className="hidden lg:block w-[700px] h-[700px] lg:mb-0 lg:w-[600px] lg:h-[900px] object-cover"
          />
        </div>
        <div className="relative z-20 mt-[12rem] lg:mt-2">
          <div className="flex flex-col items-center gap-8">
            <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:justify-evenly">
              <AnalysisCard
                icon={<Gem className="h-8 w-8 text-gray-700" />}
                title="Diamond"
                subtitle="Hasil Analisa Wajah"
              />
              <AnalysisCard
                icon={<Snowflake className="h-8 w-8 text-gray-700" />}
                title="Cool Winter"
                subtitle="Hasil Analisa Kulit"
              />
            </div>
            <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:justify-around">
              <AnalysisCard
                icon={<Hourglass className="h-8 w-8 text-gray-700" />}
                title="Hourglass"
                subtitle="Hasil Analisa Tubuh"
              />
              <AnalysisCard
                icon={<UserRoundSearch className="h-8 w-8 text-gray-700" />}
                title="Selebriti Yang Serupa"
                subtitle="Kecocokan Analisa"
              />
            </div>
            <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:justify-evenly">
              <AnalysisCard
                icon={<Package2 className="h-8 w-8 text-gray-700" />}
                title="Rekomendasi Produk"
                subtitle="Saran Produk"
              />
              <AnalysisCard
                isAnalytics={true}
                icon={<Sparkles className="h-8 w-8 text-white" />}
                title="Coba Sekarang"
                className="bg-gradient-to-r from-pink-500 to-pink-400 shadow-lg"
                titleClassName="text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
