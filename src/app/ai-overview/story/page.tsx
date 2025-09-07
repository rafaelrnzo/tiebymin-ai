"use client";
import {
  useAnalysisData,
  useBmiCategoryData,
  useBodyShapeData,
  useColorToneData,
  useFaceShapeData,
} from "@/hooks/useAnalysisData";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { StoryPageSkeleton } from "@/components/skeleton-loading/story-skeleton";
import StoryPoster from "@/components/story-components/story-poster-story";
import { defaultUserData } from "@/lib/mock-data";

function StoryPage() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result_id");
  const tokenFromUrl = searchParams.get("token");
  const isPrintMode = searchParams.get("print") === "true";

  // Set token to localStorage if provided in URL (for story generation)
  const [tokenReady, setTokenReady] = useState(false);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    if (isPrintMode && tokenFromUrl && typeof window !== "undefined") {
      localStorage.setItem("accessToken", tokenFromUrl);
      localStorage.setItem("userToken", tokenFromUrl);
      setTokenReady(true);
    } else if (!isPrintMode) {
      setTokenReady(true); // For normal page loads
    }
  }, [isPrintMode, tokenFromUrl]);

  const {
    data,
    isLoading,
    error: fetchError,
  } = useAnalysisData(tokenReady ? resultId : null);

  const { userData, userPhotoUrl } = data || {
    userData: null,
    userPhotoUrl: null,
  };

  const finalUserData = useMemo(() => {
    if (!userData) {
      return defaultUserData;
    }

    let displayName: string;

    if (typeof window !== "undefined") {
      displayName = localStorage.getItem("firstName") || userData.name;
    } else {
      displayName = userData.name;
    }

    return {
      ...userData,
      username: displayName,
      name: displayName,
      firstName: displayName,
    };
  }, [userData]);

  const { data: bodyDetails, isLoading: bodyLoading } = useBodyShapeData(
    tokenReady && data?.rawAnalysisData.body_shape_id
  );
  const { data: bmiCategoryDetails, isLoading: bmiLoading } =
    useBmiCategoryData(
      tokenReady && (data?.rawAnalysisData.bmi_category_id || null)
    );
  const { data: colorToneDetails, isLoading: colorLoading } = useColorToneData(
    tokenReady && data?.rawAnalysisData.color_analysis_id
  );
  const { data: faceShapeDetails, isLoading: faceLoading } = useFaceShapeData(
    tokenReady && data?.rawAnalysisData.face_shape_id
  );

  // Check if all data is ready
  useEffect(() => {
    const allDataLoaded =
      !isLoading && !bodyLoading && !colorLoading && !faceLoading;
    const allDataExists = bodyDetails && colorToneDetails && faceShapeDetails;

    if (allDataLoaded && allDataExists) {
      // Add a small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        setDataReady(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [
    isLoading,
    bodyLoading,
    colorLoading,
    faceLoading,
    bodyDetails,
    colorToneDetails,
    faceShapeDetails,
  ]);

  // Show loading until all data is ready
  if (isLoading || bodyLoading || colorLoading || faceLoading || !dataReady) {
    return <StoryPageSkeleton />;
  }

  if (fetchError) {
    return (
      <div id="story-content" data-story-ready="false" className="p-4">
        <p>Error: {fetchError.message}</p>
      </div>
    );
  }

  if (!finalUserData) {
    return (
      <div id="story-content" data-story-ready="false" className="p-4">
        <p>No data found</p>
      </div>
    );
  }

  return (
    <div
      id="story-content"
      data-story-ready={
        dataReady && !!bodyDetails && !!colorToneDetails && !!faceShapeDetails
      }
      className="bg-[#f0f0f0] min-h-screen flex flex-col items-center justify-center p-4 md:p-6"
    >
      <StoryPoster
        handleDownloadStory={() => {}}
        isGenerating={false}
        userData={finalUserData}
        userPhotoUrl={userPhotoUrl}
        bodyDetails={bodyDetails}
        bmiCategoryDetails={bmiCategoryDetails}
        colorToneDetails={colorToneDetails}
        faceShapeDetails={faceShapeDetails}
        bmiValue={data?.rawAnalysisData?.analysis_details?.bmi?.bmi_value}
        bmiCategory={
          data?.rawAnalysisData?.analysis_details?.bmi?.category?.kategori
        }
      />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<StoryPageSkeleton />}>
      <StoryPage />
    </Suspense>
  );
}
