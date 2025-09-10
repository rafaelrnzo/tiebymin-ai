"use client";
import { BackCover } from "@/components/pdf-components/backcover-pdf";
import { BodyShape } from "@/components/pdf-components/bodyshape-pdf";
import { CelebritiesMatch } from "@/components/pdf-components/celebrities-pdf";
import { ColorTone } from "@/components/pdf-components/colortone-pdf";
import { Conclusion } from "@/components/pdf-components/conclusion-pdf";
import { Cover } from "@/components/pdf-components/cover-pdf";
import { FaceShape } from "@/components/pdf-components/faceshape-pdf";
import { ProductRecommendation } from "@/components/pdf-components/product-recommendation-pdf";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllTips } from "@/hooks/useAllTips";
import {
  useAnalysisData,
  useBodyShapeData,
  useCelebrityData,
  useColorToneData,
  useFaceShapeData,
} from "@/hooks/useAnalysisData";
import { useDownloadPdf } from "@/hooks/useDownloadPdf";
import { defaultUserData } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface PdfPage {
  id: string;
  Component: React.ReactElement;
}

function PreviewPdfPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result_id");

  const [currentPage, setCurrentPage] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [connectionQuality, setConnectionQuality] = useState<
    "fast" | "slow" | "unknown"
  >("unknown");

  // Enhanced download states
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Network quality detection dengan lebih detail
  useEffect(() => {
    if (typeof window !== "undefined" && "navigator" in window) {
      // Define proper types for Network Information API
      interface NetworkInformation extends EventTarget {
        readonly effectiveType: string;
        readonly downlink: number;
        readonly rtt: number;
        readonly type?: string;
      }

      interface NavigatorWithConnection extends Navigator {
        connection?: NetworkInformation;
        mozConnection?: NetworkInformation;
        webkitConnection?: NetworkInformation;
      }

      const navigatorWithConnection = navigator as NavigatorWithConnection;
      const connection =
        navigatorWithConnection.connection ||
        navigatorWithConnection.mozConnection ||
        navigatorWithConnection.webkitConnection;

      if (connection) {
        const effectiveType = connection.effectiveType;
        const downlink = connection.downlink || 0;

        // Lebih akurat berdasarkan kecepatan
        if (
          effectiveType === "slow-2g" ||
          effectiveType === "2g" ||
          downlink < 1
        ) {
          setConnectionQuality("slow");
        } else if (effectiveType === "3g" || downlink < 5) {
          setConnectionQuality("slow");
        } else {
          setConnectionQuality("fast");
        }
      } else {
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );
        setConnectionQuality(isMobile ? "slow" : "fast");
      }
    }
  }, []);

  const { data: analysisResult } = useAnalysisData(resultId);
  const {
    userData = defaultUserData,
    userPhotoUrl,
    rawAnalysisData,
  } = analysisResult || {};

  const finalUserData = useMemo(() => {
    if (!analysisResult?.userData) return defaultUserData;
    let displayName: string;
    if (typeof window !== "undefined") {
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
  }, [analysisResult]);

  const { data: bodyDetails } = useBodyShapeData(
    rawAnalysisData?.body_shape_id
  );
  const { data: colorToneDetails } = useColorToneData(
    rawAnalysisData?.color_analysis_id
  );
  const { data: faceShapeDetails } = useFaceShapeData(
    rawAnalysisData?.face_shape_id
  );
  const { data: celebrityDetails } = useCelebrityData(
    rawAnalysisData?.celebrity_id
  );
  const {
    data: tips,
    isLoading: tipsLoading,
    isError: tipsError,
  } = useAllTips({ analysisData: rawAnalysisData, enabled: !!rawAnalysisData });

  const { mutateAsync: downloadPdf } = useDownloadPdf();

  // Define proper type for download result
  interface DownloadResult {
    data: Blob;
    success?: boolean;
    message?: string;
  }

  // Optimized download dengan progress tracking
  const handleDownloadPDF = useCallback(async () => {
    if (!resultId) return;

    setIsDownloading(true);
    setDownloadProgress(0);
    setError(null);

    try {
      // Simulate progress untuk UX yang lebih baik
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);

      // Pre-cache data jika belum ada
      setDownloadProgress(20);

      // Optimized API call dengan timeout
      const timeoutDuration = connectionQuality === "slow" ? 60000 : 30000;
      const downloadPromise = downloadPdf({ resultId });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Download timeout")), timeoutDuration)
      );

      const result = (await Promise.race([
        downloadPromise,
        timeoutPromise,
      ])) as DownloadResult;

      clearInterval(progressInterval);
      setDownloadProgress(100);

      if (result && result.data) {
        const blob = result.data;

        // Optimized blob handling
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `hasil-analisa-lengkap-${Date.now()}.pdf`;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();

        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      }
    } catch (error) {
      setDownloadProgress(0);
      let errorMessage = "Terjadi kesalahan saat mendownload PDF";

      if (error instanceof Error) {
        if (error.message.includes("timeout")) {
          errorMessage =
            connectionQuality === "slow"
              ? "Download timeout. Silakan coba lagi dengan koneksi yang lebih stabil."
              : "Download timeout. Silakan coba lagi.";
        } else if (
          error.message.includes("network") ||
          error.message.includes("ERR_CONTENT_DECODING_FAILED")
        ) {
          errorMessage =
            "Masalah koneksi atau encoding. Silakan cek internet dan coba lagi.";
        } else if (error.message.includes("Invalid")) {
          errorMessage = "File PDF tidak valid. Silakan coba lagi.";
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);

      // Auto clear error setelah 5 detik
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsDownloading(false);
      setTimeout(() => setDownloadProgress(0), 2000);
    }
  }, [resultId, downloadPdf, connectionQuality]);

  // Preload kritik data untuk mempercepat
  useEffect(() => {
    if (resultId && analysisResult) {
      // Preload semua data yang diperlukan
      Promise.all([
        bodyDetails,
        colorToneDetails,
        faceShapeDetails,
        celebrityDetails,
        tips,
      ]).catch(console.warn);
    }
  }, [
    resultId,
    analysisResult,
    bodyDetails,
    colorToneDetails,
    faceShapeDetails,
    celebrityDetails,
    tips,
  ]);

  const pdfPages: PdfPage[] = useMemo(
    () => [
      { id: "cover", Component: <Cover userData={finalUserData} /> },
      {
        id: "faceShape",
        Component: (
          <FaceShape
            userData={finalUserData}
            userPhotoUrl={userPhotoUrl}
            faceShapeDetails={faceShapeDetails}
          />
        ),
      },
      {
        id: "colorTone",
        Component: (
          <ColorTone
            userData={finalUserData}
            colorToneDetails={colorToneDetails}
          />
        ),
      },
      {
        id: "bodyShape",
        Component: (
          <BodyShape
            userData={finalUserData}
            bodyDetails={bodyDetails}
            bmiCategoryDetails={undefined}
          />
        ),
      },
      {
        id: "celebritiesMatch",
        Component: (
          <CelebritiesMatch
            userData={finalUserData}
            celebrityDetails={celebrityDetails}
          />
        ),
      },
      {
        id: "conclusion",
        Component: (
          <Conclusion
            userData={finalUserData}
            faceTip={tips?.faceTip}
            bodyTip={tips?.bodyTip}
            colorTip={tips?.colorTip}
            isLoading={tipsLoading}
            isError={tipsError}
          />
        ),
      },
      {
        id: "recommendation",
        Component: (
          <ProductRecommendation
            userData={finalUserData}
            resultId={resultId as string}
          />
        ),
      },
      { id: "backCover", Component: <BackCover /> },
    ],
    [
      finalUserData,
      userPhotoUrl,
      faceShapeDetails,
      colorToneDetails,
      bodyDetails,
      celebrityDetails,
      tips,
      tipsLoading,
      tipsError,
      resultId,
    ]
  );

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, pdfPages.length - 1));
  }, [pdfPages.length]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  }, []);

  // Download button dengan state yang lebih baik
  const renderDownloadButton = () => (
    <Button
      onClick={handleDownloadPDF}
      className="bg-[#323232] hover:bg-[#404040] rounded-lg px-6 py-2.5 flex items-center justify-center gap-2 min-w-[140px]"
      disabled={isDownloading}
    >
      {isDownloading ? (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            <span className="text-[#f0f0f0] font-poppins font-bold text-sm">
              {downloadProgress > 0
                ? `${Math.round(downloadProgress)}%`
                : "Memproses..."}
            </span>
          </div>
        </div>
      ) : (
        <>
          <Download className="text-[#f0f0f0] w-4 h-4" />
          <span className="text-[#f0f0f0] font-poppins font-bold text-sm">
            Download PDF
          </span>
        </>
      )}
    </Button>
  );

  return (
    <div className="bg-[#F0F0F0] min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-6">
        <div className="relative bg-[#f0f0f0] rounded-2xl shadow-lg w-full max-w-md lg:max-w-6xl flex flex-col overflow-hidden h-[85vh]">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="icon"
            className="cursor-pointer absolute top-4 left-4 text-gray-500 hover:text-gray-800 z-20 bg-[#f0f0f0]/80 backdrop-blur-sm rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="relative flex-grow overflow-x-auto overflow-y-hidden">
            {isDesktop ? (
              <div className="flex h-full w-max items-center p-8 gap-x-8">
                {pdfPages.map(({ id, Component }) => (
                  <div key={id} className="w-[340px] h-[570px] flex-shrink-0">
                    <div className="transform scale-[0.5] origin-top-left">
                      <div className="w-[680px] h-[1140px] shadow-lg rounded-lg overflow-hidden bg-[#f0f0f0]">
                        {Component}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <div
                  className={`transform ${
                    connectionQuality === "slow"
                      ? "scale-[0.35] sm:scale-[0.4]"
                      : "scale-[0.45] sm:scale-[0.5]"
                  }`}
                >
                  <div className="w-[680px] h-[1140px] shadow-lg rounded-lg overflow-hidden bg-[#f0f0f0]">
                    {pdfPages[currentPage].Component}
                  </div>
                </div>
              </div>
            )}
          </div>

          {isDesktop ? (
            <div className="bg-[#f0f0f0] p-4 flex gap-4 justify-start border-t border-gray-200">
              {renderDownloadButton()}
            </div>
          ) : (
            <div className="bg-[#f0f0f0] p-4 flex justify-between items-center border-t border-gray-200">
              {renderDownloadButton()}

              <div className="flex items-center gap-2">
                <Button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0}
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 disabled:opacity-40"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  onClick={goToNextPage}
                  disabled={currentPage === pdfPages.length - 1}
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 disabled:opacity-40"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced error handling */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-6xl w-full flex items-center justify-between">
            <span>{error}</span>
            <Button
              onClick={() => setError(null)}
              variant="ghost"
              size="sm"
              className="text-red-700 hover:bg-red-200"
            >
              ✕
            </Button>
          </div>
        )}

        {/* Connection quality indicator */}
        {connectionQuality === "slow" && (
          <div className="mt-2 p-2 bg-amber-100 border border-amber-400 text-amber-700 rounded-lg max-w-6xl w-full text-sm">
            ⚠️ Koneksi lambat terdeteksi. Download mungkin membutuhkan waktu
            lebih lama.
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
            <Skeleton className="h-[85vh] w-full max-w-6xl rounded-2xl" />
          </div>
        </div>
      }
    >
      <PreviewPdfPage />
    </Suspense>
  );
}
