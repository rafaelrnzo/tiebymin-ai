import { ColorAnalysis as ColorTone } from "@/types";

interface StoryColorToneProps {
  userData: { colorTone: string };
  colorToneDetails?: ColorTone;
}

export const StoryColorTone = ({
  userData,
  colorToneDetails,
}: StoryColorToneProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-[36px] my-4 font-oswald">
        Color tone kamu {userData.colorTone}
      </h3>
      <p className="text-xl font-poppins mt-6">
        {colorToneDetails?.penjelasan_color_analysis}
      </p>

      <div className="grid grid-cols-4 gap-4 mt-[2rem] mb-[3rem]">
        {Object.entries({
          "Best Color": colorToneDetails?.best_colour,
          "Neutral Color": colorToneDetails?.neutral_colour,
          "Worst Color": colorToneDetails?.worst_colour,
          Combination: colorToneDetails?.best_colour_combination,
        }).map(([title, colors]: [string, unknown]) => {
          if (!colors) return null; // Handle undefined colors

          return (
            <div key={title} className="text-center">
              <h4 className="text-xl font-poppins mb-2">{title}</h4>

              {/* Bedakan tampilan Combination */}
              {title === "Combination" ? (
                <div className="grid grid-cols-2 gap-4">
                  {(colors as string[][]).map((pair: string[], i: number) => (
                    <div
                      key={i}
                      className="flex w-full h-[47px] rounded-lg overflow-hidden shadow-lg"
                    >
                      {pair.map((c: string, j: number) => (
                        <div
                          key={j}
                          className="flex-1 h-full"
                          style={{ backgroundColor: c }}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 justify-center">
                  {(colors as string[]).map((c: string, idx: number) => (
                    <div
                      key={idx}
                      className="w-[50px] h-[50px] rounded-md shadow-md"
                      style={{ backgroundColor: c }}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
