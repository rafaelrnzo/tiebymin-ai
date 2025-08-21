import { ColorAnalysis as ColorToneType, UserData } from "@/types";
import Image from "next/image";
import { Footer } from "./footer-pdf";
import { PageHeader } from "./header-pdf";

export const ColorTone = ({
  userData,
  colorToneDetails,
}: {
  userData: UserData;
  colorToneDetails?: ColorToneType;
}) => {
  const ColorPalette = ({
    title,
    colors,
    isCombination = false,
  }: {
    title?: string;
    colors: string[] | string[][];
    isCombination?: boolean;
  }) => {
    return (
      <div>
        <h3 className="font-semibold text-gray-500 mb-4">{title}</h3>
        {isCombination ? (
          <div className="grid grid-cols-2 gap-y-4">
            {(colors as string[][]).map((pair, idx) => (
              <div
                key={idx}
                className="flex overflow-hidden shadow-md"
                style={{ width: 130, height: 28 }}
              >
                {pair.map((color, subIdx) => (
                  <div
                    key={subIdx}
                    style={{
                      backgroundColor: color,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {(colors as string[]).map((color, index) => (
              <div
                key={index}
                className="w-full h-[30px] shadow-md"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const InfoSection = ({
    title,
    items,
  }: {
    title: string;
    items: string[];
  }) => (
    <div>
      <h3 className="text-lg font-bold text-[#EF789B] mb-3 text-center">
        {title}
      </h3>
      {items.map((item, index) => (
        <p className="text-center text-white" key={index}>
          {item}
        </p>
      ))}
    </div>
  );

  return (
    <div className="flex justify-center w-full h-screen">
      <div className="relative bg-[#F0F0F0] w-full flex flex-col h-screen">
        <div className="px-10">
          <PageHeader width={100} name={userData.name} />
        </div>

        <div className="px-10 py-6 mb-10">
          <h1 className="text-2xl mb-2 font-oswald">
            Color tone kamu {userData.colorTone}
          </h1>
          <p className="text-[#323232] mb-12 text-base">
            {colorToneDetails?.penjelasan_color_analysis ||
              userData.colorToneAnalysis.description}
          </p>

          <div className="grid grid-cols-2 gap-12">
            <ColorPalette
              title="Best Color"
              colors={colorToneDetails?.best_colour || []}
            />
            <ColorPalette
              title="Neutral Color"
              colors={colorToneDetails?.neutral_colour || []}
            />
            <ColorPalette
              title="Worst Color"
              colors={colorToneDetails?.worst_colour || []}
            />
            <ColorPalette
              title="Combination"
              colors={colorToneDetails?.best_colour_combination || []}
              isCombination
            />
          </div>
        </div>

        {/* Dark section - bagian bawah yang memenuhi sisa ruang */}
        <div className="bg-[#323232] p-10 flex-grow flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-10">
            <InfoSection
              title="Make Up Tips"
              items={
                colorToneDetails?.make_up_tips
                  ? [colorToneDetails.make_up_tips]
                  : []
              }
            />
            <InfoSection
              title="Outfit Tips"
              items={
                colorToneDetails?.tips_warna_kulit_pakaian
                  ? [colorToneDetails.tips_warna_kulit_pakaian]
                  : []
              }
            />
            <InfoSection
              title="Personality"
              items={
                colorToneDetails?.personality
                  ? [colorToneDetails.personality]
                  : []
              }
            />
            <InfoSection
              title="Karakteristik"
              items={
                colorToneDetails?.karakteristik
                  ? [colorToneDetails.karakteristik]
                  : []
              }
            />
          </div>
          <div className="mb-[5.5rem]"></div>
          <Footer page="03" className="bg-[#323232] text-white" />
        </div>
      </div>
    </div>
  );
};
