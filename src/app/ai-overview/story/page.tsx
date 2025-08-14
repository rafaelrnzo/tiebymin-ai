"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnalysisData,
  useBmiCategoryData,
  useBodyShapeData,
  useGenerateStory,
} from "@/hooks/useAnalysisData";

import StoryPoster from "@/components/story-components";

function StoryPage() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result_id");

  const { data, isLoading, error: fetchError } = useAnalysisData(resultId);
  const { userData, userPhotoUrl } = data || {
    userData: null,
    userPhotoUrl: null,
  };
  const { data: bodyDetails } = useBodyShapeData(
    data?.rawAnalysisData.body_shape_id
  );
  const { data: bmiCategoryDetails } = useBmiCategoryData(
    data?.rawAnalysisData.bmi_category_id || null
  );

  const { refetch: generateStory } = useGenerateStory();
  const [error, setError] = useState<string | null>(null);

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
    try {
      setError(null);
      const result = await generateStory();
      if (result.data) {
        const url = window.URL.createObjectURL(result.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = `story-tiebymin-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showToast("Story berhasil diunduh!", "success");
        setTimeout(() => {
          window.open("https://www.instagram.com", "_blank");
        }, 1000);
      }
    } catch (error) {
      console.error("Error downloading PNG:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengunduh story";
      setError(errorMessage);
      showToast(errorMessage, "error");
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

  if (!userData) {
    return <p>No data found</p>;
  }

  return (
    <div
      id="story-content"
      className="bg-gray-100 min-h-screen flex justify-center p-6"
    >
      <StoryPoster
        handleDownloadStory={handleDownloadStory}
        userData={userData}
        userPhotoUrl={userPhotoUrl}
        bodyDetails={bodyDetails}
        bmiCategoryDetails={bmiCategoryDetails}
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
