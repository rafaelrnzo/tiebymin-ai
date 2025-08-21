import {
  Gem,
  Hourglass,
  Package2,
  Snowflake,
  Sparkles,
  UserRoundSearch,
} from "lucide-react";
import Image from "next/image";

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
      className={`flex w-full sm:w-[280px] md:w-[300px] flex-row gap-3 sm:gap-4 rounded-xl px-3 sm:px-4 py-2 shadow-lg ${
        isAnalytics
          ? "bg-gradient-to-r from-[#FF7EA4] to-[#FFA2BD]"
          : "bg-white"
      }`}
    >
      <div className={isAnalytics ? "fill-white py-3" : "mt-2"}>{icon}</div>

      <div className="flex flex-col">
        <p
          className={`text-lg sm:text-xl font-bold ${
            isAnalytics ? "text-white mt-2" : "text-[#323232]"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-sm sm:text-xl ${
            isAnalytics ? "text-white" : "text-[#323232]"
          }`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export const HeroSection = () => {
  return (
    <main className="relative w-full -mt-24 overflow-hidden bg-cover bg-center bg-[url('/hero-bg.png')] min-h-screen flex items-center">
      <div className="container mx-auto px-2 sm:px-4 z-20 relative">
        {/* Teks Hero */}
        <div className="text-center relative z-10 mt-20 sm:mt-[8rem] lg:mt-0">
          <h1 className="font-oswald mt-8 sm:mt-20 text-3xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-[156px] font-medium text-[#323232] tracking-tight leading-tight">
            AI Temukan
            <br />
            <div className="flex mt-4 sm:mt-6 md:mt-8 lg:mt-10 text-center gap-8 sm:gap-20 md:gap-32 lg:gap-40 xl:gap-64 justify-center items-center">
              <span className="block font-handlee italic">Gaya</span>
              <span className="block font-handlee italic">Kamu</span>
            </div>
          </h1>
        </div>

        {/* Model Image - Hidden on mobile, visible on md and up */}
        <div className="absolute lg:-bottom-[4rem] bottom-0 inset-x-0 top-1/2 -translate-y-1/2 hidden md:flex justify-center z-20">
          <div className="relative w-full h-screen">
            <Image
              src="/new-model-hero.png"
              alt="AI Fashion Model"
              fill
              priority
              quality={100}
              className="object-contain"
            />
          </div>
        </div>

        <div className="relative">
          <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12 mt-6 sm:mt-8 lg:mt-8">
            {/* First Row - 2 cards */}
            <div className="flex w-full flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-20 xl:gap-64 relative z-30">
              <AnalysisCard
                icon={<Gem className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />}
                title="Diamond"
                subtitle="Hasil Analisa Wajah"
              />
              <AnalysisCard
                icon={
                  <Snowflake className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                }
                title="Cool Winter"
                subtitle="Hasil Analisa Kulit"
              />
            </div>

            {/* Second Row - 2 cards */}
            <div className="flex w-full flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-40 xl:gap-96 relative z-30">
              <div className="relative z-10 w-full sm:w-[280px] md:w-[300px]">
                <AnalysisCard
                  icon={
                    <Hourglass className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                  }
                  title="Hourglass"
                  subtitle="Hasil Analisa Tubuh"
                />
              </div>
              <AnalysisCard
                icon={
                  <UserRoundSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                }
                title="Selebriti Yang Serupa"
                subtitle="Kecocokan Analisa"
              />
            </div>

            {/* Third Row - 2 cards */}
            <div className="flex w-full flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-20 xl:gap-64 relative z-30">
              <AnalysisCard
                icon={
                  <Package2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                }
                title="Rekomendasi Produk"
                subtitle="Saran Produk"
              />
              <a href="/login" className="w-full sm:w-auto">
                <AnalysisCard
                  isAnalytics={true}
                  icon={
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 fill-white text-white" />
                  }
                  title="Coba Sekarang"
                  className="bg-gradient-to-r from-pink-500 to-pink-400 shadow-lg"
                  titleClassName="text-white"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
