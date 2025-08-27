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
  <div className="border-[1px] p-[20px] w-full border-neutral-600 rounded-2xl h-full">
    <div className="flex flex-row items-center gap-[10px] lg:flex-col lg:items-start">
      <div className="">
        <Image src={icon} width={32} height={32} alt={`${category} Icon`} />
      </div>
      <h3 className="font-handlee italic text-[#323232] mt-1 text-base sm:text-xl">
        {category}
      </h3>
    </div>
    <p className="text-[#323232] mt-2 font-poppins text-sm sm:text-base lg:text-lg leading-relaxed">
      {tip}
    </p>
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
      <div className="text-center p-8 text-sm sm:text-base">
        Merangkum tips terbaik untukmu...
      </div>
    );
  }

  if (isError || error) {
    return (
      <div className="text-center p-8 text-red-500 text-sm sm:text-base">
        {error?.message || "Gagal memuat rangkuman tips."}
      </div>
    );
  }

  if (!allTips) {
    return (
      <div className="text-center p-8 text-sm sm:text-base">
        Tidak ada tips yang bisa ditampilkan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] lg:gap-[50px]">
      <TipCard
        category="Tips untuk bentuk wajah kamu"
        tip={allTips.faceTip}
        icon="/overview-ai/icons/ri_shape-fill.svg"
      />
      <TipCard
        type
        category="Tips untuk bentuk badan kamu"
        tip={allTips.bodyTip}
        icon="/overview-ai/icons/healthicons_body.svg"
      />
      <TipCard
        type
        category="Tips untuk Tone Warna Kamu"
        tip={allTips.colorTip}
        icon="/overview-ai/icons/mdi_color.svg"
      />
      <div className="bg-[#FFC6C6] p-[20px] rounded-2xl shadow-md flex flex-col gap-[10px]">
        <svg
          width="26"
          height="28"
          viewBox="0 0 26 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.38461 4.81C10.1321 2.6225 13.1546 2.55625 14.0409 4.61125L14.1159 4.81125L15.1246 7.76125C15.3558 8.43779 15.7294 9.05689 16.2202 9.57678C16.7109 10.0967 17.3075 10.5053 17.9696 10.775L18.2409 10.8762L21.1909 11.8838C23.3784 12.6313 23.4446 15.6537 21.3909 16.54L21.1909 16.615L18.2409 17.6238C17.5641 17.8548 16.9447 18.2283 16.4246 18.7191C15.9045 19.2099 15.4957 19.8065 15.2259 20.4688L15.1246 20.7388L14.1171 23.69C13.3696 25.8775 10.3471 25.9438 9.46211 23.89L9.38461 23.69L8.37711 20.74C8.14609 20.0632 7.77258 19.4439 7.28179 18.9238C6.791 18.4037 6.19435 17.9949 5.53211 17.725L5.26211 17.6238L2.31211 16.6162C0.123363 15.8687 0.0571129 12.8462 2.11211 11.9612L2.31211 11.8838L5.26211 10.8762C5.93865 10.6451 6.55775 10.2715 7.07764 9.78071C7.59753 9.28993 8.00613 8.69336 8.27586 8.03125L8.37711 7.76125L9.38461 4.81ZM21.7509 0.5C21.9847 0.5 22.2139 0.565598 22.4123 0.689339C22.6107 0.813081 22.7705 0.990003 22.8734 1.2L22.9334 1.34625L23.3709 2.62875L24.6546 3.06625C24.889 3.14587 25.0944 3.29327 25.2449 3.48977C25.3954 3.68627 25.4842 3.92302 25.5 4.17003C25.5158 4.41703 25.4579 4.66316 25.3336 4.87723C25.2094 5.0913 25.0244 5.26367 24.8021 5.3725L24.6546 5.4325L23.3721 5.87L22.9346 7.15375C22.8549 7.38804 22.7073 7.59337 22.5108 7.74374C22.3142 7.89411 22.0774 7.98274 21.8304 7.9984C21.5834 8.01407 21.3373 7.95606 21.1233 7.83172C20.9093 7.70739 20.7371 7.52233 20.6284 7.3L20.5684 7.15375L20.1309 5.87125L18.8471 5.43375C18.6128 5.35413 18.4073 5.20673 18.2568 5.01023C18.1063 4.81373 18.0176 4.57698 18.0018 4.32997C17.986 4.08297 18.0439 3.83684 18.1681 3.62277C18.2923 3.4087 18.4773 3.23633 18.6996 3.1275L18.8471 3.0675L20.1296 2.63L20.5671 1.34625C20.6514 1.09928 20.8109 0.884886 21.0232 0.733124C21.2354 0.581361 21.4899 0.499843 21.7509 0.5Z"
            fill="#323232"
          />
        </svg>
        <h3 className="font-handlee italic text-[#323232] text-base sm:text-xl">
          Rekap Cepat Tips Kamu
        </h3>
        <div className="text-[#323232] text-sm sm:text-base lg:text-lg leading-relaxed">
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
