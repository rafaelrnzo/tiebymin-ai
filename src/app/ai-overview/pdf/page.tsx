"use client";
import { BackCover } from "@/components/pdf-components/backcover-pdf";
import { BodyShape } from "@/components/pdf-components/bodyshape-pdf";
import { CelebritiesMatch } from "@/components/pdf-components/celebrities-pdf";
import { ColorTone } from "@/components/pdf-components/colortone-pdf";
import { Conclusion } from "@/components/pdf-components/conclusion-pdf";
import { Cover } from "@/components/pdf-components/cover-pdf";
import { FaceShape } from "@/components/pdf-components/faceshape-pdf";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnalysisData,
  useBmiCategoryData,
  useBodyShapeData,
  useCelebrityData,
  useColorToneData,
  useDownloadPdf,
  useFaceShapeData,
} from "@/hooks/useAnalysisData";
import { useAllTips } from "@/hooks/useAllTips";
import { defaultUserData } from "@/lib/mock-data";
import {
  AllTips,
  BmiCategory,
  BodyShapeData,
  Celebrity,
  ColorAnalysis as ColorToneType,
  FaceShape as FaceShapeType,
  UserData,
} from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useMemo, useState, useEffect } from "react";
import { ProductRecommendation } from "@/components/pdf-components/product-recommendation-pdf";

interface PageProps {
  userData: UserData;
  userPhotoUrl?: string | null;
  bodyDetails?: BodyShapeData;
  faceShapeDetails?: FaceShapeType;
  colorToneDetails?: ColorToneType;
  celebrityDetails?: Celebrity;
  bmiCategoryDetails?: BmiCategory;
  faceTip?: AllTips["faceTip"];
  bodyTip?: AllTips["bodyTip"];
  colorTip?: AllTips["colorTip"];
  isLoading?: boolean;
  isError?: boolean;
  bmiValue?: number;
  bmiCategory?: string;
}

