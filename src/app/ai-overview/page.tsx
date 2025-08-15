"use client";

import { Navbar } from "@/components/component-landing/navbar";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { FeedbackModal } from "@/components/sections/feedback-modal";
import { useMutation } from "@tanstack/react-query";
import { postFeedback } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalysisData } from "@/hooks/useAnalysisData";
import { useRecommendations } from "@/hooks/useRecommendations";
import { analysisTabs } from "@/lib/mock-data";
import { useRouter, useSearchParams } from "next/navigation";
import BodySection from "../../components/sections/BodySection";
import CelebrityMatchSection from "../../components/sections/CelebrityMatchSection";
import ColorToneSection from "../../components/sections/ColorToneSection";
import ShapeSection from "../../components/sections/ShapeSection";
import TipsSection from "../../components/sections/TipsSection";
import { Grid2x2, Shirt, UserStar } from "lucide-react";

function BeautyAnalysisPageInner() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("shape");
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState("");
  const [recommendationPage, setRecommendationPage] = useState(1);
  const [recommendationFilter, setRecommendationFilter] = useState<
    "all" | "hijab" | "clothes"
  >("all");
  const [visitedTabs, setVisitedTabs] = useState(new Set<string>());
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const handleFilterChange = (filter: "all" | "hijab" | "clothes") => {
    setRecommendationFilter(filter);
  };

  const feedbackMutation = useMutation({
    mutationFn: postFeedback,
    onSuccess: () => {
      localStorage.setItem("feedbackSubmitted", "true");
      setFeedbackModalOpen(false);
    },
    onError: (error) => {
      console.error("Failed to submit feedback:", error);
    },
  });

  const handleFeedbackSubmit = (
    rating: number,
    feedback: string,
    dontShowAgain: boolean
  ) => {
    if (dontShowAgain) {
      localStorage.setItem("feedbackDismissed", "true");
      setFeedbackModalOpen(false);
      return;
    }
    if (resultId) {
      feedbackMutation.mutate({ resultId, rating, feedback });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("firstName");
      if (storedName) {
        setUserName(storedName);
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab) {
      setVisitedTabs((prev) => new Set(prev).add(activeTab));
    }
  }, [activeTab]);

  useEffect(() => {
    const feedbackSubmitted = localStorage.getItem("feedbackSubmitted");
    const feedbackDismissed = localStorage.getItem("feedbackDismissed");
    if (visitedTabs.size === analysisTabs.length && !feedbackSubmitted && !feedbackDismissed) {
      setFeedbackModalOpen(true);
    }
  }, [visitedTabs]);

  const resultId = searchParams.get("result_id");
  console.log("🔍 Current resultId:", resultId); // Debug log

  const {
    data: analysisResult,
    isLoading,
    error,
    isError,
  } = useAnalysisData(resultId);

  const { data: recommendationsData } = useRecommendations(resultId);

  console.log("📊 Analysis result:", analysisResult); // Debug log
  console.log("⏳ Is loading:", isLoading); // Debug log
  console.log("❌ Error:", error); // Debug log

  const { userData, userPhotoUrl, rawAnalysisData } = analysisResult || {
    userData: null,
    userPhotoUrl: null,
    rawAnalysisData: null,
  };

  useEffect(() => {
    console.log("🔄 Component state updated:", {
      resultId,
      isLoading,
      error,
      userData,
      userPhotoUrl,
      rawAnalysisData,
    });
  }, [resultId, isLoading, error, userData, userPhotoUrl, rawAnalysisData]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      );
    }

    if (isError || error) {
      return (
        <div className="text-center p-8 text-red-500">
          <p className="mb-2">
            ⚠️ {error?.message || "An error occurred while loading data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-500 underline"
          >
            Try again
          </button>
        </div>
      );
    }

    if (!userData && !rawAnalysisData) {
      return (
        <div className="text-center p-8">
          <p>No analysis data found.</p>
          <button
            onClick={() => router.push("/ai-overview")}
            className="text-blue-500 underline mt-2"
          >
            Go back
          </button>
        </div>
      );
    }

    // Gunakan rawAnalysisData untuk renderContent karena itu yang berisi ID asli
    const analysisData = rawAnalysisData;

    switch (activeTab) {
      case "shape":
        return (
          <ShapeSection
            shapeId={analysisData?.face_shape_id?.toString() || "1"}
          />
        );

      case "color":
        return (
          <ColorToneSection
            colorAnalysisId={analysisData?.color_analysis_id?.toString() || "1"}
          />
        );

      case "body":
        return (
          <BodySection
            bodyShapeId={analysisData?.body_shape_id?.toString() || "1"}
            bmiCategoryId={analysisData?.bmi_category_id?.toString() || "1"}
            bmiResult={{
              value: analysisData?.analysis_details?.bmi?.value || 0,
            }}
          />
        );

      case "celebrity":
        return (
          <CelebrityMatchSection
            celebrityId={
              analysisData?.celebrity_id
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
              face_shape_id: analysisData?.face_shape_id?.toString() || "1",
              color_analysis_id:
                analysisData?.color_analysis_id?.toString() || "1",
              body_shape_id: analysisData?.body_shape_id?.toString() || "1",
              bmi_category_id: analysisData?.bmi_category_id?.toString() || "1",
            }}
          />
        );

      default:
        return (
          <ShapeSection
            shapeId={analysisData?.face_shape_id?.toString() || "1"}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 bg-[url('/bg-pattern.png')] bg-repeat">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row justify-between w-full gap-6 sm:gap-8 mb-10 sm:mb-16">
          <div className="bg-[#2D2D2D] h-[700px] w-full lg:w-[35%] rounded-3xl p-5 sm:p-8 text-white flex flex-col">
            <div className="mb-4 sm:mb-6">
              {userPhotoUrl ? (
                <Image
                  src={userPhotoUrl}
                  alt="Analysis Result"
                  width={450}
                  height={280}
                  className="h-[250px] w-[450px] object-cover rounded-xl"
                  onError={(e) => {
                    console.warn("🖼️ Image load error:", userPhotoUrl);
                    e.currentTarget.src = "/overview-ai/person.png";
                  }}
                  loading="lazy"
                />
              ) : (
                <div className="h-[250px] bg-gray-200 rounded-xl flex items-center justify-center animate-pulse">
                  <Image
                    src="/overview-ai/skeleton.png"
                    alt="Loading Sk eleton"
                    width={120}
                    height={120}
                    className="opacity-70"
                  />
                </div>
              )}
            </div>
            <h2 className="text-4xl font-bold mb-3 sm:mb-4 font-handlee text-[#F8B4C4] italic">
              Hi {userName}, Ini Dia
              <br />
              Hasil Analisa Kamu
            </h2>
            <p className="text-gray-300 text-lg mb-6 sm:mb-8 leading-relaxed font-poppins">
              Dapatkan insight mendalam tentang fashion terbaik untuk kamu
              dengan teknologi AI kami dengan rekomendasi personal yang akurat.
            </p>
            <div className="mt-auto mb-2 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                onClick={() =>
                  router.push(`/ai-overview/story?result_id=${resultId}`)
                }
                disabled={!resultId}
                className="bg-white text-xs sm:text-sm text-[#2D2D2D] px-4 sm:px-6 py-2 rounded-full flex items-center justify-center gap-1 not-last:transition hover:bg-gray-200 disabled:opacity-50"
              >
                <Image
                  src="/overview-ai/icons/material-symbols_share.svg"
                  width={16}
                  height={16}
                  alt="Bagikan Hasil"
                  loading="lazy"
                />
                <span>Bagikan Hasil</span>
              </Button>
              <Button
                onClick={() =>
                  router.push(`/ai-overview/pdf/preview?result_id=${resultId}`)
                }
                disabled={!resultId}
                className="bg-[#FFC6C6] text-black px-4 sm:px-6 py-2 rounded-full flex items-center justify-center gap-1 hover:bg-pink-600 transition disabled:bg-gray-400 text-xs sm:text-sm"
              >
                <Image
                  src="/overview-ai/icons/ic_round-download.svg"
                  width={16}
                  height={16}
                  alt="Unduh Hasil"
                  loading="lazy"
                />
                <span>Unduh Hasil</span>
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-[70%]">
            <div className="flex flex-wrap border-b border-gray-300">
              {analysisTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[120px] sm:min-w-0 flex items-center justify-center gap-2 py-2 sm:py-3 text-xs sm:text-sm font-poppins transition-all -mb-px ${
                    activeTab === tab.id
                      ? "text-black font-bold border-b-2 border-[#000000]"
                      : "text-gray-500 hover:text-black"
                  }`}
                  style={{
                    borderBottom:
                      activeTab === tab.id ? "2px solid black" : "none",
                  }}
                >
                  <Image
                    src={tab.icon || "/placeholder.svg"}
                    width={18}
                    height={18}
                    alt={tab.text}
                    className={`${
                      activeTab !== tab.id ? "opacity-60" : ""
                    } w-5 h-5`}
                  />
                  <span className="truncate">{tab.text}</span>
                </button>
              ))}
            </div>

            <div className="mt-6">{renderContent()}</div>
          </div>
        </div>

        <section>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
            <h1 className="text-4xl lg:text-5xl font-oswald font-bold text-[#333333]">
              Rekomendasi Produk
            </h1>
            <div className="flex items-center gap-2 self-start md:self-center">
              <button
                onClick={() => handleFilterChange("all")}
                className={`flex items-center justify-center gap-2.5 rounded-full px-5 py-3 font-bold text-base transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  recommendationFilter === "all"
                    ? "bg-gray-800 text-white shadow-lg"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <Grid2x2 />
                Semua
              </button>
              <button
                onClick={() => handleFilterChange("hijab")}
                className={`flex items-center justify-center gap-2.5 rounded-full px-5 py-3 font-bold text-base transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  recommendationFilter === "hijab"
                    ? "bg-gray-800 text-white shadow-lg"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <UserStar />
                Hijab
              </button>
              <button
                onClick={() => handleFilterChange("clothes")}
                className={`flex items-center justify-center gap-2.5 rounded-full px-5 py-3 font-bold text-base transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  recommendationFilter === "clothes"
                    ? "bg-gray-800 text-white shadow-lg"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <Shirt />
                Pakaian
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {recommendationsData &&
                [
                  ...(recommendationFilter === "all" ||
                  recommendationFilter === "hijab"
                    ? recommendationsData.hijab
                    : []),
                  ...(recommendationFilter === "all" ||
                  recommendationFilter === "clothes"
                    ? recommendationsData.clothes
                    : []),
                ]
                  .slice((recommendationPage - 1) * 3, recommendationPage * 3)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative p-2">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-72 object-cover rounded-xl"
                        />
                        <span className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                          <Image
                            src={"/overview-ai/icons/ai-generate.svg"}
                            width={14}
                            height={14}
                            alt="Match"
                            className="object-cover"
                          />
                          {`${product.total_compatibility_score * 10}% Match`}
                        </span>
                        <span className="absolute bottom-4 right-4 bg-white text-black px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                          <Image
                            src={
                              "/overview-ai/icons/material-symbols_star-rounded.svg"
                            }
                            width={16}
                            height={16}
                            alt="Star"
                            className="object-cover"
                          />
                          {product.average_rating}
                        </span>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-bold text-gray-800 text-lg">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline my-2">
                          <span className="text-gray-800 font-extrabold text-2xl">
                            {`Rp${product.current_price.toLocaleString(
                              "id-ID"
                            )}`}
                          </span>
                          {product.original_price > 0 && (
                            <span className="text-gray-400 text-sm ml-2 line-through">
                              {`Rp${product.original_price.toLocaleString(
                                "id-ID"
                              )}`}
                            </span>
                          )}
                        </div>
                        <div className="mb-4">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                            <div className="flex flex-col items-start">
                              <span className="text-xs sm:text-sm text-gray-600 mr-1">
                                Ukuran:
                              </span>
                              <span className="text-xs sm:text-sm font-medium mt-2">
                                {product.size_range}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() =>
                            window.open(product.product_link, "_blank")
                          }
                          className="mt-auto bg-[#ED80A7] w-full py-3 px-4 font-bold rounded-lg text-white flex items-center justify-center gap-3 text-base hover:bg-pink-500 transition-colors"
                        >
                          Beli Sekarang
                          <Image
                            src="/overview-ai/icons/mynaui_cart-solid.svg"
                            width={20}
                            height={20}
                            alt="Shopping Cart"
                          />
                        </Button>
                      </div>
                    </div>
                  ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button
                onClick={() =>
                  setRecommendationPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={recommendationPage === 1}
              >
                Previous
              </Button>
              <span className="mx-4 self-center font-medium">
                Page {recommendationPage}
              </span>
              <Button
                onClick={() => setRecommendationPage((prev) => prev + 1)}
                disabled={
                  !recommendationsData ||
                  recommendationPage * 3 >=
                    (recommendationFilter === "all" ||
                    recommendationFilter === "hijab"
                      ? recommendationsData.hijab.length
                      : 0) +
                      (recommendationFilter === "all" ||
                      recommendationFilter === "clothes"
                        ? recommendationsData.clothes.length
                        : 0)
                }
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      </main>
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
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
