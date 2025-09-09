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

// Helper function to decode and fix malformed URLs
const decodeUrl = (url: string): string => {
  try {
    // Decode twice to handle double encoding
    let decoded = decodeURIComponent(url);
    if (decoded.includes("%")) {
      decoded = decodeURIComponent(decoded);
    }

    // Handle case where URL has duplicate base URL with credentials
    // Extract the correct URL from malformed double-encoded URLs
    // Pattern matches: baseURL + "/" + baseURL + "/path"
    const baseUrlPattern =
      /https:\/\/[^\/]+\/[^\/]+:[^\/]+\/[^\/]+\/(https:\/\/[^\/]+\/[^\/]+:[^\/]+\/[^\/]+\/.+)/;
    let httpsMatches = decoded.match(baseUrlPattern);

    if (httpsMatches && httpsMatches[1]) {
      // Use the second base URL with path
      decoded = httpsMatches[1];
      console.log("🔧 Story Poster: Fixed duplicate base URL pattern");
    } else {
      // Fallback to original pattern for other cases
      httpsMatches = decoded.match(/https:\/\/[^\/]+\/(https:\/\/[^\/]+\/.+)/);
      if (httpsMatches && httpsMatches[1]) {
        decoded = httpsMatches[1];
        console.log("🔧 Story Poster: Fixed generic duplicate https pattern");
      }
    }

    return decoded;
  } catch (error) {
    console.warn("⚠️ story-poster-story: Failed to decode URL:", url, error);
    return url;
  }
};

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
      console.warn("Invalid image URL:", imageUrl);
      return null;
    }
  };

  // Decode the URL first to fix any duplication
  const decodedUserPhotoUrl = userPhotoUrl ? decodeUrl(userPhotoUrl) : null;

  console.log("📖 Story Poster - Raw userPhotoUrl:", userPhotoUrl);
  console.log("📖 Story Poster - Decoded userPhotoUrl:", decodedUserPhotoUrl);

  // Function to fetch image with authentication
  const fetchImageWithAuth = async (imageUrl: string) => {
    console.log(
      "📖 Story Poster - Starting fetchImageWithAuth for URL:",
      imageUrl
    );

    try {
      setImageLoading(true);
      setImageError(false);

      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("userToken");

      console.log(
        "📖 Story Poster - Token found:",
        !!token,
        token ? token.substring(0, 20) + "..." : "null"
      );

      if (!token) {
        console.error(
          "❌ Story Poster - No authentication token found for image fetch"
        );
        setImageError(true);
        setImageLoading(false);
        return;
      }

      console.log("📖 Story Poster - Fetching image with auth headers...");
      const response = await fetch(imageUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        "📖 Story Poster - Response status:",
        response.status,
        response.statusText
      );
      console.log("📖 Story Poster - Response headers:", [
        ...response.headers.entries(),
      ]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "❌ Story Poster - Fetch failed:",
          `HTTP ${response.status}: ${response.statusText}`,
          errorText
        );
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const blob = await response.blob();
      console.log(
        "📖 Story Poster - Blob received:",
        blob.size,
        "bytes, type:",
        blob.type
      );

      const dataUrl = URL.createObjectURL(blob);
      console.log(
        "📖 Story Poster - Created data URL, length:",
        dataUrl.length
      );
      setImageDataUrl(dataUrl);
      setImageLoading(false);
      console.log("✅ Story Poster - Image fetch successful");
    } catch (error) {
      console.error("❌ Story Poster - Error fetching image with auth:", error);
      setImageError(true);
      setImageLoading(false);
    }
  };

  // Process the user photo URL
  const processedUserPhotoUrl = decodedUserPhotoUrl
    ? validateImageUrl(decodedUserPhotoUrl)
    : null;

  console.log(
    "📖 Story Poster - Processed userPhotoUrl:",
    processedUserPhotoUrl
  );

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

  console.log("📖 Story Poster - shouldShowSkeleton:", shouldShowSkeleton);
  console.log("📖 Story Poster - imageDataUrl:", !!imageDataUrl);
  console.log("📖 Story Poster - imageLoading:", imageLoading);

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
