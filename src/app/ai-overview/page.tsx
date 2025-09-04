"use client";

import { Navbar } from "@/components/component-landing/navbar";
import { ErrorModal } from "@/components/sections/error-modal";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense } from "react";

import AnalysisTabs from "@/components/sections/AnalysisTabs";
import FeedbackModal from "@/components/sections/feedback-modal";
import ProductRecommendationsSection from "@/components/sections/ProductRecommendationsSection";
import UserProfileSection from "@/components/sections/UserProfileSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalysisData, useGenerateStory } from "@/hooks/useAnalysisData";
import { useProductRecommendations } from "@/hooks/useProductRecommendations";
import { useToast } from "@/hooks/useToast";
import { useUserData } from "@/hooks/useUserData";
import { analysisTabs } from "@/lib/mock-data";
import { UserData } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BodySection from "../../components/sections/BodySection";
import CelebrityMatchSection from "../../components/sections/CelebrityMatchSection";
import ColorToneSection from "../../components/sections/ColorToneSection";
import ShapeSection from "../../components/sections/ShapeSection";
import TipsSection from "../../components/sections/TipsSection";

interface AnalysisData {
  face_shape_id?: string;
  color_analysis_id?: string;
  body_shape_id?: string;
  bmi_category_id?: string;
  celebrity_id?: string;
  analysis_details?: {
    bmi: {
      bmi_value: number;
    };
  };
}
interface AnalysisResult {
  userData: UserData | null;
  userPhotoUrl: string | null;
  rawAnalysisData: AnalysisData | null;
}

