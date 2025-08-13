"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

// Interface untuk data chart bentuk wajah
interface IShape {
  label: string;
  value: number;
  active?: boolean;
}
import Image from "next/image";
// import { Button } from "@/components/ui/button"; // Removed unused import
import { useAnalysisData, useGenerateStory } from "@/hooks/useAnalysisData";

// Fungsi untuk menghasilkan data chart bentuk wajah
const generateGimmickChartData = (mainShapeName: string): IShape[] => {
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

  const mainValue = 90;
  const otherCount = allShapes.length - 1;

  const baseOtherValue = Math.floor(10 / otherCount);
  let sisa = 10 - baseOtherValue * otherCount;

  const chartData: IShape[] = [];
  allShapes.forEach((shapeName) => {
    if (shapeName.toLowerCase() === englishMainShapeName.toLowerCase()) {
      chartData.push({ 
        label: shapeName, 
        value: mainValue, 
        active: true 
      });
    } else {
      let value = baseOtherValue;
      if (sisa > 0) {
        value += 1;
        sisa -= 1;
      }
      chartData.push({ 
        label: shapeName, 
        value, 
        active: false 
      });
    }
  });

  return chartData;
};
import {
  ActionButtons,
  BMISection,
  BodyShapeSection,
  // ColorPalette, // Removed unused import
  ColorToneSection,
  FaceShapeSection,
  ShareSection,
  StoryHeader,
  StoryUserData,
  UserProfile,
} from "@/components/story-components";

function StoryPage() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result_id");

  // Fetch analysis data using the custom hook
  const { data, isLoading, error: fetchError } = useAnalysisData(resultId);

  const { userData, userPhotoUrl } = data || {
    userData: null,
    userPhotoUrl: null,
  };

  // Generate story query
  const {
    refetch: generateStory,
    isLoading: isGenerating,
    // error: storyError, // Removed unused variable
  } = useGenerateStory();

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

  const handleDownloadPNG = async () => {
    if (!resultId) return;

    try {
      setError(null);
      // Memanggil generateStory tanpa parameter
      const result = await generateStory();

      if (result.data) {
        // Create download link
        const url = window.URL.createObjectURL(result.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = `hasil-analisa-story-${Date.now()}.png`;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Show success message
        showToast("Story berhasil didownload!", "success");

        // Redirect to Instagram
        window.open("https://www.instagram.com", "_blank");
      }
    } catch (error) {
      console.error("Error downloading PNG:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mendownload story";
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
    <div className="bg-white min-h-screen">
      <div
        id="story-content"
        className="relative w-full max-w-md mx-auto bg-white"
      >
        <StoryHeader />

        <UserProfile name={userData.name} userPhotoUrl={userPhotoUrl} />

        {(() => {
          const storyUserData: StoryUserData = {
            name: userData.name,
            faceShape: userData.faceShape,
            faceShapeDesc:
              userData.faceShapeAnalysis?.uniqueFact ||
              "Bentuk wajah kamu itu unik!",
            faceShapeAnalysis: generateGimmickChartData(userData.faceShape),
            colorTone: userData.colorTone,
            colorToneDesc: userData.colorToneAnalysis?.description || "",
            colorPalettes: {
              best: userData.colorToneAnalysis?.bestColors || [],
              neutral: userData.colorToneAnalysis?.neutralColors || [],
              worst: userData.colorToneAnalysis?.worstColors || [],
              combination: userData.colorToneAnalysis?.combination || [],
            },
            bodyShape: userData.bodyShape,
            bodyShapeDesc: userData.bodyShapeAnalysis?.description || "",
            bodyCharacteristics:
              userData.bodyShapeAnalysis?.characteristics || [],
            bmi: {
              value:
                typeof userData.bmi === "string"
                  ? parseFloat(userData.bmi)
                  : userData.bmi,
              category: "Normal",
              desc: "Tubuhmu Berada Di Titik Ideal Yang Bikin Eksplorasi Gaya Bisa Lebih Bebas.",
            },
          };

          return (
            <>
              <FaceShapeSection userData={storyUserData} />

              <ColorToneSection userData={storyUserData} />

              <BodyShapeSection userData={storyUserData} />

              <BMISection userData={storyUserData} />

              <ShareSection />
            </>
          );
        })()}
      </div>

      <ActionButtons
        onDownload={handleDownloadPNG}
        onShare={() => window.open("https://www.instagram.com", "_blank")}
        isDownloading={isGenerating}
      />
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
