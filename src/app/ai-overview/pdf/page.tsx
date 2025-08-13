"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { useAnalysisData, useDownloadPdf, UserData, defaultUserData } from "@/hooks/useAnalysisData";
import {
  BackCover,
  BodyShape,
  CelebritiesMatch,
  ColorTone,
  Conclusion,
  Cover,
  FaceShape,
  PageFooter,
} from "@/components/pdf-components";

function PdfPage() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result_id");
  const isPrintMode = searchParams.get("print") === "true";

  // Fetch analysis data using the custom hook
  const {
    data,
    isLoading,
    error: fetchError,
  } = useAnalysisData(resultId);

  const { userData = defaultUserData, userPhotoUrl } = data || {};

  // Download PDF query
  const {
    refetch: downloadPdf,
    isLoading: isGenerating,
    // error: pdfError, // Removed unused variable
  } = useDownloadPdf();

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

  const handleDownloadPDF = async () => {
    if (!resultId) return;

    try {
      setError(null);
      // Memanggil downloadPdf tanpa parameter
      const result = await downloadPdf();
      
      if (result.data) {
        // Create download link
        const url = window.URL.createObjectURL(result.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = `hasil-analisa-lengkap-${Date.now()}.pdf`;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Show success message
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
    // Redirect ke halaman story dengan parameter result_id
    if (resultId) {
      window.location.href = `/ai-overview/story?result_id=${resultId}`;
    } else {
      alert("Result ID tidak ditemukan. Tidak dapat membagikan hasil analisa.");
    }
  };

  // Define page components
  const pages: {
    [key: string]: React.ComponentType<{
      userData: UserData;
      userPhotoUrl?: string | null;
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

  if (isPrintMode) {
    return (
      <main id="pdf-content">
        {pageOrder.map((pageKey) => {
          const ComponentToPrint = pages[pageKey];
          return (
            <section
              key={pageKey}
              className="pdf-page"
              style={{ pageBreakAfter: "always" }}
            >
              <ComponentToPrint
                userData={userData}
                userPhotoUrl={userPhotoUrl}
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

  const ActiveComponent = pages[activePage];

  return (
    <div className="bg-gray-100">
      <nav className="p-2 sm:p-4 bg-white shadow-md sticky top-0 z-50 flex flex-wrap justify-center gap-1 sm:gap-2 overflow-x-auto">
        <div className="flex flex-nowrap overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto justify-start sm:justify-center">
          {pageOrder.map((page) => (
            <Button
              key={page}
              onClick={() => setActivePage(page)}
              className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap mr-1 sm:mr-0 ${
                activePage === page
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </Button>
          ))}
        </div>
        <div className="flex w-full sm:w-auto justify-center mt-2 sm:mt-0">
          <button
            onClick={shareToStory}
            className="bg-purple-500 text-white px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-md hover:bg-purple-600 transition mr-2"
          >
            Bagikan ke Instagram
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="bg-pink-500 text-white px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-md hover:bg-pink-600 transition disabled:bg-gray-400"
          >
            {isGenerating ? "Downloading..." : "Download PDF"}
          </button>
        </div>
      </nav>
      <div className="w-full">
        <ActiveComponent userData={userData} userPhotoUrl={userPhotoUrl} />
      </div>
      <PageFooter pageNumber="" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PdfPage />
    </Suspense>
  );
}