function BeautyAnalysisPageInner() {
  const [activeTab, setActiveTab] = useState(0);
  const searchParams = useSearchParams();
  const [visitedTabs, setVisitedTabs] = useState(new Set<string>());
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [storyError, setStoryError] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Custom hooks
  const { userName, userId } = useUserData();
  const { showToast } = useToast();

  // Check authentication
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userToken = localStorage.getItem("userToken");
    const isLoggedIn =
      !!(accessToken && accessToken.trim()) ||
      !!(userToken && userToken.trim());

    setIsAuthChecking(false);

    if (!isLoggedIn) {
      window.location.href = "/register";
      return;
    }
  }, []);

  const resultId = searchParams.get("result_id");

  // Fallback: try to get resultId from localStorage if not in URL
  const fallbackResultId = resultId || localStorage.getItem("analysisResultId");
  const finalResultId = fallbackResultId;

  const {
    data: analysisResult,
    isLoading,
    error,
    isError,
  } = useAnalysisData(finalResultId, {
    onError: (err) => {
      setErrorModalMessage(err.message);
      setIsErrorModalOpen(true);
    },
  });

  const { mutateAsync: generateStory } = useGenerateStory();

  const { userData, userPhotoUrl, rawAnalysisData }: AnalysisResult =
    analysisResult || {
      userData: null,
      userPhotoUrl: null,
      rawAnalysisData: null,
    };

  const {
    sortedProducts,
    topProductScores,
    recommendationFilter,
    handleFilterChange,
  } = useProductRecommendations(
    finalResultId,
    rawAnalysisData?.body_shape_id?.toString(),
    rawAnalysisData?.face_shape_id?.toString()
  );

  const handleDownloadStory = async () => {
    if (!finalResultId) return;
    setIsGeneratingStory(true);
    try {
      setStoryError(null);
      const result = await generateStory(finalResultId);
      if (result.data) {
        const imageData = result.data;
        const file = new File([imageData], `story-tiebymin-${Date.now()}.png`, {
          type: "image/png",
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "Tie By Min Story",
              text: "Coba AI Fashion Analysis aku!",
            });
            showToast("Story berhasil dibagikan!", "success");
          } catch (shareError) {
            const url = URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = url;
            link.download = file.name;
            link.click();
            URL.revokeObjectURL(url);
            showToast("Story berhasil diunduh!", "success");
          }
        } else {
          const url = URL.createObjectURL(file);
          const link = document.createElement("a");
          link.href = url;
          link.download = file.name;
          link.click();
          URL.revokeObjectURL(url);
          showToast("Story berhasil diunduh!", "success");
        }
      } else {
        throw new Error("No story data received");
      }
    } catch (error) {
      setStoryError("Gagal membuat story");
      showToast("Gagal membuat story", "error");
    } finally {
      setIsGeneratingStory(false);
    }
  };

  useEffect(() => {
    if (activeTab !== null) {
      const currentTabId = analysisTabs[activeTab]?.id;
      if (currentTabId) {
        setVisitedTabs((prev) => new Set(prev).add(currentTabId));
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const feedbackSubmitted = localStorage.getItem("feedbackSubmitted");
    const feedbackDismissed = localStorage.getItem("feedbackDismissed");
    if (
      visitedTabs.size === analysisTabs.length &&
      !feedbackSubmitted &&
      !feedbackDismissed
    ) {
      setFeedbackModalOpen(true);
    }
  }, [visitedTabs]);

  useEffect(() => {
    const feedbackDismissed = localStorage.getItem("feedbackDismissed");
    if (feedbackDismissed === "true") {
      setFeedbackModalOpen(false);
    }
  }, []);

  useEffect(() => {
    setIsLockedModalOpen(false);
  }, [resultId, isLoading, error, userData, userPhotoUrl, rawAnalysisData]);

  // Clear localStorage data after successful loading
  useEffect(() => {
    if (!isLoading && !isError && userData && resultId) {
      // Clear analysis-related data after successful load
      const clearDataTimer = setTimeout(() => {
        localStorage.removeItem("tiebymin-analysis-data");
        localStorage.removeItem("uploadedFaceImage");
        localStorage.removeItem("capturedImage");
        localStorage.removeItem("registration-steps-progress");
        localStorage.removeItem("registration-current-step");
      }, 2000); // Clear after 2 seconds to ensure data is fully loaded

      return () => clearTimeout(clearDataTimer);
    }
  }, [isLoading, isError, userData, resultId]);

  const renderContent = (tabId: string) => {
    const analysisData = rawAnalysisData;
    if (!analysisData) return null;

    const content = (() => {
      switch (tabId) {
        case "shape":
          return (
            <ShapeSection
              shapeId={analysisData.face_shape_id?.toString() || "1"}
            />
          );
        case "color":
          return (
            <ColorToneSection
              colorAnalysisId={
                analysisData.color_analysis_id?.toString() || "1"
              }
            />
          );
        case "body":
          return (
            <BodySection
              bodyShapeId={analysisData.body_shape_id?.toString() || "1"}
              bmiCategoryId={analysisData.bmi_category_id?.toString() || "1"}
              bmiResult={{
                value: analysisData.analysis_details?.bmi?.bmi_value || 0,
              }}
            />
          );
        case "celebrity":
          return (
            <CelebrityMatchSection
              celebrityId={
                analysisData.celebrity_id
                  ? analysisData.celebrity_id.toString()
                  : null
              }
            />
          );
        case "tips":
          return (
            <TipsSection
              analysisData={{
                ...analysisData,
                face_shape_id: analysisData.face_shape_id?.toString() || "1",
                color_analysis_id:
                  analysisData.color_analysis_id?.toString() || "1",
                body_shape_id: analysisData.body_shape_id?.toString() || "1",
                bmi_category_id:
                  analysisData.bmi_category_id?.toString() || "1",
              }}
            />
          );
        default:
          return (
            <ShapeSection
              shapeId={analysisData.face_shape_id?.toString() || "1"}
            />
          );
      }
    })();

    return content;
  };

  // Show loading while checking authentication
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#323232]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] min-w-full w-full bg-repeat">
      <Navbar />

      <main className="xl:container xl:mx-auto w-full py-8 lg:py-4 pt-[80px] px-[20px]">
        <div className="flex flex-col md:flex-col xl:flex-row justify-between w-full mb-3 md:mb-6 lg:mb-10 gap-3 md:gap-6 xl:gap-[50px] mt-3 md:mt-6 lg:mt-[100px] xl:mt-[160px]">
          <UserProfileSection
            userName={userName}
            userPhotoUrl={userPhotoUrl}
            resultId={finalResultId}
            onDownloadStory={handleDownloadStory}
            isGeneratingStory={isGeneratingStory}
          />

          <div className="w-full">
            <AnalysisTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-[16px] lg:mt-[50px] relative overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab}
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.3,
                  }}
                  className="w-full"
                >
                  {renderContent(analysisTabs[activeTab].id)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <ProductRecommendationsSection
          sortedProducts={sortedProducts}
          topProductScores={topProductScores}
          recommendationFilter={recommendationFilter}
          onFilterChange={handleFilterChange}
        />
      </main>
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        userId={userId}
        analysisResultId={finalResultId || ""}
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        errorMessage={errorModalMessage}
      />
    </div>
  );
}

export default function BeautyAnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 p-8">
          <Skeleton className="h-16 w-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-[700px] w-full rounded-3xl" />
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      }
    >
      <BeautyAnalysisPageInner />
    </Suspense>
  );
}
