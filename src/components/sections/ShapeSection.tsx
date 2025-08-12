"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import url from "@/lib/url";

interface IShape {
  name: string;
  value: number;
}

interface ShapeBarProps {
  name: string;
  value: number;
}

interface ShapeDetails {
  name: string;
  penjelasan_face_shape: string;
  karakteristik: string;
  tips_bentuk_wajah: string;
}

const ShapeBar: React.FC<ShapeBarProps> = ({ name, value }) => (
  <div>
    <p className="text-base text-gray-800">{name}</p>
    <div className="mt-2 w-full bg-gray-200 rounded-full h-3.5">
      <div
        className={`h-3.5 rounded-full bg-gradient-to-l from-[#FFA2BD] to-[#FF7EA4]`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const FaceShapeAnalysis: React.FC<{ data: IShape[] }> = ({ data }) => (
  <div className="w-full">
    <h3 className="font-bold text-2xl font-oswald mb-4">
      Face Shape Distribution
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      {data.map((shape) => (
        <ShapeBar key={shape.name} {...shape} />
      ))}
    </div>
  </div>
);

const generateGimmickChartData = (mainShapeName: string): IShape[] => {
  const allShapes = ["Heart", "Oblong", "Oval", "Round", "Square"];

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
  const [shapeDetails, setShapeDetails] = useState<ShapeDetails>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [gimmickChartData, setGimmickChartData] = useState<IShape[]>([]);

  useEffect(() => {
    if (!shapeId) {
      setError("Shape ID tidak tersedia.");
      setIsLoading(false);
      return;
    }
    const fetchShapeDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${url}/v1/face-shapes/${shapeId}`);
        setShapeDetails(response.data);

        if (response.data && response.data.name) {
          const chartData = generateGimmickChartData(response.data.name);
          setGimmickChartData(chartData);
        }
      } catch (err) {
        setError("Gagal memuat detail bentuk wajah.");
        console.error("Fetch error in ShapeSection:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShapeDetails();
  }, [shapeId]);

  if (isLoading)
    return <div className="text-center p-8">Loading shape information...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!shapeDetails)
    return (
      <div className="text-center p-8">Data bentuk wajah tidak ditemukan.</div>
    );

  return (
    <div className="flex flex-col gap-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-gray-300 rounded-2xl p-4 sm:p-6">
          <h3 className="font-bold text-5xl font-oswald">
            {shapeDetails.name}
          </h3>
          <p className="text-gray-600 leading-relaxed mt-4">
            <span className="text-lg">Fakta Unik</span>
            {shapeDetails.penjelasan_face_shape
              .split("-")
              .filter((item: string) => item.trim() !== "")
              .map((item: string, index: number) =>
                index === 0 ? (
                  <span key={index} className="block mb-1">
                    {item.trim()}
                  </span>
                ) : (
                  <span key={index} className="block">
                    •{item.trim()}
                  </span>
                )
              )}
          </p>
        </div>
        <div className="bg-pink-100 rounded-2xl p-4 sm:p-6">
          <h3 className="font-bold font-handlee text-gray-800 mb-3 text-lg text-left">
            Karakteristik
          </h3>
          <ul className="text-gray-600 leading-relaxed space-y-2">
            {shapeDetails.karakteristik
              .split("-")
              .filter((item: string) => item.trim() !== "")
              .map((item: string, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="mr-3 text-gray-500">•</span>
                  <span className="text-sm">{item.trim()}</span>
                </li>
              ))}
          </ul>
          <h3 className="font-bold font-handlee text-gray-800 mt-4 mb-3 text-lg text-left">
            Tips
          </h3>
          <ul className="text-gray-600 leading-relaxed space-y-2">
            {shapeDetails.tips_bentuk_wajah}
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
