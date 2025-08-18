"use client";

import { useCelebrityData } from "@/hooks/useAnalysisData";
import Image from "next/image";
import React, { useState } from "react";

// --- Komponen Utama ---
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
      <div className="text-center p-8">Finding your celebrity match...</div>
    );
  if (error)
    return (
      <div className="text-center p-8 text-red-500">
        {error.message || "An error occurred"}
      </div>
    );

  // Tampilan jika tidak ada kecocokan (celebrityId null atau fetch gagal)
  if (!matchData) {
    return (
      <div className="text-center p-8 border border-dashed rounded-2xl">
        <h3 className="font-bold text-lg text-gray-800">Belum Ada Kecocokan</h3>
        <p className="text-gray-600 mt-2 text-sm">
          Saat ini kami belum menemukan selebriti yang cocok denganmu. Nantikan
          update dari kami!
        </p>
      </div>
    );
  }

  // Tampilan jika ada kecocokan
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col gap-6 w-full">
        <div className="border-[1px] border-neutral-600 rounded-2xl p-6">
          <p className="font-handlee text-[#ED80A7] text-lg mb-1">
            Artis yang mirip kamu
          </p>
          <h3 className="text-3xl font-bold text-gray-800 font-oswald">
            {matchData.name}
          </h3>
          <p className="text-gray-600 text-xl mt-3 leading-relaxed">
            {matchData.description}
          </p>
        </div>
        <div className="bg-[#FFC6C6] rounded-2xl p-6">
          <h4 className="font-bold font-handlee text-gray-800 text-md mb-2">
            Kenapa Cocok?
          </h4>
          <p className="text-gray-600 text-xl leading-relaxed">
            {matchData.similarity_text}
          </p>
        </div>
      </div>
      <div className="relative w-full min-h-[400px]">
        <Image
          src={matchData.picture_url || "/hijab-3.png"}
          alt={matchData.name}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-2xl"
        />
        <span className="absolute bottom-4 left-4 bg-[#323232] bg-opacity-70 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
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
  );
};

export default CelebrityMatchSection;
