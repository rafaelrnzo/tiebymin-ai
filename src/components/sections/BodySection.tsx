"use client";

import { useBmiCategoryData, useBodyShapeData } from "@/hooks/useAnalysisData";
import { BodySectionSkeleton } from "@/components/skeleton-loading/section-skeletons";
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

  if (isLoading) return <BodySectionSkeleton />;
  if (error)
    return (
      <div className="text-center p-8 text-red-500 text-base sm:text-lg">
        {error.message || "An error occurred"}
      </div>
    );
  if (!bodyDetails || !bmiCategoryDetails)
    return (
      <div className="text-center p-8 text-base sm:text-lg">
        Data tubuh tidak ditemukan.
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row xl:flex-row w-full gap-5 lg:gap-[50px]">
      <div className="flex flex-col flex-1 px-[20px] pt-[25px] rounded-2xl border">
        <h3 className="font-bold text-2xl sm:text-3xl lg:text-5xl font-oswald">
          {bodyDetails.name}
        </h3>
        <div className="flex justify-center my-4 sm:my-6 flex-shrink-0">
          <Image
            src={bodyDetails.link_picture}
            alt={`${bodyDetails.name} body type`}
            width={150}
            height={245}
            className="object-contain h-[180px] sm:h-[220px] lg:h-[245px] xl:h-[300px] 2xl:h-[350px]"
            priority
          />
        </div>
        <p className="font-poppins text-xs lg:text-xl lg:mt-0 mt-6 mb-4 break-words hyphens-auto">
          {bodyDetails.penjelasan_body_shape}
        </p>
      </div>

      <div className="flex-2 space-y-4 lg:space-y-6">
        <div className="flex flex-col gap-4 lg:gap-12">
          <div className="border border-[#323232] w-full max-w-full rounded-2xl p-4 text-[#323232] flex-gr">
            <h3 className="font-bold mt-3  text-[#323232] lg:text-center text-left text-lg sm:text-2xl lg:text-4xl xl:text-5xl font-oswald">
              BMI Analyst
            </h3>
            <hr className="my-[25px] border-[#323232]" />

            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
              <div className="flex-shrink-0">
                <div className="rounded-full border-2 border-[#EC7498] p-1">
                  <div className="rounded-full border border-[#323232] w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 flex items-center justify-center">
                    <p className="text-sm sm:text-lg lg:text-xl font-bold">
                      {formatBmiValue(bmiResult?.value)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-xs lg:text-xl">
                  {bmiCategoryDetails.kategori}
                </span>
                <p className="text-[#323232] text-xs lg:text-xl leading-relaxed font-poppins">
                  {bmiCategoryDetails.tips_fashion}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#FFC6C6] flex-1/2 shadow-md rounded-2xl p-4 lg:p-6 w-full max-w-full">
            <h3 className="italic font-handlee mb-2 sm:mb-3 text-base sm:text-lg lg:text-2xl md:text-left xl:text-center lg:text-center text-left">
              Karakteristik
            </h3>
            <div className="space-y-2">
              {bodyDetails?.karakteristik
                ?.split("-")
                .filter((point: string) => point.trim() !== "")
                .map((point: string, index: number) => (
                  <div
                    key={index}
                    className="flex text-xs lg:text-xl text-[#323232] font-poppins"
                  >
                    <span className="mr-2">•</span>
                    <span>{point.trim()}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodySection;
