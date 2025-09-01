import { BmiCategory, BodyShapeData, UserData } from "@/types";
import Image from "next/image";

interface StoryBodyShapeProps {
  userData: UserData;
  bodyDetails?: BodyShapeData;
  bmiCategoryDetails?: BmiCategory;
}

export const StoryBodyShape = ({
  userData,
  bodyDetails,
  bmiCategoryDetails,
}: StoryBodyShapeProps) => {
  return (
    <div className="flex gap-[40px]">
      <div className="border p-4 rounded-2xl w-[400px]">
        <Image
          src={bodyDetails?.link_picture || userData.bodyShapeAnalysis.imageUrl}
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
            <h4 className="font-bold text-xl font-poppins text-gray-800 mb-2">
              Karakteristik
            </h4>
            <ul className="list-disc list-inside space-y-2">
              {bodyDetails?.karakteristik
                ?.split("-")
                .filter((point) => point.trim() !== "")
                .map((point, index) => (
                  <li
                    key={index}
                    className="text-xl font-poppins text-gray-600"
                  >
                    {point.trim()}
                  </li>
                ))}
            </ul>
          </div>
          <div className="border rounded-2xl p-4 relative">
            <h4 className="font-bold text-xl font-poppins text-gray-800 mb-4">
              BMI Index
            </h4>

            <div className="relative w-full h-6 rounded-lg bg-gradient-to-r from-pink-400 to-pink-300">
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-[#323232]"
                style={{
                  left: `${Math.min(
                    100,
                    Math.max(0, (userData.bmi.value / 40) * 100)
                  )}%`,
                }}
              ></div>
            </div>
            <div className="w-fit self-center text-center mt-4 bg-neutral-800 text-[#f0f0f0] text-sm px-3 py-1 rounded-md whitespace-nowrap">
              {userData.bmi.value.toFixed(2)} {bmiCategoryDetails?.kategori}
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
