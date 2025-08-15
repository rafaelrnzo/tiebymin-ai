"use client";
import { Navbar } from "@/components/component-landing/navbar";
import { Cover, FaceShape } from "@/components/pdf-components";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalysisData, useDownloadPdf } from "@/hooks/useAnalysisData";
import { defaultUserData } from "@/lib/mock-data";
import { ChevronRight, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function PreviewPdfPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result_id");

  const { data: analysisResult } = useAnalysisData(resultId);
  const { userData = defaultUserData, userPhotoUrl } = analysisResult || {};

  const { refetch: downloadPdf } = useDownloadPdf();
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!resultId) return;

    setIsDownloading(true);
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
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mendownload PDF";
      setError(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-[#F0F0F0] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        {/* White card that wraps everything */}
        <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-6xl p-4 md:p-6">
          {/* Close button inside the card */}
          <X
            onClick={() => router.back()}
            className="cursor-pointer absolute top-4 right-4 md:top-6 md:right-6 text-gray-500 hover:text-gray-800 z-10"
          />

          {/* Cover and FaceShape components side by side */}
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6 mb-8 mt-4">
            {/* Cover component */}
            <div className="transform scale-50 md:scale-75 origin-center -mx-18 -mt-[5rem]">
              <Cover userData={userData} />
            </div>

            {/* FaceShape component */}
            <div className="transform scale-50 md:scale-75 origin-center -mx-18 -mt-[5rem]">
              <FaceShape userData={userData} userPhotoUrl={userPhotoUrl} />
            </div>
          </div>

          {/* Download button */}
          <div className="flex justify-center md:justify-start -mt-[7rem] pb-10 md:pl-10">
            <Button
              onClick={handleDownloadPDF}
              className="bg-[#323232] hover:bg-[#404040] rounded-lg px-8 py-3 flex items-center gap-2"
              disabled={isDownloading}
            >
              <span className="text-white font-poppins font-bold">
                {isDownloading ? "Downloading..." : "Download PDF"}
              </span>
              {!isDownloading && (
                <ChevronRight className="text-white w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Error message outside the card */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PreviewPdf() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#F0F0F0] min-h-screen flex flex-col">
          <Skeleton className="h-16 w-full" />
          <div className="flex-grow flex items-center justify-center p-4">
            <Skeleton className="h-[600px] w-full max-w-4xl" />
          </div>
        </div>
      }
    >
      <PreviewPdfPage />
    </Suspense>
  );
}
