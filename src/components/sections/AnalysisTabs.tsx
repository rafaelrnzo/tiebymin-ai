"use client";

import Image from "next/image";
import { analysisTabs } from "@/lib/mock-data";

interface AnalysisTabsProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

const AnalysisTabs: React.FC<AnalysisTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex border-b border-gray-300">
      {analysisTabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(index)}
          className={`flex-1 min-w-[70px] lg:min-w-[120px] sm:min-w-0 flex flex-col lg:flex-row items-center justify-center gap-2 py-2 sm:py-3 text-xs sm:text-base font-poppins transition-all -mb-px ${
            activeTab === index
              ? "text-[#323232] font-bold border-b-2 border-[#000000]"
              : "text-gray-500 hover:text-[#323232]"
          }`}
          style={{
            borderBottom: activeTab === index ? "2px solid black" : "none",
          }}
        >
          <Image
            src={tab.icon || "/placeholder.svg"}
            width={18}
            height={18}
            alt={tab.text}
            className={`${activeTab !== index ? "opacity-60" : ""} w-5 h-5`}
          />
          <span className="flex flex-col lg:flex lg:whitespace-normal whitespace-pre-line text-xs sm:text-sm">
            {tab.text}
          </span>
        </button>
      ))}
    </div>
  );
};

export default AnalysisTabs;
