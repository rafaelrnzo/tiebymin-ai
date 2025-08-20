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
      className={`flex w-full sm:w-[300px] flex-row gap-4 rounded-xl px-4 py-2 shadow-lg ${
        isAnalytics
          ? "bg-gradient-to-r from-[#FF7EA4] to-[#FFA2BD]"
          : "bg-white"
      }`}
    >
      <div className={isAnalytics ? "fill-white py-3" : "mt-2"}>{icon}</div>

      <div className="flex flex-col">
        <p
          className={`text-xl font-bold ${
            isAnalytics ? "text-white mt-2" : "text-[#323232]"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-xl ${isAnalytics ? "text-white" : "text-[#323232]"}`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export const HeroSection = () => {
  return (
    <main className="relative w-full -mt-24 pt-28 overflow-hidden bg-cover bg-center bg-[url('/hero-bg.png')] min-h-screen flex items-center">
      <div className="container mx-auto px-4 z-20 relative">
        {/* Teks Hero */}
        <div className="text-center pt-12 relative z-10">
          <h1 className="font-oswald text-5xl sm:text-6xl md:text-8xl lg:text-[156px] font-medium text-[#323232] tracking-tight">
            AI Temukan
            <br />
            <div className="flex flex-col sm:flex-row text-center gap-4 sm:gap-12 lg:gap-64 justify-center items-center">
              <span className="block font-handlee italic">Gaya</span>
              <span className="block font-handlee italic">Kamu</span>
            </div>
          </h1>
        </div>

        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 hidden md:flex justify-center z-20">
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
          <div className="flex flex-col items-center gap-4 sm:gap-8 mt-8">
            <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-evenly relative z-30">
              <AnalysisCard
                icon={<Gem className="h-5 w-5 text-gray-700" />}
                title="Diamond"
                subtitle="Hasil Analisa Wajah"
              />
              <AnalysisCard
                icon={<Snowflake className="h-5 w-5 text-gray-700" />}
                title="Cool Winter"
                subtitle="Hasil Analisa Kulit"
              />
            </div>

            <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-around relative">
              <div className="relative z-10">
                <AnalysisCard
                  icon={<Hourglass className="h-5 w-5 text-gray-700" />}
                  title="Hourglass"
                  subtitle="Hasil Analisa Tubuh"
                />
              </div>
              <div className="relative z-30">
                <AnalysisCard
                  icon={<UserRoundSearch className="h-5 w-5 text-gray-700" />}
                  title="Selebriti Yang Serupa"
                  subtitle="Kecocokan Analisa"
                />
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-evenly relative z-30">
              <AnalysisCard
                icon={<Package2 className="h-5 w-5 text-gray-700" />}
                title="Rekomendasi Produk"
                subtitle="Saran Produk"
              />
              <a href="/login">
                <AnalysisCard
                  isAnalytics={true}
                  icon={<Sparkles className="h-5 w-5 fill-white text-white" />}
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
