"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnalysisData,
  useBmiCategoryData,
  useBodyShapeData,
  useColorToneData,
  useFaceShapeData,
} from "@/hooks/useAnalysisData";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

import StoryPoster from "@/components/story-components/story-poster-story";
import { StoryPageSkeleton } from "@/components/skeleton-loading/story-skeleton";
import { defaultUserData } from "@/lib/mock-data";

function StoryPage() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result_id");

  const { data, isLoading, error: fetchError } = useAnalysisData(resultId);
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
  const { data: bodyDetails } = useBodyShapeData(
    data?.rawAnalysisData.body_shape_id
  );
  const { data: bmiCategoryDetails } = useBmiCategoryData(
    data?.rawAnalysisData.bmi_category_id || null
  );
  const { data: colorToneDetails } = useColorToneData(
    data?.rawAnalysisData.color_analysis_id
  );
  const { data: faceShapeDetails } = useFaceShapeData(
    data?.rawAnalysisData.face_shape_id
  );

  if (isLoading) {
    return <StoryPageSkeleton />;
  }

  if (fetchError) {
    return <p>Error: {fetchError.message}</p>;
  }

  if (!finalUserData) {
    return <p>No data found</p>;
  }

  return (
    <div
      id="story-content"
      className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4 md:p-6"
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
