"use client";

import { useFaceShapeData } from "@/hooks/useAnalysisData";
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
    <p className="text-xl font-poppins text-gray-800">{name}</p>
    <div className="mt-2 w-full bg-gray-200 rounded-full h-3.5">
      <div
        className={`h-3.5 rounded-full bg-gradient-to-l from-[#FFA2BD] to-[#FF7EA4]`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const FaceShapeAnalysis: React.FC<{ data: IShape[] }> = ({ data }) => (
  <div className="w-full mt-[50px]">
    <h3 className="font-bold text-2xl font-oswald mb-4">
      Face Shape Distribution
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
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

  if (isLoading)
    return <div className="text-center p-8">Loading shape information...</div>;
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
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[50px]">
        <div className="border rounded-2xl p-4 sm:p-6">
          <h3 className="font-bold text-5xl font-oswald">
            {shapeDetails.name}
          </h3>
          <p className="text-[#323232] leading-relaxed mt-4 font-poppins">
            {shapeDetails.penjelasan_face_shape
              .split("-")
              .filter((item: string) => item.trim() !== "")
              .map((item: string, index: number) =>
                index === 0 ? (
                  <span key={index}>
                    <span className="block text-xl">{item.trim()}</span>
                    <span className="hidden text-lg my-3 font-bold font-handlee text-black">
                      Fakta Unik
                    </span>
                  </span>
                ) : (
                  <span key={index} className="hidden text-xl">
                    • <span className="text-xl ml-2">{item.trim()}</span>
                  </span>
                )
              )}
          </p>
        </div>
        <div className="bg-[#FFC6C6] rounded-2xl p-4 sm:p-6 shadow-md">
          <h3 className="font-bold font-handlee text-[#323232] mb-5 mt-4 text-xl text-center italic">
            Karakteristik
          </h3>
          <ul className="text-[#323232] font-poppins leading-relaxed space-y-2">
            {shapeDetails.karakteristik
              .split("-")
              .filter((item: string) => item.trim() !== "")
              .map((item: string, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2 text-gray-500 mb-1">•</span>
                  <span className="text-xl">{item.trim()}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
      {gimmickChartData.length > 0 && (
        <FaceShapeAnalysis data={gimmickChartData} />
      )}
    </div>
  );
};

export default ShapeSection;
