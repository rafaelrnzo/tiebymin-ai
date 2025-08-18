"use client";

import { Button } from "@/components/ui/button";
import { useBmiCategoryData, useBodyShapeData } from "@/hooks/useAnalysisData";
import Image from "next/image";
import React from "react";

const ALL_BODY_TYPES_PREVIEW = [
  { id: "diamond", img: "/body-select/diamond.png", name: "Diamond" },
  { id: "pear", img: "/body-select/pear.png", name: "Pear" },
  { id: "hourglass", img: "/body-select/hourglass.png", name: "Hourglass" },
  { id: "triangle", img: "/body-select/triangle.png", name: "Triangle" },
  { id: "square", img: "/body-select/square.png", name: "Square" },
  { id: "oval", img: "/body-select/oval.png", name: "Oval" },
];

interface BodySectionProps {
  bodyShapeId: string;
  bmiResult?: { value: string | number };
  bmiCategoryId?: string;
}

const BodySection: React.FC<BodySectionProps> = ({
  bodyShapeId,
  bmiResult,
  bmiCategoryId,
}) => {
  const {
    data: bodyDetails,
    isLoading: isLoadingBody,
    error: errorBody,
  } = useBodyShapeData(bodyShapeId);
  const {
    data: bmiCategoryDetails,
    isLoading: isLoadingBmi,
    error: errorBmi,
  } = useBmiCategoryData(bmiCategoryId || null);

  const isLoading = isLoadingBody || isLoadingBmi;
  const error = errorBody || errorBmi;

  const formatBmiValue = (value: number | string | undefined): string => {
    if (value === undefined || value === null) {
      return "0.00";
    }
    const stringValue = String(value);
    const sanitizedValue = stringValue.replace(",", ".");
    const numberValue = Number(sanitizedValue);
    return isNaN(numberValue) ? "0.00" : numberValue.toFixed(2);
  };

  if (isLoading)
    return <div className="text-center p-8">Loading body information...</div>;
  if (error)
    return (
      <div className="text-center p-8 text-red-500">
        {error.message || "An error occurred"}
      </div>
    );
  if (!bodyDetails || !bmiCategoryDetails)
    return <div className="text-center p-8">Data tubuh tidak ditemukan.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
      <div className="rounded-2xl px-4 py-6 border">
        <h3 className="font-bold text-5xl font-oswald">{bodyDetails.name}</h3>
        <div className="flex justify-center my-6 w-[150px] h-[250px] mx-auto">
          <Image
            src={bodyDetails.link_picture || "/body-select/pear.png"}
            alt={`${bodyDetails.name} body type`}
            width={150}
            height={250}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <p className="text-xl leading-relaxed mt-4">
          {bodyDetails.penjelasan_body_shape}
        </p>
        <div className="flex gap-2 justify-center mt-6">
          {ALL_BODY_TYPES_PREVIEW.map((bt) => (
            <div
              key={bt.id}
              className={`rounded-lg p-1 border transition-all ${
                bt.name === bodyDetails.name
                  ? "border-[#EF789B] bg-[#FCE9EC]"
                  : "border-transparent hover:border-gray-300"
              }`}
              tabIndex={-1}
              aria-label={bt.name}
            >
              <Image
                src={bt.img}
                alt={bt.name}
                width={36}
                height={80}
                className="w-9 h-16 object-contain"
                style={{ opacity: bt.name === bodyDetails.name ? 1 : 0.5 }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="border border-neutral-600 rounded-2xl p-6 sm:p-8 text-[#323232]">
          <h3 className="font-bold text-4xl sm:text-5xl font-oswald">
            BMI Analyst
          </h3>
          <hr className="my-4 border-neutral-300" />

          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center">
              <div className="rounded-full border-2 border-[#EC7498] p-1">
                <div className="rounded-full border border-neutral-600 w-24 h-24 flex items-center justify-center">
                  <p className="text-lg font-bold">
                    {formatBmiValue(bmiResult?.value)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg">
                {bmiCategoryDetails.kategori}
              </span>
              <p className="text-[#323232] text-sm sm:text-base leading-relaxed font-poppins">
                {bmiCategoryDetails.tips_fashion}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#FFC6C6] rounded-2xl px-4 py-14 sm:p-6">
          <h3 className="font-bold italic font-handlee mb-3 text-lg text-left">
            Karakteristik
          </h3>
          <ul className="list-disc list-inside space-y-2">
            {bodyDetails?.karakteristik
              ?.split("-") // Memecah string berdasarkan tanda '-'
              .filter((point: string) => point.trim() !== "") // Menghapus item kosong
              .map((point: string, index: string) => (
                <li key={index} className="text-xl text-[#323232] font-poppins">
                  {point.trim()}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BodySection;
