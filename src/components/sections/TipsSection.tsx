"use client";

import React from "react";
import Image from "next/image";
import { AnalysisData } from "@/types";
import { useAllTips } from "@/hooks/useAllTips";

interface TipCardProps {
  category: string;
  tip: string;
  icon: string;
  type?: boolean;
}

const TipCard: React.FC<TipCardProps> = ({ category, tip, icon }) => (
  <div className="border-[1px] border-neutral-600 rounded-2xl p-4 sm:p-6 h-full">
    <div className="flex flex-row items-center gap-2 lg:flex-col lg:items-start">
      <div className="mb-3">
        <Image src={icon} width={32} height={32} alt={`${category} Icon`} />
      </div>
      <h3 className="font-bold font-handlee italic text-[#323232] mt-1 mb-3 text-xl">
        {category}
      </h3>
    </div>
    <span className="text-[#323232] font-poppins lg:text-xl text-xs leading-relaxed space-y-2">
      {tip}
    </span>
  </div>
);

interface TipsSectionProps {
  analysisData: AnalysisData;
}

const TipsSection: React.FC<TipsSectionProps> = ({ analysisData }) => {
  const {
    data: allTips,
    isLoading,
    error,
    isError,
  } = useAllTips({
    analysisData,
  });

  if (isLoading) {
    return (
      <div className="text-center p-8">Merangkum tips terbaik untukmu...</div>
    );
  }

  if (isError || error) {
    return (
      <div className="text-center p-8 text-red-500">
        {error?.message || "Gagal memuat rangkuman tips."}
      </div>
    );
  }

  if (!allTips) {
    return (
      <div className="text-center p-8">
        Tidak ada tips yang bisa ditampilkan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] lg:gap-[50px]">
      <TipCard
        category="Tips Bentuk Wajah"
        tip={allTips.faceTip}
        icon="/overview-ai/icons/ri_shape-fill.svg"
      />
      <TipCard
        type
        category="Tips Bentuk Tubuh"
        tip={allTips.bodyTip}
        icon="/overview-ai/icons/healthicons_body.svg"
      />
      <TipCard
        type
        category="Tips Warna Pakaian"
        tip={allTips.colorTip}
        icon="/overview-ai/icons/mdi_color.svg"
      />
      <div className="bg-[#FFC6C6] rounded-2xl p-4 sm:p-6 shadow-md">
        <div className="flex lg:flex-col flex-row items-center lg:items-start gap-2">
          <div className="mb-3">
            <Image
              src="/overview-ai/icons/ic_baseline-tips-and-updates.svg"
              width={32}
              height={32}
              alt="Tips & Trick Icon"
            />
          </div>
          <h3 className="font-bold font-handlee italic text-[#323232] mt-1 mb-3 text-xl">
            Tips Makeup & BMI
          </h3>
        </div>
        <div className="text-[#323232] lg:text-xl text-xs leading-relaxed">
          <div className="text">
            <strong>Makeup:</strong> {allTips.makeupTip}
          </div>
          <div className="text mt-2">
            <strong>Gaya Sesuai BMI:</strong> {allTips.bmiTip}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsSection;
