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
  zIndex?: string;
};

const AnalysisCard = ({
  icon,
  title,
  subtitle,
  isAnalytics,
  zIndex = "z-30",
}: AnalysisCardProps) => {
  return (
    <div
      className={`flex w-[180px] xs:w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] xl:w-[340px] flex-row gap-2 xs:gap-3 sm:gap-4 rounded-xl px-2 xs:px-3 sm:px-4 py-2 sm:py-3 shadow-lg ${zIndex} relative ${
        isAnalytics
          ? "bg-gradient-to-r from-[#FF7EA4] to-[#FFA2BD]"
          : "bg-[#f0f0f0]"
      }`}
    >
      <div
        className={
          isAnalytics ? "fill-[#f0f0f0] py-1 xs:py-2 sm:py-3" : "mt-1 sm:mt-2"
        }
      >
        {icon}
      </div>

      <div className="flex flex-col justify-center">
        <p
          className={`font-bold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl ${
            isAnalytics ? "text-[#f0f0f0]" : "text-[#323232]"
          }`}
        >
          {title}
        </p>
        {subtitle && (
          <p
            className={`text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl ${
              isAnalytics ? "text-[#f0f0f0]" : "text-[#323232]"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export const HeroSection = () => {
  return (
    <main className="relative w-full flex flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-[url('/hero-bg.png')] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-[200px] z-20 relative pt-16 xs:pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-40">
        {/* Teks Hero */}
        <div className="text-center relative lg:mb-12 xl:mb-16">
          <h1 className="font-oswald lg:text-[156px] md:text-[120px] sm:text-8xl text-[80px] font-medium text-[#323232] tracking-tight leading-[0.9] xs:leading-[0.85] sm:leading-tight">
            AI Temukan
            <br />
            <div className="flex text-center mt-10 lg:mt-0 gap-16 xs:gap-20 sm:gap-28 md:gap-36 lg:gap-40 xl:gap-64 justify-center items-center">
              <span className="block font-handlee italic">Gaya</span>
              <span className="block font-handlee italic">Kamu</span>
            </div>
          </h1>
        </div>

        {/* Analysis Cards Layout */}
        <div className="relative w-full">
          {/* Model Image - Positioned absolutely */}
          <div className="absolute w-full transform lg:-translate-y-1/3 -translate-y-[23rem] h-screen z-10">
            <Image
              src="/new-model-hero.png"
              alt="AI Fashion Model"
              fill
              priority
              quality={100}
              className="object-contain"
            />
            {/* </div> */}
          </div>

          {/* Cards Container - Reduced padding untuk menaikkan posisi */}
          <div className="relative flex flex-col items-center gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
            <div className="flex w-full justify-center gap-[5rem] lg:justify-between items-center px-0 xs:px-2 sm:px-4 md:px-8 lg:px-12 xl:px-20 relative">
              <AnalysisCard
                icon={
                  <Gem className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-700" />
                }
                title="Diamond"
                subtitle="Hasil Analisa Wajah"
              />
              <AnalysisCard
                icon={
                  <Snowflake className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-700" />
                }
                title="Cool Winter"
                subtitle="Hasil Analisa Kulit"
              />
            </div>

            <div className="flex w-full justify-between items-center px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 relative">
              <div className="transform -translate-x-4 xs:-translate-x-6 sm:-translate-x-8 md:-translate-x-12 lg:-translate-x-16 xl:-translate-x-20">
                <AnalysisCard
                  icon={
                    <Hourglass className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-700" />
                  }
                  title="Hourglass"
                  subtitle="Hasil Analisa Tubuh"
                  zIndex="z-0" // Lower z-index so it appears behind the model
                />
              </div>
              <div className="transform translate-x-4 xs:translate-x-6 sm:translate-x-8 md:translate-x-12 lg:translate-x-16 xl:translate-x-20">
                <AnalysisCard
                  icon={
                    <UserRoundSearch className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-700" />
                  }
                  title="Selebriti Yang Serupa"
                  subtitle="Kecocokan Analisa"
                />
              </div>
            </div>

            {/* Third Row - 2 cards */}
            <div className="flex w-full justify-center gap-[5rem] lg:justify-between items-center px-0 xs:px-2 sm:px-4 md:px-8 lg:px-12 xl:px-20 relative">
              <AnalysisCard
                icon={
                  <Package2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-700" />
                }
                title="Rekomendasi Produk"
                subtitle="Saran Produk"
              />
              <a href="/register" className="inline-block">
                <AnalysisCard
                  isAnalytics={true}
                  icon={
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 fill-[#f0f0f0] text-[#f0f0f0]" />
                  }
                  title="Coba Sekarang"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