function PdfPage() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result_id");
  const isPrintMode = searchParams.get("print") === "true";
  const tokenFromUrl = searchParams.get("token");
  const userNameFromUrl = searchParams.get("userName");

  // Set token to localStorage if provided in URL (for PDF generation)
  const [tokenReady, setTokenReady] = useState(false);
  const [pdfContentReady, setPdfContentReady] = useState(false);

  useEffect(() => {
    if (isPrintMode && tokenFromUrl && typeof window !== "undefined") {
      localStorage.setItem("accessToken", tokenFromUrl);
      localStorage.setItem("userToken", tokenFromUrl);
      // Small delay to ensure localStorage is set before proceeding
      setTimeout(() => {
        setTokenReady(true);
      }, 100);
    } else if (!isPrintMode) {
      setTokenReady(true); // For normal page loads
    } else if (isPrintMode && !tokenFromUrl) {
      // In print mode but no token from URL, check if token exists in localStorage
      const existingToken =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("userToken");
      if (existingToken) {
        setTokenReady(true);
      } else {
        // Still set ready to true to prevent blocking, but data fetching will fail gracefully
        setTokenReady(true);
      }
    }
  }, [isPrintMode, tokenFromUrl]);

  const {
    data: analysisResult,
    isLoading,
    error: fetchError,
  } = useAnalysisData(tokenReady ? resultId : null);

  const { rawAnalysisData } = analysisResult || {
    rawAnalysisData: null,
  };
  const analysisData = rawAnalysisData;

  const { data: bodyDetails } = useBodyShapeData(
    tokenReady && analysisData?.body_shape_id?.toString()
  );

  const { data: faceShapeDetails } = useFaceShapeData(
    tokenReady && analysisData?.face_shape_id?.toString()
  );

  const { data: colorToneDetails } = useColorToneData(
    tokenReady && analysisData?.color_analysis_id?.toString()
  );

  const { data: celebrityDetails } = useCelebrityData(
    tokenReady && analysisData?.celebrity_id?.toString()
  );

  const { data: bmiCategoryDetails } = useBmiCategoryData(
    tokenReady && analysisData?.bmi_category_id?.toString()
  );

  const {
    data: tips,
    isLoading: tipsLoading,
    isError: tipsError,
  } = useAllTips({
    analysisData: rawAnalysisData,
    enabled: tokenReady && !!rawAnalysisData,
  });

  const { userData = defaultUserData, userPhotoUrl } = analysisResult || {};
  const finalUserData = useMemo(() => {
    if (!analysisResult?.userData) {
      return defaultUserData;
    }

    let displayName: string;

    if (isPrintMode && userNameFromUrl) {
      displayName = userNameFromUrl;
    } else if (typeof window !== "undefined") {
      displayName =
        localStorage.getItem("firstName") || analysisResult.userData.name;
    } else {
      displayName = analysisResult.userData.name;
    }

    return {
      ...analysisResult.userData,
      username: displayName,
      name: displayName,
      firstName: displayName,
    };
  }, [analysisResult, isPrintMode, userNameFromUrl]);

  // Enhanced PDF readiness logic
  useEffect(() => {
    if (isPrintMode && analysisResult && finalUserData && analysisData) {
      // Set a timer to mark content as ready after minimum required data is loaded
      const timer = setTimeout(() => {
        setPdfContentReady(true);
      }, 3000); // 3 second fallback

      // Check if we have sufficient data to proceed
      const hasBasicData = !!(finalUserData && analysisData);
      const hasOptionalData = !!(
        bodyDetails ||
        faceShapeDetails ||
        colorToneDetails
      );

      if (hasBasicData && hasOptionalData) {
        clearTimeout(timer);
        setPdfContentReady(true);
      }

      return () => clearTimeout(timer);
    }
  }, [
    isPrintMode,
    analysisResult,
    finalUserData,
    analysisData,
    bodyDetails,
    faceShapeDetails,
    colorToneDetails,
    celebrityDetails,
    tips,
  ]);

  // Debug logging for PDF generation
  if (isPrintMode) {
    // PDF generation debug info removed for production
  }

  const { mutateAsync: downloadPdf, isPending: isGenerating } =
    useDownloadPdf();

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
    }, 2000);
  };

  const handleDownloadPDF = async () => {
    if (!resultId) return;

    try {
      setError(null);
      const result = await downloadPdf({ resultId });

      if (result.data) {
        const url = window.URL.createObjectURL(result.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = `hasil-analisa-lengkap-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showToast("PDF berhasil didownload!", "success");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mendownload PDF";
      setError(errorMessage);
      showToast(errorMessage, "error");
    }
  };

  const shareToStory = () => {
    if (resultId) {
      window.location.href = `/ai-overview/story?result_id=${resultId}`;
    } else {
      alert("Result ID tidak ditemukan. Tidak dapat membagikan hasil analisa.");
    }
  };

  const pages: {
    [key: string]: React.ComponentType<PageProps>;
  } = {
    Cover: (props) => <Cover {...props} />,
    FaceShape: (props) => <FaceShape {...props} />,
    ColorTone: (props) => <ColorTone {...props} />,
    BodyShape: (props) => <BodyShape {...props} />,
    CelebritiesMatch: (props) => <CelebritiesMatch {...props} />,
    Conclusion: (props) => <Conclusion {...props} />,
    ProductRecommendation: (props) => (
      <ProductRecommendation
        {...props}
        resultId={resultId as string}
        bodyShapeId={analysisData?.body_shape_id?.toString()}
        faceShapeId={analysisData?.face_shape_id?.toString()}
      />
    ),
    BackCover: () => <BackCover />,
  };

  const pageOrder = Object.keys(pages) as (keyof typeof pages)[];

  const [activePage, setActivePage] = useState<keyof typeof pages>("Cover");

  const activePageIndex = pageOrder.indexOf(activePage);

  const goToNextPage = () => {
    const nextPageIndex = (activePageIndex + 1) % pageOrder.length;
    setActivePage(pageOrder[nextPageIndex]);
  };

  const goToPrevPage = () => {
    const prevPageIndex =
      (activePageIndex - 1 + pageOrder.length) % pageOrder.length;
    setActivePage(pageOrder[prevPageIndex]);
  };

  if (isPrintMode) {
    // For PDF generation, render immediately with available data
    // Don't wait for all data to be loaded to speed up PDF generation
    const hasBasicData = finalUserData && analysisData;

    return (
      <main
        id="pdf-content"
        data-pdf-ready={pdfContentReady ? "true" : "false"}
        data-loading-state={isLoading ? "loading" : "loaded"}
        data-has-basic-data={hasBasicData ? "true" : "false"}
      >
        {hasBasicData ? (
          pageOrder.map((pageKey, index) => {
            const ComponentToPrint = pages[pageKey];
            const isNotLastPage = index < pageOrder.length - 1;

            return (
              <section
                key={pageKey}
                className="pdf-page"
                style={{ pageBreakAfter: isNotLastPage ? "always" : "auto" }}
              >
                <ComponentToPrint
                  userData={finalUserData}
                  userPhotoUrl={userPhotoUrl}
                  bodyDetails={bodyDetails}
                  faceShapeDetails={faceShapeDetails}
                  colorToneDetails={colorToneDetails}
                  celebrityDetails={celebrityDetails}
                  bmiCategoryDetails={bmiCategoryDetails}
                  faceTip={tips?.faceTip}
                  bodyTip={tips?.bodyTip}
                  colorTip={tips?.colorTip}
                  isLoading={false} // Don't show loading state in PDF
                  isError={false} // Don't show error state in PDF
                  bmiValue={analysisData?.analysis_details?.bmi?.bmi_value}
                  bmiCategory={
                    analysisData?.analysis_details?.bmi?.category?.kategori
                  }
                />
              </section>
            );
          })
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-xl font-bold mb-4">
                Loading PDF Content...
              </div>
              <div className="text-gray-600">
                Please wait while we prepare your analysis
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-[#333333]">
        <div className="space-y-4">
          <Skeleton className="h-96 w-96" />
          <Skeleton className="h-8 w-96" />
        </div>
      </div>
    );
  }

  if (fetchError || error) {
    return <p>Error: {fetchError?.message || error}</p>;
  }

  const ActiveComponent = pages[activePage];

  return (
    <>
      <div className="sticky bottom-0 bg-[#f0f0f0] shadow-lg p-4 z-50">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <Button
            onClick={goToPrevPage}
            className="bg-gray-800 text-[#f0f0f0] hover:bg-gray-700"
          >
            <ChevronLeft size={24} />
          </Button>
          <div className="text-center">
            <p className="font-bold text-lg">{activePage}</p>
            <p className="text-sm text-gray-500">
              Page {activePageIndex + 1} of {pageOrder.length}
            </p>
          </div>
          <Button
            onClick={goToNextPage}
            className="bg-gray-800 text-[#f0f0f0] hover:bg-gray-700"
          >
            <ChevronRight size={24} />
          </Button>
        </div>
        <div className="flex justify-center mt-4 gap-4">
          <button
            onClick={shareToStory}
            className="bg-purple-500 text-[#f0f0f0] px-4 py-2 rounded-md hover:bg-purple-600 transition"
          >
            Bagikan ke Instagram
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="bg-[#EF789B] text-[#f0f0f0] px-4 py-2 rounded-md hover:bg-[#E5679A] transition disabled:bg-gray-400"
          >
            {isGenerating ? "Downloading..." : "Download PDF"}
          </button>
        </div>
      </div>
      <div className="max-w-full self-center mx-auto">
        <ActiveComponent
          userData={finalUserData}
          userPhotoUrl={userPhotoUrl}
          bodyDetails={bodyDetails}
          faceShapeDetails={faceShapeDetails}
          colorToneDetails={colorToneDetails}
          celebrityDetails={celebrityDetails}
          bmiCategoryDetails={bmiCategoryDetails}
          faceTip={tips?.faceTip}
          bodyTip={tips?.bodyTip}
          colorTip={tips?.colorTip}
          isLoading={tipsLoading}
          isError={tipsError}
          bmiValue={analysisData?.analysis_details?.bmi?.bmi_value}
          bmiCategory={analysisData?.analysis_details?.bmi?.category?.kategori}
        />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full h-screen bg-[#333333]">
          <Skeleton className="h-96 w-96" />
        </div>
      }
    >
      <PdfPage />
    </Suspense>
  );
}
