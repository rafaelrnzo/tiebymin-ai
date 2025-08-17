"use client";
import {
  BmiCategory,
  BodyShapeData,
  ColorAnalysis as ColorTone,
  FaceShape,
  UserData,
} from "@/types";
import { Instagram } from "lucide-react";
import Image from "next/image";
import QRCode from "react-qr-code";
import { Button } from "../ui/button";

const generateGimmickChartData = (
  mainShapeName: string
): { label: string; value: number; active: boolean }[] => {
  const allShapes = ["Square", "Oblong", "Oval", "Round", "Heart", "Diamond"];
  const shapeNameMap: { [key: string]: string } = {
    Hati: "Heart",
    Oblong: "Oblong",
    Oval: "Oval",
    Bulat: "Round",
    Kotak: "Square",
    Diamond: "Diamond",
  };
  const englishMainShapeName = shapeNameMap[mainShapeName] || mainShapeName;
  const mainValue = Math.floor(Math.random() * 11) + 85;
  const remainingValue = 100 - mainValue;

  const otherValues = Array.from({ length: allShapes.length - 1 }, () => {
    const randomValue = Math.random();
    return randomValue;
  });
  const sumOfRandoms = otherValues.reduce((a, b) => a + b, 0);
  const normalizedValues = otherValues.map((v) =>
    Math.round((v / sumOfRandoms) * remainingValue)
  );

  const currentSum = normalizedValues.reduce((a, b) => a + b, 0);
  const diff = remainingValue - currentSum;
  if (normalizedValues.length > 0) normalizedValues[0] += diff;

  const chartData: { label: string; value: number; active: boolean }[] = [];
  let otherIndex = 0;
  allShapes.forEach((shapeName) => {
    if (shapeName.toLowerCase() === englishMainShapeName.toLowerCase()) {
      chartData.push({ label: shapeName, value: mainValue, active: true });
    } else {
      chartData.push({
        label: shapeName,
        value: normalizedValues[otherIndex++] || 0,
        active: false,
      });
    }
  });

  return chartData;
};

