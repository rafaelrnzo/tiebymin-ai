"use client";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, X } from "lucide-react";
import { Navbar } from "@/components/component-landing/navbar";
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
  useColorToneData,
  useFaceShapeData,
  useCelebrityData,
  useDownloadPdf,
} from "@/hooks/useAnalysisData";
import { useAllTips } from "@/hooks/useAllTips";
import { defaultUserData } from "@/lib/mock-data";

interface PdfPage {
  id: string;
  Component: React.ReactElement;
}

function PreviewPdfPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result_id");

  const { data: analysisResult } = useAnalysisData(resultId);
  const {
    userData = defaultUserData,
    userPhotoUrl,
    rawAnalysisData,
  } = analysisResult || {};

  const finalUserData = useMemo(() => {
    if (!analysisResult?.userData) {
      return defaultUserData;
    }

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
  } = useAllTips({
    analysisData: rawAnalysisData,
    enabled: !!rawAnalysisData,
  });

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

  const pdfPages: PdfPage[] = [
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
        <BodyShape userData={finalUserData} bodyDetails={bodyDetails} />
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
    { id: "backCover", Component: <BackCover /> },
  ];

  return (
    <div className="bg-[#F0F0F0] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-6">
        <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-6xl flex flex-col overflow-hidden h-[85vh]">
          <X
            onClick={() => router.back()}
            className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-20"
          />

          <div className="flex-grow overflow-x-auto overflow-y-hidden">
            <div className="flex h-full w-max items-center">
              {pdfPages.map(({ id, Component }) => (
                <div key={id} className="flex-shrink-0">
                  <div className="transform origin-center scale-[0.4] -mx-28 sm:scale-50 sm:-mx-24 md:scale-75 md:-mx-14">
                    <div className="w-[680px] h-screen shadow-lg rounded-lg overflow-hidden bg-white">
                      {Component}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- DOWNLOAD BUTTON --- */}
          <div className="bg-white p-4 flex justify-start border-t border-gray-200">
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
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-6xl w-full">
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
            <Skeleton className="h-[85vh] w-full max-w-6xl rounded-2xl" />
          </div>
        </div>
      }
    >
      <PreviewPdfPage />
    </Suspense>
  );
}
