"use client";
import {
  BackCover,
  BodyShape,
  CelebritiesMatch,
  ColorTone,
  Conclusion,
  Cover,
  FaceShape,
} from "@/components/pdf-components";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnalysisData,
  useBodyShapeData,
  useDownloadPdf,
} from "@/hooks/useAnalysisData";
import { defaultUserData } from "@/lib/mock-data";
import { BodyShapeData, UserData } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState, useMemo } from "react";

function PdfPage() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result_id");
  const isPrintMode = searchParams.get("print") === "true";

  const userNameFromUrl = searchParams.get("userName");

  const {
    data: analysisResult,
    isLoading,
    error: fetchError,
  } = useAnalysisData(resultId);
  const { rawAnalysisData } = analysisResult || {
    rawAnalysisData: null,
  };
  const analysisData = rawAnalysisData;

  const { data: bodyDetails } = useBodyShapeData(
    analysisData?.body_shape_id?.toString()
  );

  const { userData = defaultUserData, userPhotoUrl } = analysisResult || {};
  const finalUserData = useMemo(() => {
    if (!analysisResult?.userData) {
      return defaultUserData;
    }

    let displayName: string;

    if (isPrintMode && userNameFromUrl) {
      displayName = userNameFromUrl;
    } else if (typeof window !== "undefined") {
      displayName = localStorage.getItem("firstName") || analysisResult.userData.name;
    } else {
      displayName = analysisResult.userData.name;
    }

    return {
      ...analysisResult.userData,
      username: displayName,
      name: displayName,
    };
  }, [analysisResult, isPrintMode, userNameFromUrl]);

  const { refetch: downloadPdf, isLoading: isGenerating } = useDownloadPdf();

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
      const result = await downloadPdf();

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
      console.error("Error downloading PDF:", error);
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

  // useEffect(() => {
  //   handleDownloadPDF();
  // }, []);

  const pages: {
    [key: string]: React.ComponentType<{
      userData: UserData;
      userPhotoUrl?: string | null;
      bodyDetails?: BodyShapeData;
    }>;
  } = {
    Cover,
    FaceShape,
    ColorTone,
    BodyShape,
    CelebritiesMatch,
    Conclusion,
    BackCover,
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
    return (
      <main id="pdf-content">
        {pageOrder.map((pageKey, index) => {
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
              />
            </section>
          );
        })}
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
      <div className="sticky bottom-0 bg-white shadow-lg p-4 z-50">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <Button
            onClick={goToPrevPage}
            className="bg-gray-800 text-white hover:bg-gray-700"
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
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            <ChevronRight size={24} />
          </Button>
        </div>
        <div className="flex justify-center mt-4 gap-4">
          <button
            onClick={shareToStory}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
          >
            Bagikan ke Instagram
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition disabled:bg-gray-400"
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