export default function StoryPoster({
  userData,
  userPhotoUrl,
  handleDownloadStory,
  bodyDetails,
  bmiCategoryDetails,
  isGenerating,
  colorToneDetails,
  faceShapeDetails,
}: {
  userData: UserData;
  userPhotoUrl: string | null;
  handleDownloadStory: () => void;
  bodyDetails?: BodyShapeData;
  bmiCategoryDetails?: BmiCategory;
  isGenerating: boolean;
  colorToneDetails?: ColorTone;
  faceShapeDetails?: FaceShape;
}) {
  const faceShapeAnalysisData = generateGimmickChartData(userData.faceShape);
  console.log(userData, userPhotoUrl);
  const penjelasanLengkap = faceShapeDetails?.penjelasan_face_shape || "";

  // Pisahkan teks berdasarkan tanda "-" dan ambil bagian pertama saja
  const kalimatUtama = penjelasanLengkap.split("-")[0].trim();
  return (
    <div
      className="bg-white text-gray-800 w-[1080px] mx-auto p-8 font-sans"
      style={{ lineHeight: 1.4 }}
    >
      {/* HEADER */}
      <div className="m-[100px]">
        <div className="flex justify-between items-center mb-4">
          <Image
            src="/tie-by-min-logo.png"
            alt="Logo Tie By Min"
            width={120}
            height={40}
          />
          <h1 className="text-2xl font-bold font-oswald">
            HASIL ANALISA {userData.name?.toUpperCase()}
          </h1>
        </div>
        <hr className="mb-10" />

        {/* FOTO + QR */}
        <div className="flex gap-5 mb-6">
          {/* Foto user */}
          <div className="w-[322px] rounded-lg">
            <Image
              src={userPhotoUrl || "/model.png"}
              alt="User Photo"
              width={322}
              height={400}
              className="object-cover h-[400px] rounded-lg"
            />
          </div>

          {/* QR + text */}
          <div className="w-full flex flex-col justify-center items-center border rounded-xl py-4">
            <QRCode
              value="https://tiebymin.com"
              size={173}
              className="mt-auto"
            />
            <p className="text-xl font-poppins mt-auto mx-10">
              Yuk share ke temen kamu untuk coba AI ini dengan scan barcode di
              atas!
            </p>
            <div className="flex justify-center items-center gap-10 mt-6 mb-4">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleDownloadStory();
                }}
                rel="noopener noreferrer"
                className="border w-[230px] flex items-center space-x-1 text-sm"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  "Generating..."
                ) : (
                  <>
                    <Instagram />
                    <span className="font-medium font-poppins">tiebymin</span>
                  </>
                )}
              </Button>
              <Button className="border w-[230px] flex items-center space-x-1 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-tiktok"
                  viewBox="0 0 16 16"
                >
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                </svg>
                <span className="font-medium font-poppins">tiebymin</span>
              </Button>
            </div>
          </div>
        </div>

        <hr className="mt-10" />

        {/* FACE SHAPE */}
        <div className="flex items-start justify-between my-10 gap-10">
          <div className="grid grid-cols-2 gap-10 mb-6 w-full">
            {faceShapeAnalysisData.map((shape) => (
              <div key={shape.label}>
                <span
                  className={`text-sm ${
                    shape.active
                      ? "font-poppins text-xl font-bold text-gray-800"
                      : "text-gray-500"
                  }`}
                >
                  <span className="font-poppins text-xl">{shape.label}</span>
                </span>
                <div className="w-full mt-4 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-[#EF789B] h-1.5 rounded-full"
                    style={{ width: `${shape.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-[400px]">
            <h3 className="mb-4 font-oswald text-[36px]">
              Bentuk wajah kamu {userData.faceShape}
            </h3>
            <p className="text-xl font-poppins">{kalimatUtama}</p>
          </div>
        </div>

        <hr className="mb-6" />

        {/* COLOR TONE */}
        <div className="mb-6">
          <h3 className="text-[36px] my-4 font-oswald">
            Color tone kamu {userData.colorTone}
          </h3>
          <p className="text-xl font-poppins mt-6">
            {colorToneDetails?.penjelasan_color_analysis}
          </p>

          <div className="grid grid-cols-4 gap-4 mt-[2rem] mb-[3rem]">
            {Object.entries({
              "Best Color": userData.colorToneAnalysis.bestColors,
              "Neutral Color": userData.colorToneAnalysis.neutralColors,
              "Worst Color": userData.colorToneAnalysis.worstColors,
              Combination: userData.colorToneAnalysis.combination,
            }).map(([title, colors]) => (
              <div key={title} className="text-center">
                <h4 className="text-xl font-poppins mb-2">{title}</h4>

                {/* Bedakan tampilan Combination */}
                {title === "Combination" ? (
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from(
                      { length: Math.ceil(colors.length / 2) },
                      (_, i) => {
                        const pair = colors.slice(i * 2, i * 2 + 2);
                        return (
                          <div
                            key={i}
                            className="flex w-full h-[47px] rounded-lg overflow-hidden shadow-lg"
                          >
                            {pair.map((c, j) => (
                              <div
                                key={j}
                                className="flex-1 h-full"
                                style={{ backgroundColor: c }}
                              ></div>
                            ))}
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 justify-center">
                    {colors.map((c, idx) => (
                      <div
                        key={idx}
                        className="w-[50px] h-[50px] rounded-md shadow-md"
                        style={{ backgroundColor: c }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <hr className="my-6" />

        <div className="flex gap-[40px]">
          <div className="border p-4 rounded-2xl w-[400px]">
            <Image
              src={
                bodyDetails?.link_picture || userData.bodyShapeAnalysis.imageUrl
              }
              alt={`Diagram Bentuk Tubuh ${userData.bodyShape}`}
              width={120}
              height={300}
              className="w-[120px] h-[300px] object-contain mt-12"
              priority
            />
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="mb-1 font-oswald text-[36px]">
              Bentuk tubuh kamu {userData.bodyShape}
            </h3>
            <p className="text-xl font-poppins mb-3">
              {userData.bodyShapeAnalysis.description}
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="border rounded-2xl p-4">
                <h4 className="font-bold text-xl font-poppins text-gray-800 mb-2">
                  Karakteristik
                </h4>
                <p className="text-xl font-poppins text-gray-600">
                  {bodyDetails?.penjelasan_body_shape}
                </p>
              </div>
              <div className="border rounded-2xl p-4 relative">
                <h4 className="font-bold text-xl font-poppins text-gray-800 mb-4">
                  BMI Index
                </h4>

                {/* Wrapper bar */}
                <div className="relative w-full h-6 rounded-lg bg-gradient-to-r from-pink-400 to-pink-300">
                  {/* Indicator line */}
                  <div
                    className="absolute top-0 bottom-0 w-[2px] bg-black"
                    style={{
                      left: `${Math.min(
                        100,
                        Math.max(0, (userData.bmi.value / 40) * 100)
                      )}%`,
                    }}
                  >
                    {/* Tooltip */}
                  </div>
                </div>
                <div className="w-fit self-center text-center mt-4 bg-neutral-800 text-white text-sm px-3 py-1 rounded-md whitespace-nowrap">
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
      </div>
    </div>
  );
}
