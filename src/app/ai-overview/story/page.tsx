"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnalysisData,
  useBmiCategoryData,
  useBodyShapeData,
  useColorToneData,
  useFaceShapeData,
  useGenerateStory,
} from "@/hooks/useAnalysisData";

import StoryPoster from "@/components/story-components";
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

  const { refetch: generateStory } = useGenerateStory();
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const showToast = (message: string, type: "success" | "error") => {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      background: ${type === "success" ? "#10B981" : "#EF4444"};
      animation: slideIn 0.3s ease;
    `;

    // Add slide animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
      style.remove();
    }, 4000);
  };

  const handleDownloadStory = async () => {
    if (!resultId) return;
    setIsGenerating(true);
    try {
      setError(null);
      const result = await generateStory();
      if (result.data) {
        const file = new File(
          [result.data],
          `story-tiebymin-${Date.now()}.png`,
          { type: "image/png" }
        );

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Tie By Min Story",
            text: "Coba AI Fashion Analysis aku!",
          });
        } else {
          // fallback ke download biasa
          const url = URL.createObjectURL(file);
          const link = document.createElement("a");
          link.href = url;
          link.download = file.name;
          link.click();
          URL.revokeObjectURL(url);
          showToast("Story berhasil diunduh!", "success");
        }
      }
    } catch (error) {
      console.error("Error sharing PNG:", error);
      setError("Gagal membagikan story");
      showToast("Gagal membagikan story", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-[#333333]">
        <Image
          src="/tie-by-min-logo-light.png"
          alt="Logo Tie By Min"
          width={180}
          height={80}
        />
      </div>
    );
  }

  if (fetchError || error) {
    return <p>Error: {fetchError?.message || error}</p>;
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
        handleDownloadStory={handleDownloadStory}
        isGenerating={isGenerating}
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
    <Suspense
      fallback={
        <div className="bg-gray-100 min-h-screen flex justify-center p-6">
          <Skeleton className="h-[812px] w-[456px]" />
        </div>
      }
    >
      <StoryPage />
    </Suspense>
  );
}
