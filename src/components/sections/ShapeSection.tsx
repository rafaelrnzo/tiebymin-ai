"use client";

import { useFaceShapeData } from "@/hooks/useAnalysisData";
import { ShapeSectionSkeleton } from "@/components/skeleton-loading/section-skeletons";
import React from "react";

interface IShape {
  name: string;
  value: number;
}

interface ShapeBarProps {
  name: string;
  value: number;
}

const ShapeBar: React.FC<ShapeBarProps> = ({ name, value }) => (
  <div>
    <p className="lg:text-xl text-xs font-poppins text-[#323232]">{name}</p>
    <div className="mt-2 w-full bg-[#323232]/10 rounded-full h-3.5">
      <div
        className={`h-3.5 rounded-full bg-gradient-to-l from-[#FFA2BD] to-[#FF7EA4]`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const FaceShapeAnalysis: React.FC<{ data: IShape[] }> = ({ data }) => (
  <div className="w-full mt-[40px]">
    <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-x-12 gap-y-4">
      {data.map((shape) => (
        <ShapeBar key={shape.name} {...shape} />
      ))}
    </div>
  </div>
);

const generateGimmickChartData = (mainShapeName: string): IShape[] => {
  const allShapes = ["Heart", "Oblong", "Oval", "Round", "Square", "Diamond"];

  const mainValue = 90;
  const otherCount = allShapes.length - 1;

  const baseOtherValue = Math.floor(10 / otherCount);
  let sisa = 10 - baseOtherValue * otherCount;

  const chartData: IShape[] = [];
  allShapes.forEach((shapeName) => {
    if (shapeName.toLowerCase() === mainShapeName.toLowerCase()) {
      chartData.push({ name: shapeName, value: mainValue });
    } else {
      let value = baseOtherValue;
      if (sisa > 0) {
        value += 1;
        sisa -= 1;
      }
      chartData.push({ name: shapeName, value });
    }
  });

  return chartData;
};

interface ShapeSectionProps {
  shapeId: string;
}

const ShapeSection: React.FC<ShapeSectionProps> = ({ shapeId }) => {
  const { data: shapeDetails, isLoading, error } = useFaceShapeData(shapeId);
  const gimmickChartData = shapeDetails?.name
    ? generateGimmickChartData(shapeDetails.name)
    : [];

  if (isLoading) return <ShapeSectionSkeleton />;
  if (error)
    return (
      <div className="text-center p-8 text-red-500">
        {error.message || "An error occurred"}
      </div>
    );
  if (!shapeDetails)
    return (
      <div className="text-center p-8">Data bentuk wajah tidak ditemukan.</div>
    );

  return (
    <div className="flex flex-col lg:h-full h-fit">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] lg:gap-[50px]">
        <div className="border rounded-2xl px-5 pt-2.5 pb-5">
          <h3 className="font-bold mt-2 text-xl sm:text-3xl lg:text-5xl font-oswald">
            {shapeDetails.name}
          </h3>
          <div className="text-[#323232] leading-relaxed mt-[10px] font-poppins">
            <p className="block text-xs lg:text-xl mb-2">
              {shapeDetails.penjelasan_face_shape.split("-")[0].trim()}
            </p>
          </div>
        </div>
        <div className="bg-[#FFC6C6] p-[20px] rounded-2xl shadow-md">
          <h3 className="font-handlee text-[#323232] text-2xl text-center italic">
            Karakteristik
          </h3>
          <div className="text-[#323232] mt-[20px] font-poppins leading-relaxed space-y-2">
            {shapeDetails.karakteristik
              .split("-")
              .filter((item: string) => item.trim() !== "")
              .map((item: string, index: number) => (
                <div
                  key={index}
                  className="flex text-xs lg:text-xl text-[#323232] font-poppins"
                >
                  <span className="mr-2">•</span>
                  <span>{item.trim()}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <h1 className="hidden xl:block 2xl:block font-oswald text-4xl text-[#323232] font-bold mt-[50px]">
        Face Shape Distribution
      </h1>

      {gimmickChartData.length > 0 && (
        <FaceShapeAnalysis data={gimmickChartData} />
      )}
    </div>
  );
};

export default ShapeSection;
