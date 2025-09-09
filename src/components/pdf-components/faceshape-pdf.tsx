import { FaceShape as FaceShapeType, UserData } from "@/types";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Footer } from "./footer-pdf";
import { PageHeader } from "./header-pdf";
import { decodeUrl } from "@/lib/urlUtils";

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

const DetailList = ({
  title,
  content,
  isDark = false,
}: {
  title: string;
  content: string;
  isDark?: boolean;
}) => {
  const items = content
    .split("-")
    .map((item) => item.trim())
    .filter(Boolean);
  if (isDark) {
    return (
      <div className="bg-[#323232] text-[#f0f0f0] p-6 rounded h-full">
        <h3 className="text-sm font-bold text-[#EF789B] mb-2 font-poppins">
          {title}
        </h3>
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li key={index} className="flex text-sm font-poppins">
              <span className="mr-2">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div className="p-6 h-full">
      <h3 className="text-sm font-bold mb-2">{title}</h3>
      <ul className="space-y-1">
        {items.slice(1).map((item, index) => (
          <li key={index} className="flex text-sm text-gray-700">
            <span className="mr-2">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
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

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  const validateImageUrl = (imageUrl: string | null): string | null => {
    if (!imageUrl) return null;

    try {
      new URL(imageUrl);
      return imageUrl;
    } catch (error) {
      return null;
    }
  };

  const decodedUserPhotoUrl = userPhotoUrl ? decodeUrl(userPhotoUrl) : null;

  const fetchImageWithAuth = async (imageUrl: string) => {
    try {
      setImageLoading(true);
      setImageError(false);

      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("userToken");

      if (!token) {
        setImageError(true);
        setImageLoading(false);
        return;
      }

      const response = await fetch(imageUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const blob = await response.blob();
      const dataUrl = URL.createObjectURL(blob);
      setImageDataUrl(dataUrl);
      setImageLoading(false);
    } catch (error) {
      setImageError(true);
      setImageLoading(false);
    }
  };

  const processedUserPhotoUrl = decodedUserPhotoUrl
    ? validateImageUrl(decodedUserPhotoUrl)
    : null;

  useEffect(() => {
    if (processedUserPhotoUrl) {
      fetchImageWithAuth(processedUserPhotoUrl);
    } else {
      setImageDataUrl(null);
      setImageLoading(false);
    }
  }, [processedUserPhotoUrl]);

  useEffect(() => {
    return () => {
      if (imageDataUrl) {
        URL.revokeObjectURL(imageDataUrl);
      }
    };
  }, [imageDataUrl]);

  const shouldShowSkeleton =
    (!processedUserPhotoUrl && !imageDataUrl) || imageLoading;

  const ShapeBar = ({
    label,
    value,
    active,
  }: {
    label: string;
    value: number;
    active?: boolean;
  }) => (
    <div className="flex flex-col gap-3">
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
        />
      </div>
    </div>
  );

  return (
    <div className="bg-[#F0F0F0] w-full h-full px-10 flex flex-col">
      <PageHeader />

      <main className="flex-grow py-6 flex flex-col">
        <div className="flex flex-row w-full gap-8 flex-grow">
          <div className="relative w-[300px] h-[550px] rounded-lg shadow-lg overflow-hidden">
            {shouldShowSkeleton ? (
              <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                <div className="text-gray-400 text-sm">Loading image...</div>
              </div>
            ) : (
              <Image
                src={imageDataUrl || processedUserPhotoUrl!}
                alt="Model Wajah"
                fill
                loading="eager"
                decoding="sync"
                className="object-cover"
                quality={100}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            )}
          </div>

          <div className="w-7/12 flex flex-col">
            <div>
              <h1 className="font-oswald text-3xl">
                Bentuk Wajah Kamu {userData.faceShape}
              </h1>
              <p className="font-poppins text-base text-[#323232] my-[10px]">
                {faceShapeDetails?.penjelasan_face_shape.split("-")[0].trim()}
              </p>
            </div>
            <div className="space-y-4 pt-[10px]">
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          {faceShapeDetails && (
            <>
              <DetailList
                title="Fakta Unik"
                content={faceShapeDetails.penjelasan_face_shape}
              />
              <DetailList
                title="Karakteristik"
                content={faceShapeDetails.karakteristik}
                isDark
              />
            </>
          )}
        </div>
      </main>

      <Footer page="02" />
    </div>
  );
};
