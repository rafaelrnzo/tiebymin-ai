"use client";

import { useCelebrityData } from "@/hooks/useAnalysisData";
import Image from "next/image";
import React, { useState } from "react";

interface CelebrityMatchSectionProps {
  celebrityId: string | null;
}

const CelebrityMatchSection: React.FC<CelebrityMatchSectionProps> = ({
  celebrityId,
}) => {
  const { data: matchData, isLoading, error } = useCelebrityData(celebrityId);
  const [matchPercentage] = useState(
    () => Math.floor(Math.random() * (95 - 80 + 1)) + 80
  );

  if (isLoading)
    return (
      <div className="text-center p-8 text-base sm:text-lg">
        Finding your celebrity match...
      </div>
    );
  if (error)
    return (
      <div className="text-center p-8 text-red-500 text-base sm:text-lg">
        {error.message || "An error occurred"}
      </div>
    );

  if (!matchData) {
    return (
      <div className="text-center p-8 border border-dashed rounded-2xl">
        <h3 className="font-bold text-base sm:text-lg text-[#323232]">
          Belum Ada Kecocokan
        </h3>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Saat ini kami belum menemukan selebriti yang cocok denganmu. Nantikan
          update dari kami!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
      {/* Mobile: Image first, then content */}
      <div className="w-full md:hidden">
        <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] max-w-sm mx-auto">
          <Image
            src={matchData.picture_url || "/hijab-3.png"}
            alt={matchData.name}
            fill
            className="rounded-2xl object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <span className="absolute bottom-4 left-4 bg-[#323232] bg-opacity-70 text-[#f0f0f0] px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
            <Image
              src="/overview-ai/icons/ai-generate.svg"
              width={16}
              height={16}
              alt="Match Icon"
            />
            {matchPercentage}% Match
          </span>
        </div>
      </div>

      {/* Desktop: Side by side layout */}
      <div className="hidden md:flex flex-row gap-[20px] lg:gap-[50px]">
        <div className="flex flex-col gap-[20px] lg:gap-[50px] w-full md:w-1/2">
          <div className="border-[1px] border-neutral-600 rounded-2xl p-4 sm:p-6">
            <p className="font-handlee italic text-[#EF789B] text-lg sm:text-xl mb-1">
              Artis yang mirip kamu
            </p>
            <h3 className="text-xl sm:text-3xl font-bold text-[#323232] font-oswald">
              {matchData.name}
            </h3>
            <p className="text-[#323232] font-poppins text-sm sm:text-base lg:text-lg mt-3 leading-relaxed">
              {matchData.description}
            </p>
          </div>
          <div className="bg-[#FFC6C6] rounded-2xl p-4 sm:p-6">
            <h4 className=" font-handlee text-[#323232] text-lg sm:text-xl mb-2 italic">
              Kenapa Cocok?
            </h4>
            <p className="text-[#323232] font-poppins text-sm sm:text-base lg:text-lg leading-relaxed">
              {matchData.similarity_text}
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-1/2 min-h-[300px] sm:min-h-[400px]">
          <Image
            src={matchData.picture_url || "/hijab-3.png"}
            alt={matchData.name}
            fill
            className="rounded-2xl object-cover object-center"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <span className="absolute bottom-4 left-4 bg-[#323232] bg-opacity-70 text-[#f0f0f0] px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2">
            <Image
              src="/overview-ai/icons/ai-generate.svg"
              width={16}
              height={16}
              alt="Match Icon"
            />
            {matchPercentage}% Match
          </span>
        </div>
      </div>

      {/* Mobile: Content after image */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="border-[1px] border-neutral-600 rounded-2xl p-4 sm:p-6">
          <p className="font-handlee text-[#323232] text-lg sm:text-xl mb-1">
            Artis yang mirip kamu
          </p>
          <h3 className="text-xl sm:text-3xl font-bold text-[#323232] font-oswald">
            {matchData.name}
          </h3>
          <p className="text-[#323232] font-poppins text-sm sm:text-base mt-3 leading-relaxed">
            {matchData.description}
          </p>
        </div>
        <div className="bg-[#FFC6C6] rounded-2xl p-4 sm:p-6">
          <h4 className="font-bold font-handlee text-[#323232] text-lg sm:text-xl mb-2 italic">
            Kenapa Cocok?
          </h4>
          <p className="text-[#323232] font-poppins text-sm sm:text-base leading-relaxed">
            {matchData.similarity_text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CelebrityMatchSection;
