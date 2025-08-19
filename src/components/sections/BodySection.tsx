"use client";

import { useBmiCategoryData, useBodyShapeData } from "@/hooks/useAnalysisData";
import Image from "next/image";
import React from "react";

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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-[50px]">
      <div className="rounded-2xl border p-6 flex flex-col col-span-2">
        <h3 className="font-bold text-5xl font-oswald">{bodyDetails.name}</h3>
        <div className="flex justify-center my-6 flex-shrink-0">
          <Image
            src={bodyDetails.link_picture}
            alt={`${bodyDetails.name} body type`}
            width={150}
            height={310} // Menyesuaikan tinggi agar lebih proporsional
            className="object-contain h-[300px]"
            priority
          />
        </div>
        <p className="text-xl mt-6">{bodyDetails.penjelasan_body_shape}</p>
      </div>

      {/* Kolom ini tidak perlu banyak diubah, hanya memastikan konsistensi */}
      <div className="flex flex-col gap-[50px] lg:col-span-2">
        <div className="border border-neutral-600 rounded-2xl p-6 sm:p-8 text-[#323232]">
          <h3 className="font-bold text-4xl sm:text-5xl font-oswald">
            BMI Analyst
          </h3>
          <hr className="my-4 border-neutral-300" />

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="rounded-full border-2 border-[#EC7498] p-1">
                <div className="rounded-full border border-neutral-600 w-24 h-24 flex items-center justify-center">
                  <p className="text-lg font-bold">
                    {formatBmiValue(bmiResult?.value)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col text-center sm:text-left">
              <span className="font-bold text-base sm:text-lg">
                {bmiCategoryDetails.kategori}
              </span>
              <p className="text-[#323232] text-sm sm:text-base leading-relaxed font-poppins">
                {bmiCategoryDetails.tips_fashion}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#FFC6C6] shadow-md rounded-2xl p-6">
          <h3 className="font-bold italic font-handlee mb-3 text-xl text-left">
            Karakteristik
          </h3>
          {bodyDetails?.karakteristik
            ?.split("-")
            .filter((point: string) => point.trim() !== "")
            .map(
              (
                point: string,
                index: number // index harusnya number
              ) => (
                <p key={index} className="text-xl text-[#323232] font-poppins">
                  • {point.trim()}
                </p>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default BodySection;
