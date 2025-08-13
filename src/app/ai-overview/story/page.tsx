"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import Image from "next/image";
import { useAnalysisData, useGenerateStory } from "@/hooks/useAnalysisData";

import {
  MainHeader,
  FaceShapeSection,
  ColorToneSection,
  BodyAndBmiSection,
  ShareAndActionSection,
  type StoryUserData,
} from "@/components/story-components";

const generateGimmickChartData = (
  mainShapeName: string
): StoryUserData["faceShapeAnalysis"] => {
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

  const chartData: StoryUserData["faceShapeAnalysis"] = [];
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

function StoryPage() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result_id");

  const { data, isLoading, error: fetchError } = useAnalysisData(resultId);
  const { userData, userPhotoUrl } = data || {
    userData: null,
    userPhotoUrl: null,
  };

  const { refetch: generateStory, isLoading: isGenerating } =
    useGenerateStory();
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

  // Siapkan data sekali untuk semua komponen
  const storyUserData: StoryUserData = {
    name: userData.name,
    faceShape: userData.faceShape,
    faceShapeDesc:
      userData.faceShapeAnalysis?.uniqueFact || "Bentuk wajah kamu itu unik!",
    faceShapeAnalysis: generateGimmickChartData(userData.faceShape),
    colorTone: userData.colorTone,
    colorToneDesc:
      userData.colorToneAnalysis?.description ||
      "Setiap warna memiliki cerita tersendiri untukmu.",
    colorPalettes: {
      best: userData.colorToneAnalysis?.bestColors || [],
      neutral: userData.colorToneAnalysis?.neutralColors || [],
      worst: userData.colorToneAnalysis?.worstColors || [],
      combination: userData.colorToneAnalysis?.combination || [],
    },
    bodyShape: userData.bodyShape,
    bodyShapeDesc:
      userData.bodyShapeAnalysis?.description ||
      "Proporsi tubuhmu memberikan keunikan dalam bergaya.",
    bodyCharacteristics: userData.bodyShapeAnalysis?.characteristics || [],
    bmi: {
      value: userData.bmi.value,
      category: userData.bmi.category || "Ideal",
      desc: userData.bmi.desc || "Jaga selalu kesehatan tubuhmu.",
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div
        id="story-content"
        className="relative w-full max-w-2xl mx-auto bg-gray-50 p-4 rounded-2xl"
      >
        <MainHeader name={userData.name} userPhotoUrl={userPhotoUrl} />

        <main>
          <FaceShapeSection userData={storyUserData} />
          <ColorToneSection userData={storyUserData} />
          <BodyAndBmiSection userData={storyUserData} />
          <ShareAndActionSection
            onDownload={handleDownloadStory}
            onShare={() =>
              window.open("https://www.instagram.com/tiebymin/", "_blank")
            }
            isDownloading={isGenerating}
          />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoryPage />
    </Suspense>
  );
}
