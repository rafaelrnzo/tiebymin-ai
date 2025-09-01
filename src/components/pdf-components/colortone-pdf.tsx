import { ColorAnalysis as ColorToneType, UserData } from "@/types";
import { Footer } from "./footer-pdf";
import { PageHeader } from "./header-pdf";

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
              className="flex w-[130px] h-[28px] overflow-hidden shadow-md"
            >
              {pair.map((color, subIdx) => (
                <div
                  key={subIdx}
                  className="w-full h-full"
                  style={{ backgroundColor: color }}
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

// Komponen InfoSection: Dibuat lebih pintar untuk menangani teks multi-baris dari satu string
const InfoSection = ({
  title,
  content,
}: {
  title: string;
  content?: string;
}) => (
  <div>
    <h3 className="text-lg font-bold text-[#EF789B] mb-3 text-center">
      {title}
    </h3>
    {/* Split content berdasarkan baris baru (\n) untuk membuat paragraf terpisah */}
    {content?.split("\n").map((line, index) => (
      <p className="text-center text-[#f0f0f0] text-sm" key={index}>
        {line}
      </p>
    ))}
  </div>
);

export const ColorTone = ({
  userData,
  colorToneDetails,
}: {
  userData: UserData;
  colorToneDetails?: ColorToneType;
}) => {
  return (
    <div className="bg-[#F0F0F0] w-full h-full flex flex-col">
      <div className="px-10">
        <PageHeader width={100} name={userData.name} />
      </div>

      <div className="px-10 py-6">
        <h1 className="text-2xl mb-2 font-oswald">
          Color tone kamu {userData.colorTone}
        </h1>
        <p className="text-[#323232] mb-10 text-base">
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

      <div className="bg-[#323232] p-10 mt-10 flex-grow flex flex-col">
        <div className="grid grid-cols-2 gap-10">
          <InfoSection
            title="Make Up Tips"
            content={colorToneDetails?.make_up_tips}
          />
          <InfoSection
            title="Outfit Tips"
            content={colorToneDetails?.tips_warna_kulit_pakaian}
          />
          <InfoSection
            title="Personality"
            content={colorToneDetails?.personality}
          />
          <InfoSection
            title="Karakteristik"
            content={colorToneDetails?.karakteristik}
          />
        </div>
        <Footer page="03" className="bg-transparent text-white mt-[12rem]" />
      </div>
    </div>
  );
};
