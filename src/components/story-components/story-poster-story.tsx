import {
  BmiCategory,
  BodyShapeData,
  ColorAnalysis as ColorTone,
  FaceShape,
  UserData,
} from "@/types";
import Image from "next/image";
import { useState, useEffect } from "react";
import { StoryHeader } from "./story-header-story";
import { StoryQRSection } from "./story-qr-section-story";
import { StoryFaceShape } from "./story-faceshape-story";
import { StoryColorTone } from "./story-colortone-story";
import { StoryBodyShape } from "./story-bodyshape-story";
import { decodeUrl } from "@/lib/urlUtils";

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

interface StoryPosterProps {
  userData: UserData;
  userPhotoUrl: string | null;
  handleDownloadStory: () => void;
  bodyDetails?: BodyShapeData;
  bmiCategoryDetails?: BmiCategory;
  isGenerating: boolean;
  colorToneDetails?: ColorTone;
  faceShapeDetails?: FaceShape;
  bmiValue?: number;
  bmiCategory?: string;
}

export default function StoryPoster({
  userData,
  userPhotoUrl,
  handleDownloadStory,
  bodyDetails,
  bmiCategoryDetails,
  isGenerating,
  colorToneDetails,
  faceShapeDetails,
  bmiValue,
  bmiCategory,
}: StoryPosterProps) {
  const faceShapeAnalysisData = generateGimmickChartData(userData.faceShape);
  const penjelasanLengkap = faceShapeDetails?.penjelasan_face_shape || "";

  const kalimatUtama = penjelasanLengkap.split("-")[0].trim();

  // State for image loading
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  // Helper function to validate image URL
  const validateImageUrl = (imageUrl: string | null): string | null => {
    if (!imageUrl) return null;

    try {
      new URL(imageUrl); // Validate URL format
      return imageUrl;
    } catch (error) {
      return null;
    }
  };

  // Decode the URL first to fix any duplication
  const decodedUserPhotoUrl = userPhotoUrl ? decodeUrl(userPhotoUrl) : null;

  // Function to fetch image with authentication
  const fetchImageWithAuth = async (imageUrl: string) => {
    try {
      setImageLoading(true);
      setImageError(false);

      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("userToken") ||
        urlToken;

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

  // Process the user photo URL
  const processedUserPhotoUrl = decodedUserPhotoUrl
    ? validateImageUrl(decodedUserPhotoUrl)
    : null;

  // Fetch image with authentication when processedUserPhotoUrl changes
  useEffect(() => {
    if (processedUserPhotoUrl) {
      fetchImageWithAuth(processedUserPhotoUrl);
    } else {
      setImageDataUrl(null);
      setImageLoading(false);
    }
  }, [processedUserPhotoUrl]);

  // Cleanup object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imageDataUrl) {
        URL.revokeObjectURL(imageDataUrl);
      }
    };
  }, [imageDataUrl]);

  // Determine if we should show skeleton
  const shouldShowSkeleton =
    (!processedUserPhotoUrl && !imageDataUrl) || imageLoading;

  return (
    <div
      className="bg-[#f0f0f0] text-gray-800 w-[1080px] mx-auto p-8 font-sans"
      style={{ lineHeight: 1.4 }}
    >
      <div className="m-[100px]">
        <StoryHeader userName={userData.name} />
        <hr className="mb-10" />

        <div className="flex gap-5 mb-6">
          <div className="w-[322px] rounded-lg">
            {shouldShowSkeleton ? (
              // Skeleton loading state
              <div className="w-full h-[400px] bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                <div className="text-gray-400 text-sm">Loading image...</div>
              </div>
            ) : (
              // Actual image
              <Image
                src={imageDataUrl || processedUserPhotoUrl!}
                alt="User Photo"
                width={322}
                height={400}
                className="object-cover h-[400px] rounded-lg"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            )}
          </div>

          <StoryQRSection
            handleDownloadStory={handleDownloadStory}
            isGenerating={isGenerating}
          />
        </div>

        <hr className="mt-10" />

        <StoryFaceShape
          faceShapeAnalysisData={faceShapeAnalysisData}
          userData={userData}
          kalimatUtama={kalimatUtama}
        />

        <hr className="mb-8" />

        <StoryColorTone
          userData={userData}
          colorToneDetails={colorToneDetails}
        />

        <hr className="mb-14" />

        <StoryBodyShape
          userData={userData}
          bodyDetails={bodyDetails}
          bmiCategoryDetails={bmiCategoryDetails}
          bmiValue={bmiValue}
          bmiCategory={bmiCategory}
        />
      </div>
    </div>
  );
}
