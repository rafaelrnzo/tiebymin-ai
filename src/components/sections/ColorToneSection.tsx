"use client";

import React from "react";
import { useColorToneData } from "@/hooks/useAnalysisData";

interface ColorCircleProps {
  color: string;
  className?: string;
}

interface ColorGroupProps {
  title: string;
  colors: string[];
}

interface InfoCardProps {
  title: string;
  text: string;
}

const ColorCircle: React.FC<ColorCircleProps> = ({ color, className }) => (
  <div
    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${className} border border-gray-400`}
    style={{ backgroundColor: color }}
  />
);

const ColorGroup: React.FC<ColorGroupProps> = ({ title, colors }) => (
  <div className="text-center">
    <h3 className="font-poppins text-lg font-bold text-gray-700">{title}</h3>
    <div className="mt-2 grid grid-cols-3 grid-rows-2 gap-2 sm:gap-3">
      {(colors || []).map((color, index) => (
        <ColorCircle key={index} color={color} />
      ))}
    </div>
  </div>
);

const InfoCard: React.FC<InfoCardProps> = ({ title, text }) => (
  <div>
    <h4 className="font-handlee font-bold text-xl italic text-[#323232] font-poppins">
      {title}
    </h4>
    <p className="mt-1 text-xl text-[#323232] font-poppins">{text}</p>
  </div>
);

interface ColorToneSectionProps {
  colorAnalysisId: string;
}

const ColorToneSection: React.FC<ColorToneSectionProps> = ({
  colorAnalysisId,
}) => {
  const {
    data: colorData,
    isLoading,
    error,
  } = useColorToneData(colorAnalysisId);

  if (isLoading)
    return <div className="text-center p-8">Loading color analysis...</div>;

  if (error)
    return (
      <div className="text-center p-8 text-red-500">
        {error instanceof Error
          ? error.message
          : "Gagal memuat data analisa warna."}
      </div>
    );

  if (!colorData)
    return (
      <div className="text-center p-8">Data analisa warna tidak ditemukan.</div>
    );

  const infoData: InfoCardProps[] = [
    { title: "Make up Tips", text: colorData.make_up_tips },
    { title: "Outfit Tips", text: colorData.tips_warna_kulit_pakaian },
    { title: "Personality", text: colorData.personality },
    { title: "Karakteristik", text: colorData.karakteristik },
  ];

  return (
    <div className="font-sans max-w-6xl w-full mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-[50px]">
        <div className="lg:col-span-2 p-6 rounded-2xl border-[1px] border-neutral-600">
          <h2 className="text-5xl font-bold font-oswald leading-tight">
            {colorData.name}
          </h2>
          <p className="mt-4 text-[#323232] font-poppins text-xl">
            {colorData.penjelasan_color_analysis}
          </p>
        </div>

        <div className="lg:col-span-4 p-6 rounded-2xl border-[1px] border-neutral-600">
          <h2 className="text-center font-script font-handlee text-xl font-bold text-gray-800">
            Color Guide Line
          </h2>

          <div className="mt-4 grid grid-cols-3 gap-4 sm:gap-8">
            <ColorGroup title="Best Color" colors={colorData.best_colour} />
            <ColorGroup title="Worst Color" colors={colorData.worst_colour} />
            <ColorGroup
              title="Neutral Color"
              colors={colorData.neutral_colour}
            />
          </div>

          <div className="mt-6 flex items-center space-x-4 border border-gray-300 rounded-2xl p-2">
            <span className="font-bold text-sm text-gray-700 pl-4">
              Combination
            </span>
            <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto">
              {(colorData.best_colour_combination || []).map(
                (colorPair: string[], index: number) =>
                  Array.isArray(colorPair) &&
                  colorPair.length === 2 && (
                    <div key={index} className="flex flex-shrink-0">
                      <ColorCircle color={colorPair[0]} />
                      <ColorCircle color={colorPair[1]} className="-ml-4" />
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#FFC6C6] p-6 rounded-2xl shadow-md mt-[50px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
          {infoData.map(
            (info) => info.text && <InfoCard key={info.title} {...info} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorToneSection;
