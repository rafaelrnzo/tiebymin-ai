import { FaceShape as FaceShapeType, UserData } from "@/types";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { Footer } from "./footer-pdf";
import { PageHeader } from "./header-pdf";

interface IShape {
  name: string;
  value: number;
}

const generateGimmickChartData = (mainShapeName: string): IShape[] => {
  const allShapes = ["Heart", "Oblong", "Oval", "Round", "Square", "Diamond"];

  const shapeNameMap: { [key: string]: string } = {
    Hati: "Heart",
    Oblong: "Oblong",
    Oval: "Oval",
    Bulat: "Round",
    Kotak: "Square",
    Diamond: "Diamond",
  };

  const englishMainShapeName = shapeNameMap[mainShapeName] || mainShapeName;

  const mainValue = 90;
  const otherCount = allShapes.length - 1;

  const baseOtherValue = Math.floor(10 / otherCount);
  let sisa = 10 - baseOtherValue * otherCount;

  const chartData: IShape[] = [];
  allShapes.forEach((shapeName) => {
    if (shapeName.toLowerCase() === englishMainShapeName.toLowerCase()) {
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

export const FaceShape = ({
  userData,
  userPhotoUrl,
  faceShapeDetails,
}: {
  userData: UserData;
  userPhotoUrl?: string | null;
  faceShapeDetails?: FaceShapeType;
}) => {
  const shapeChartData = generateGimmickChartData(userData.faceShape);
  const infoRef = useRef<HTMLDivElement>(null);
  const [infoHeight, setInfoHeight] = useState(0);

  useLayoutEffect(() => {
    if (infoRef.current) {
      setInfoHeight(infoRef.current.offsetHeight);
    }
  }, [userData, faceShapeDetails]);

  const shapeNameMap: { [key: string]: string } = {
    Hati: "Heart",
    Oblong: "Oblong",
    Oval: "Oval",
    Bulat: "Round",
    Kotak: "Square",
    Diamond: "Diamond",
  };
  const englishMainShapeName =
    shapeNameMap[userData.faceShape] || userData.faceShape;

  const ShapeBar = ({
    label,
    value,
    active,
  }: {
    label: string;
    value: number;
    active?: boolean;
  }) => (
    <div className="flex flex-col gap-[18px]">
      <span
        className={`text-sm font-poppins ${
          active ? "font-bold text-gray-800" : "text-gray-500"
        }`}
      >
        {label}
      </span>
      <div className="w-full bg-gray-300 rounded-full h-2">
        <div
          className="bg-[#EF789B] h-2 rounded-full"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="relative bg-[#F0F0F0] w-full px-10 flex flex-col justify-between min-h-screen">
        <PageHeader name={userData.name} />

        {/* Main content with consistent spacing */}
        <main className="flex-grow py-6">
          <div className="flex w-full gap-8 mb-4">
            <div className="relative w-[600px] rounded-lg shadow overflow-hidden">
              <Image
                src={userPhotoUrl || "/model.png"}
                alt="Model Wajah"
                fill
                className="object-cover"
                quality={100}
              />
            </div>
            <div ref={infoRef} className="w-full space-y-2 mb-4">
              <h1 className="font-oswald text-2xl mb-2">
                Bentuk wajah kamu {userData.faceShape}
              </h1>
              <p className="font-poppins text-base text-[#323232] my-4">
                {faceShapeDetails?.penjelasan_face_shape.split("-")[0]}
              </p>
              {shapeChartData.map((shape) => (
                <ShapeBar
                  key={shape.name}
                  label={shape.name}
                  value={shape.value}
                  active={
                    shape.name.toLowerCase() ===
                    englishMainShapeName.toLowerCase()
                  }
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-6">
              <h3 className="text-sm font-bold mb-1">Fakta Unik</h3>
              <p className="text-xs text-gray-600 leading-snug">
                {faceShapeDetails?.penjelasan_face_shape
                  .split("-")
                  .filter((item: string) => item.trim() !== "")
                  .map((item: string, index: number) =>
                    index === 0 ? null : (
                      <span key={index} className="block text-[14px]">
                        •{" "}
                        <span className="text-[14px] ml-2">{item.trim()}</span>
                      </span>
                    )
                  )}
              </p>
            </div>
            <div className="bg-[#323232] text-white p-6 rounded">
              <h3 className="text-sm font-bold text-[#EF789B] mb-1">
                Karakteristik
              </h3>
              <ul className="text-[#323232] font-poppins leading-relaxed space-y-2 text-xs">
                {faceShapeDetails?.karakteristik
                  .split("-")
                  .filter((item: string) => item.trim() !== "")
                  .map((item: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2 text-white mb-1">•</span>
                      <span className="text-xs text-white">{item.trim()}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </main>

        <Footer page="02" />
      </div>
    </div>
  );
};
