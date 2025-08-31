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

interface MobileColorRowProps {
  title: string;
  children: React.ReactNode;
}

interface InfoCardProps {
  title: string;
  text: string;
}

interface ColorToneSectionProps {
  colorAnalysisId: string;
}

const ColorCircle: React.FC<ColorCircleProps> = ({ color, className }) => (
  <div
    className={`w-[38px] h-[38px] rounded-full ${className} border border-gray-300`}
    style={{ backgroundColor: color }}
  />
);

const ColorGroup: React.FC<ColorGroupProps> = ({ title, colors }) => (
  <div className="text-center">
    <h3 className="font-poppins lg:text-lg font-bold text-[#323232] mx-1">
      {title}
    </h3>
    <div className="mt-2 grid grid-cols-3 grid-rows-2 gap-3">
      {(colors || []).map((color: string, index: number) => (
        <ColorCircle key={index} color={color} />
      ))}
    </div>
  </div>
);

const MobileColorRow: React.FC<MobileColorRowProps> = ({ title, children }) => (
  <div className="flex items-center justify-between w-full py-3 border-b border-gray-200 last:border-b-0">
    <h3 className="font-poppins text-sm font-bold text-[#323232] flex-shrink-0 pr-4">
      {title}
    </h3>
    <div className="flex flex-wrap gap-2 justify-end">{children}</div>
  </div>
);

const InfoCard: React.FC<InfoCardProps> = ({ title, text }) => (
  <div>
    <h4 className="font-handlee text-sm sm:text-base lg:text-xl italic text-[#323232] font-oswald">
      {title}
    </h4>
    <p className="mt-1 text-sm sm:text-base lg:text-lg text-[#323232] font-poppins">
      {text}
    </p>
  </div>
);

const ColorToneSection: React.FC<ColorToneSectionProps> = ({
  colorAnalysisId,
}) => {
  const {
    data: colorData,
    isLoading,
    error,
  } = useColorToneData(colorAnalysisId);

  if (isLoading)
    return (
      <div className="text-center p-8 text-base sm:text-lg">
        Loading color analysis...
      </div>
    );

  if (error)
    return (
      <div className="text-center p-8 text-red-500 text-base sm:text-lg">
        {error?.message || "Gagal memuat data analisa warna."}
      </div>
    );

  if (!colorData)
    return (
      <div className="text-center p-8 text-base sm:text-lg">
        Data analisa warna tidak ditemukan.
      </div>
    );

  const infoData: InfoCardProps[] = [
    { title: "Make up Tips", text: colorData.make_up_tips },
    { title: "Outfit Tips", text: colorData.tips_warna_kulit_pakaian },
    { title: "Personality", text: colorData.personality },
    { title: "Karakteristik", text: colorData.karakteristik },
  ];

  return (
    <div className="font-sans max-w-6xl w-full mx-auto space-y-[50px]">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-[20px] lg:gap-[50px]">
        <div className="lg:col-span-2 px-[25px] pt-[10px] pb-[18px] rounded-2xl border-[1px] border-neutral-600">
          <h2 className="text-2xl md:text-4xl sm:text-3xl lg:text-5xl font-bold font-oswald ">
            {colorData.name}
          </h2>
          <p className="mt-4 text-[#323232] font-poppins text-sm sm:text-base lg:text-xl">
            {colorData.penjelasan_color_analysis}
          </p>
        </div>

        <div className="lg:col-span-4 px-[25px] justify-between rounded-2xl border-[1px] border-neutral-600 h-full">
          <h2 className="text-center mt-[25px] italic font-handlee text-lg sm:text-xl text-[#323232]">
            Color Guide Line
          </h2>

          <div className="mt-4 lg:hidden">
            <MobileColorRow title="Best Color">
              {(colorData.best_colour || []).map(
                (color: string, index: number) => (
                  <ColorCircle key={index} color={color} />
                )
              )}
            </MobileColorRow>
            <MobileColorRow title="Worst Color">
              {(colorData.worst_colour || []).map(
                (color: string, index: number) => (
                  <ColorCircle key={index} color={color} />
                )
              )}
            </MobileColorRow>
            <MobileColorRow title="Neutral Color">
              {(colorData.neutral_colour || []).map(
                (color: string, index: number) => (
                  <ColorCircle key={index} color={color} />
                )
              )}
            </MobileColorRow>
            <MobileColorRow title="Combination">
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
            </MobileColorRow>
          </div>

          <div className="hidden lg:block lg:space-y-10">
            <div className="mt-4 grid grid-cols-3 gap-8">
              <ColorGroup
                title="Best Color"
                colors={colorData.best_colour || []}
              />
              <ColorGroup
                title="Worst Color"
                colors={colorData.worst_colour || []}
              />
              <ColorGroup
                title="Neutral Color"
                colors={colorData.neutral_colour || []}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0 sm:space-x-4 border border-[#323232] rounded-2xl p-3 sm:p-2">
              <span className="font-bold text-sm text-[#323232] sm:pl-2 flex-shrink-0">
                Combination
              </span>

              {/* Mobile Layout - Colors below text */}
              <div className="block sm:hidden w-full">
                <div className="flex items-center gap-x-2 justify-start overflow-x-auto pb-1">
                  {(colorData.best_colour_combination || []).map(
                    (colorPair: string[], index: number) =>
                      Array.isArray(colorPair) &&
                      colorPair.length === 2 && (
                        <div key={index} className="flex flex-shrink-0">
                          <ColorCircle
                            color={colorPair[0]}
                            className="w-6 h-6"
                          />
                          <ColorCircle
                            color={colorPair[1]}
                            className="w-6 h-6 -ml-2"
                          />
                        </div>
                      )
                  )}
                </div>
              </div>

              {/* Desktop Layout - Colors inline with text */}
              <div className="hidden sm:flex sm:flex-col items-center justify-center flex-1 min-w-0">
                <div className="flex items-center gap-x-2 md:gap-x-3 min-w-0">
                  {(colorData.best_colour_combination || []).map(
                    (colorPair: string[], index: number) =>
                      Array.isArray(colorPair) &&
                      colorPair.length === 2 && (
                        <div key={index} className="flex flex-shrink-0">
                          <ColorCircle
                            color={colorPair[0]}
                            className="w-6 h-6 md:w-7 md:h-7"
                          />
                          <ColorCircle
                            color={colorPair[1]}
                            className="w-6 h-6 md:w-7 md:h-7 -ml-2"
                          />
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#FFC6C6] rounded-2xl shadow-md p-[15px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4">
          {infoData.map(
            (info) => info.text && <InfoCard key={info.title} {...info} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorToneSection;
