import { BmiCategory, BodyShapeData, UserData } from "@/types";
import Image from "next/image";

interface StoryBodyShapeProps {
  userData: UserData;
  bodyDetails?: BodyShapeData;
  bmiCategoryDetails?: BmiCategory;
  bmiValue?: number;
  bmiCategory?: string;
}

export const StoryBodyShape = ({
  userData,
  bodyDetails,
  bmiCategoryDetails,
  bmiValue,
  bmiCategory,
}: StoryBodyShapeProps) => {
  // Use provided BMI data or fallback to userData
  const finalBmiValue = bmiValue ?? userData.bmi?.value ?? 0;
  const finalBmiCategory =
    bmiCategory ??
    bmiCategoryDetails?.kategori ??
    userData.bmi?.category ??
    "Unknown";

  // Parse BMI category to separate category and description
  const parseBmiCategory = (category: string) => {
    if (category.includes(" – ")) {
      const [mainCategory, description] = category.split(" – ");
      return { category: mainCategory, description };
    }
    return { category, description: "" };
  };

  const { category: bmiMainCategory, description: bmiDescription } =
    parseBmiCategory(finalBmiCategory);
  return (
    <div className="flex gap-[40px]">
      <div className="border p-4 rounded-2xl w-[400px]">
        <Image
          src={bodyDetails?.link_picture as string}
          alt={`Diagram Bentuk Tubuh ${userData.bodyShape}`}
          width={120}
          height={300}
          className="w-[120px] h-[300px] object-contain ml-[11px] mt-[5rem]"
          priority
        />
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="mb-1 font-oswald text-[36px]">
          Bentuk tubuh kamu {userData.bodyShape}
        </h3>
        <p className="text-xl font-poppins mb-3">
          {bodyDetails?.penjelasan_body_shape}
        </p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="border rounded-2xl p-4">
            <h4 className="font-bold text-xl font-poppins text-[#323232] mb-2">
              Karakteristik
            </h4>
            <div className="space-y-2">
              {bodyDetails?.karakteristik
                ?.split("-")
                .filter((point) => point.trim() !== "")
                .map((point, index) => (
                  <div
                    key={index}
                    className="flex text-xl font-poppins text-[#323232]"
                  >
                    <span className="mr-2">•</span>
                    <span>{point.trim()}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="border rounded-2xl p-4 relative">
            <h4 className="font-bold text-xl font-poppins text-[#323232] mb-4">
              BMI Index
            </h4>

            <div className="relative w-full h-6 rounded-lg bg-gradient-to-r from-pink-400 to-pink-300">
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-[#323232]"
                style={{
                  left: `${Math.min(
                    100,
                    Math.max(0, (finalBmiValue / 40) * 100)
                  )}%`,
                }}
              ></div>
            </div>
            <div className="w-fit self-center text-center mt-4 bg-[#323232] text-[#f0f0f0] text-sm px-3 py-1 rounded-md whitespace-nowrap">
              {finalBmiValue.toFixed(2)} {bmiMainCategory}
            </div>

            {/* Tips */}
            <p className="mt-3 text-neutral-800 text-xl font-poppins leading-relaxed">
              {bmiCategoryDetails?.tips_fashion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
