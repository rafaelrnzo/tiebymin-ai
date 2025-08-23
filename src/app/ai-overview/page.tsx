"use client";

import { Navbar } from "@/components/component-landing/navbar";
import { ErrorModal } from "@/components/sections/error-modal";
import { FeedbackModal } from "@/components/sections/feedback-modal";
import { motion } from "framer-motion";
import Image from "next/image";
import { Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAnalysisData, useGenerateStory } from "@/hooks/useAnalysisData";
import { useRecommendations } from "@/hooks/useRecommendations";
import { analysisTabs } from "@/lib/mock-data";
import {
  Shirt,
  ShoppingCart,
  Star,
  ThumbsUp,
  UserStar,
  Lock,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import BodySection from "../../components/sections/BodySection";
import CelebrityMatchSection from "../../components/sections/CelebrityMatchSection";
import ColorToneSection from "../../components/sections/ColorToneSection";
import ShapeSection from "../../components/sections/ShapeSection";
import TipsSection from "../../components/sections/TipsSection";

function BeautyAnalysisPageInner() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState("");
  const [recommendationPage, setRecommendationPage] = useState(1);
  const [userId, setUserId] = useState("");
  const [recommendationFilter, setRecommendationFilter] = useState<
    "hijab" | "clothes"
  >("hijab");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [visitedTabs, setVisitedTabs] = useState(new Set<string>());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
  const [topProductScores, setTopProductScores] = useState<Map<string, number>>(
    new Map()
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [storyError, setStoryError] = useState<string | null>(null);

  const handleFilterChange = (filter: "hijab" | "clothes") => {
    setRecommendationFilter(filter);
    setRecommendationPage(1); // Reset to first page when filter changes
  };

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
    setIsGeneratingStory(true);
    try {
      setStoryError(null);
      const result = await generateStory();
      if (result.data) {
        const file = new File(
          [result.data],
          `story-tiebymin-${Date.now()}.png`,
          { type: "image/png" }
        );

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "Tie By Min Story",
              text: "Coba AI Fashion Analysis aku!",
            });
            showToast("Story berhasil dibagikan!", "success");
          } catch (shareError) {
            console.warn("Share failed, falling back to download:", shareError);
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
      }
    } catch (error) {
      console.error("Error generating story:", error);
      setStoryError("Gagal membuat story");
      showToast("Gagal membuat story", "error");
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && recommendationPage < totalPages && !isAnimating) {
      setIsAnimating(true);
      setRecommendationPage(recommendationPage + 1);
      setTimeout(() => setIsAnimating(false), 300);
    }

    if (isRightSwipe && recommendationPage > 1 && !isAnimating) {
      setIsAnimating(true);
      setRecommendationPage(recommendationPage - 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("firstName");
      const storedId = localStorage.getItem("userId");
      if (storedName) {
        setUserName(storedName);
      }
      if (storedId) {
        setUserId(storedId);
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab !== null) {
      const currentTabId = analysisTabs[activeTab]?.id;
      if (currentTabId) {
        setVisitedTabs((prev) => new Set(prev).add(currentTabId));
      }
    }
  }, [activeTab]);

  useEffect(() => {
    setCurrentCardIndex(recommendationPage - 1);
  }, [recommendationPage]);

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

  const resultId = searchParams.get("result_id");
  // console.log("🔍 Current resultId:", resultId); // Debug log

  const {
    data: analysisResult,
    isLoading,
    error,
    isError,
  } = useAnalysisData(resultId, {
    onError: (err) => {
      setErrorModalMessage(err.message);
      setIsErrorModalOpen(true);
    },
  });

  const { data: recommendationsData } = useRecommendations(resultId);
  const { refetch: generateStory } = useGenerateStory();

  const { userData, userPhotoUrl, rawAnalysisData } = analysisResult || {
    userData: null,
    userPhotoUrl: null,
    rawAnalysisData: null,
  };

  useEffect(() => {
    // console.log("🔄 Component state updated:", {
    //   resultId,
    //   isLoading,
    //   error,
    //   userData,
    //   userPhotoUrl,
    //   rawAnalysisData,
    // });

    // Show locked modal if resultId exists but no analysis data is available
    if (resultId && !isLoading && !userData && !error) {
      setIsLockedModalOpen(true);
    } else {
      setIsLockedModalOpen(false);
    }
  }, [resultId, isLoading, error, userData, userPhotoUrl, rawAnalysisData]);

  const filteredProducts = recommendationsData
    ? recommendationFilter === "hijab"
      ? recommendationsData.hijab
      : recommendationsData.clothes
    : [];
  const totalPages = filteredProducts.length;

  const sortedProducts = [...filteredProducts].sort(
    (a, b) => b.total_compatibility_score - a.total_compatibility_score
  );

  useEffect(() => {
    if (sortedProducts.length > 0) {
      const possibleScores = [90, 91, 92, 93, 94, 95];

      for (let i = possibleScores.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [possibleScores[i], possibleScores[j]] = [
          possibleScores[j],
          possibleScores[i],
        ];
      }

      const newScores = new Map<string, number>();
      const topThree = sortedProducts.slice(0, 3);

      topThree.forEach((product, index) => {
        if (possibleScores[index] !== undefined) {
          newScores.set(product.id, possibleScores[index]);
        }
      });

      setTopProductScores(newScores);
    }
  }, [recommendationsData]);

  const currentProduct = sortedProducts[recommendationPage - 1];

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
                value: analysisData.analysis_details?.bmi?.value || 0,
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

  return (
    <div className="min-h-screen bg-[#f0f0f0] min-w-full w-full bg-repeat">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-4">
        <div className="flex flex-col lg:flex-row justify-between w-full mb-3 md:mb-6 lg:mb-10 gap-3 md:gap-6 lg:gap-[50px] mt-3 md:mt-6 lg:mt-[50px]">
          <div className="bg-[#2D2D2D] h-fit lg:h-[700px] w-full lg:w-[35%] rounded-3xl p-5 text-white flex flex-col">
            <div className="mb-4 sm:mb-6">
              {userPhotoUrl ? (
                <Image
                  src={userPhotoUrl}
                  alt="Analysis Result"
                  width={450}
                  height={280}
                  className="h-[200px] sm:h-[250px] lg:w-[450px] w-full object-cover rounded-xl"
                  loading="lazy"
                />
              ) : (
                <div className="h-[200px] sm:h-[250px] bg-gray-200 rounded-xl flex items-center justify-center animate-pulse"></div>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 font-handlee text-[#FFC6C6] italic leading-tight">
              Hi {userName}, Ini Dia
              <br />
              Hasil Analisa Kamu
            </h2>
            <p className="text-[#f0f0f0] text-sm sm:text-base lg:text-xl mb-4 sm:mb-8 leading-relaxed font-poppins">
              Dapatkan insight mendalam tentang fashion terbaik untuk kamu
              dengan teknologi AI kami dengan rekomendasi personal yang akurat.
            </p>
            <div className="mb-2 grid grid-cols-2 gap-2 sm:gap-4 justify-center">
              <Button
                onClick={handleDownloadStory}
                disabled={!resultId || isGeneratingStory}
                className="bg-white text-xs sm:text-sm text-[#2D2D2D] px-4 sm:px-6 py-2 rounded-full flex items-center justify-center gap-1 not-last:transition hover:bg-gray-200 disabled:opacity-50"
              >
                <Image
                  src="/overview-ai/icons/material-symbols_share.svg"
                  width={16}
                  height={16}
                  alt="Bagikan Hasil"
                  loading="lazy"
                />
                <span>Share ke Instagram</span>
              </Button>
              <Button
                onClick={() =>
                  router.push(`/ai-overview/pdf/preview?result_id=${resultId}`)
                }
                disabled={!resultId}
                className="bg-[#FFC6C6] text-[#323232] px-3 sm:px-6 py-2 rounded-full flex items-center justify-center gap-1 hover:bg-pink-600 transition disabled:bg-gray-400 text-xs sm:text-sm"
              >
                <Image
                  src="/overview-ai/icons/ic_round-download.svg"
                  width={16}
                  height={16}
                  alt="Unduh Hasil"
                  loading="lazy"
                />
                <span className="text-xs sm:text-sm">Download Analisa</span>
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-[70%]">
            <div className="flex border-b border-gray-300">
              {analysisTabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 min-w-[70px] lg:min-w-[120px] sm:min-w-0 flex flex-col lg:flex-row items-center justify-center gap-2 py-2 sm:py-3 text-xs sm:text-base font-poppins transition-all -mb-px ${
                    activeTab === index
                      ? "text-[#323232] font-bold border-b-2 border-[#000000]"
                      : "text-gray-500 hover:text-[#323232]"
                  }`}
                  style={{
                    borderBottom:
                      activeTab === index ? "2px solid black" : "none",
                  }}
                >
                  <Image
                    src={tab.icon || "/placeholder.svg"}
                    width={18}
                    height={18}
                    alt={tab.text}
                    className={`${
                      activeTab !== index ? "opacity-60" : ""
                    } w-5 h-5`}
                  />
                  <span className="flex flex-col lg:flex lg:whitespace-normal whitespace-pre-line text-xs sm:text-sm">
                    {tab.text}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-[16px] lg:mt-[50px] relative">
              {analysisTabs.map((tab, index) => (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeTab === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    transition-all duration-300
                    ${
                      activeTab !== index
                        ? "absolute top-0 left-0 w-full pointer-events-none"
                        : "relative"
                    }
                  `}
                >
                  {renderContent(tab.id)}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <section className="pt-8 lg:pt-16">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-4 lg:mb-10">
            <hr className="border-t-2 border-black w-full lg:hidden block" />
            <h1 className="text-xl sm:text-2xl lg:text-5xl font-oswald font-bold text-[#333333] mb-2 sm:mb-4 lg:mb-[25px]">
              Rekomendasi Produk
            </h1>
            <div className="flex justify-center items-center gap-2 self-start md:self-center overflow-x-auto scrollbar-hide">
              <div className=" flex justify-center gap-2 sm:gap-3 min-w-max">
                <button
                  onClick={() => handleFilterChange("hijab")}
                  className={`flex items-center justify-center gap-2.5 rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-all duration-300 ease-in-out transform hover:scale-105 whitespace-nowrap ${
                    recommendationFilter === "hijab"
                      ? "bg-gray-800 text-white shadow-lg"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <span className="font-poppins font-bold text-sm sm:text-base">
                    Hijab
                  </span>
                  <UserStar className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => handleFilterChange("clothes")}
                  className={`flex items-center justify-center gap-2.5 rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-all duration-300 ease-in-out transform hover:scale-105 whitespace-nowrap ${
                    recommendationFilter === "clothes"
                      ? "bg-gray-800 text-white shadow-lg"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <span className="font-poppins font-bold text-sm sm:text-base">
                    Pakaian
                  </span>
                  <Shirt className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            {filteredProducts.length > 0 ? (
              <>
                {/* Mobile Carousel - Single Card */}
                <div className="lg:hidden">
                  <div
                    ref={scrollContainerRef}
                    className="flex justify-center"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {currentProduct && (
                      <motion.div
                        key={currentProduct.id}
                        initial={{ opacity: 0, x: 300, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -300, scale: 0.9 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                          duration: 0.4,
                        }}
                        className={`bg-white border rounded-2xl overflow-hidden flex flex-col transition-shadow duration-300 h-fit sm:h-[620px] w-full flex-shrink-0 mx-auto cursor-grab active:cursor-grabbing select-none border-[#323232]`}
                      >
                        <div className="relative p-2">
                          <Image
                            src={currentProduct.images[0]}
                            alt={currentProduct.name}
                            width={400}
                            height={400}
                            className="w-full h-44 sm:h-72 object-cover rounded-xl"
                          />
                          <span className="absolute bottom-4 left-4 bg-[#323232] bg-opacity-70 text-white px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2">
                            {topProductScores.has(currentProduct.id)
                              ? `${topProductScores.get(
                                  currentProduct.id
                                )}% Match`
                              : `${
                                  currentProduct.total_compatibility_score * 10
                                }% Match`}
                          </span>
                          <span className="absolute bottom-4 right-4 bg-white text-[#323232] px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            {currentProduct.average_rating}
                          </span>
                        </div>
                        <div className="p-3 sm:p-5 flex flex-col flex-grow">
                          <div className="flex items-start justify-between gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <h3 className="font-bold text-gray-800 text-base sm:text-lg text-left truncate">
                                    {currentProduct.name
                                      .split(" ")
                                      .slice(0, 3)
                                      .join(" ") + "..."}
                                  </h3>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{currentProduct.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {sortedProducts.findIndex(
                              (p) => p.id === currentProduct.id
                            ) < 3 && (
                              <div className="flex items-center gap-1 text-pink-500 flex-shrink-0">
                                <ThumbsUp className="w-4 h-4" />
                                <span className="font-semibold text-xs">
                                  Rekomendasi
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-baseline my-1 sm:my-2">
                            <span className="text-gray-800 font-extrabold text-lg sm:text-2xl">
                              {`Rp${currentProduct.current_price.toLocaleString(
                                "id-ID"
                              )}`}
                            </span>
                            {currentProduct.original_price > 0 && (
                              <span className="text-gray-400 text-xs sm:text-sm ml-2 line-through">
                                {`Rp${currentProduct.original_price.toLocaleString(
                                  "id-ID"
                                )}`}
                              </span>
                            )}
                          </div>
                          <div className="flex items-start justify-between gap-2 sm:gap-4 my-2 sm:my-4">
                            {/* Color Recommendations */}
                            <div className="flex flex-col gap-1 sm:gap-2">
                              <span className="text-xs sm:text-sm text-gray-600">
                                Rekomendasi Warna
                              </span>
                              <div className="flex flex-wrap gap-1 sm:gap-2">
                                {currentProduct.color_recommendations?.map(
                                  (color, index) => (
                                    <div
                                      key={index}
                                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-200"
                                      style={{ backgroundColor: color }}
                                      title={color}
                                    />
                                  )
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 sm:gap-2">
                              <span className="text-xs sm:text-sm text-gray-600">
                                Ukuran
                              </span>
                              <span className="text-xs sm:text-sm font-medium text-right">
                                {currentProduct.size_range}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col border rounded-xl p-2 sm:p-4">
                            <p className="text-xs sm:text-sm">Kenapa Cocok</p>
                          </div>

                          <Button
                            onClick={() =>
                              window.open(currentProduct.product_link, "_blank")
                            }
                            className="shadow-md flex justify-between mt-3 bg-[#ED80A7] w-full px-4 sm:px-7 py-3 sm:py-5 font-bold rounded-lg text-white items-center gap-2 sm:gap-3 text-sm sm:text-base hover:bg-pink-500 transition-colors"
                          >
                            <span>Beli Sekarang</span>
                            <ShoppingCart
                              fill="white"
                              className="w-4 h-4 sm:w-5 sm:h-5"
                            />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Desktop Grid Layout - All Cards */}
                <div className="hidden lg:block">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`bg-white border rounded-2xl overflow-hidden flex flex-col transition-shadow duration-300 h-[620px] w-full border-[#323232]`}
                      >
                        <div className="relative p-2">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="w-full h-72 object-cover rounded-xl"
                          />
                          <span className="absolute bottom-4 left-4 bg-[#323232] bg-opacity-70 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                            {topProductScores.has(product.id)
                              ? `${topProductScores.get(product.id)}% Match`
                              : `${
                                  product.total_compatibility_score * 10
                                }% Match`}
                          </span>
                          <span className="absolute bottom-4 right-4 bg-white text-[#323232] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            {product.average_rating}
                          </span>
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <div className="flex items-start justify-between gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <h3 className="font-bold text-gray-800 text-lg text-left truncate">
                                    {product.name
                                      .split(" ")
                                      .slice(0, 3)
                                      .join(" ") + "..."}
                                  </h3>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{product.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {sortedProducts.findIndex(
                              (p) => p.id === product.id
                            ) < 3 && (
                              <div className="flex items-center gap-1 text-pink-500 flex-shrink-0">
                                <ThumbsUp className="w-4 h-4" />
                                <span className="font-semibold text-xs">
                                  Rekomendasi
                                </span>
                              </div>
                            )}
                          </div>

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
                          <div className="flex items-start justify-between gap-4 my-4">
                            {/* Color Recommendations */}
                            <div className="flex flex-col gap-2">
                              <span className="text-xs sm:text-sm text-gray-600">
                                Rekomendasi Warna
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {product.color_recommendations?.map(
                                  (color, index) => (
                                    <div
                                      key={index}
                                      className="w-6 h-6 rounded-full border border-gray-200"
                                      style={{ backgroundColor: color }}
                                      title={color}
                                    />
                                  )
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-xs sm:text-sm text-gray-600">
                                Ukuran
                              </span>
                              <span className="text-xs sm:text-sm font-medium text-right">
                                {product.size_range}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col border rounded-xl p-4">
                            <p>Kenapa Cocok</p>
                          </div>

                          <Button
                            onClick={() =>
                              window.open(product.product_link, "_blank")
                            }
                            className="shadow-md flex justify-between mt-auto bg-[#ED80A7] w-full px-7 py-5 font-bold rounded-lg text-white items-center gap-3 text-base hover:bg-pink-500 transition-colors"
                          >
                            <span>Beli Sekarang</span>
                            <ShoppingCart fill="white" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Circular indicators for mobile cards */}
                <div className="flex justify-center items-center mt-4 space-x-2 lg:hidden">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isAnimating) {
                          setIsAnimating(true);
                          setRecommendationPage(index + 1);
                          setCurrentCardIndex(index);
                          setTimeout(() => setIsAnimating(false), 300);
                        }
                      }}
                      disabled={isAnimating}
                      className={`h-3 w-3 rounded-full transition-colors disabled:opacity-50 ${
                        recommendationPage === index + 1
                          ? "bg-pink-500"
                          : "bg-gray-300"
                      }`}
                      aria-label={`Go to card ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="hidden lg:flex justify-center items-center mt-8 space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isAnimating) {
                          setIsAnimating(true);
                          const pageNumber = index + 1;
                          if (pageNumber <= totalPages) {
                            setRecommendationPage(pageNumber);
                          }
                          setTimeout(() => setIsAnimating(false), 300);
                        }
                      }}
                      disabled={isAnimating}
                      className={`h-5 w-5 rounded-full transition-colors disabled:opacity-50 ${
                        recommendationPage === index + 1
                          ? "bg-pink-500"
                          : "bg-gray-300"
                      }`}
                      aria-label={`Go to page ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="border border-dashed rounded-2xl p-6 sm:p-16 flex flex-col items-center justify-center text-center min-h-[300px] sm:min-h-[400px]">
                <svg
                  width="70"
                  height="71"
                  viewBox="0 0 70 71"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M49.3859 62.9679C44.9493 65.2978 40.0112 66.5102 35 66.5C17.8783 66.5 4 52.6217 4 35.5C4 18.3783 17.8783 4.5 35 4.5C52.1217 4.5 66 18.3783 66 35.5C66 35.8229 65.9948 36.1458 65.9845 36.4688H69.8614C69.8705 36.1458 69.875 35.8229 69.875 35.5C69.875 16.2393 54.2607 0.625 35 0.625C15.7393 0.625 0.125 16.2393 0.125 35.5C0.125 54.7607 15.7393 70.375 35 70.375C40.6567 70.3853 46.2301 69.0117 51.2343 66.3741L49.3859 62.9679Z"
                    fill="#323232"
                  />
                  <path
                    d="M15.1263 34.2406C14.8938 35.6705 15.8645 37.0403 17.1878 37.889C18.5712 38.7744 20.5436 39.2588 22.8647 38.9158C23.9018 38.7746 24.897 38.4138 25.7837 37.8575C26.6704 37.3012 27.4283 36.5622 28.0068 35.6899C28.9833 34.2096 29.3844 32.4097 28.9368 31.0748C28.8848 30.9206 28.7949 30.782 28.6752 30.6717C28.5555 30.5615 28.41 30.4831 28.2521 30.4439C28.0942 30.4047 27.9289 30.406 27.7716 30.4475C27.6143 30.489 27.47 30.5695 27.3519 30.6815C23.8722 33.983 19.9429 34.7948 16.4206 33.487C16.2862 33.437 16.1424 33.4175 15.9995 33.4298C15.8567 33.4422 15.7184 33.4861 15.5946 33.5584C15.4707 33.6307 15.3645 33.7295 15.2835 33.8479C15.2026 33.9662 15.1489 34.0991 15.1263 34.2406ZM54.0236 34.2406C54.2541 35.6705 53.2834 37.0403 51.9601 37.889C50.5767 38.7744 48.6063 39.2588 46.2832 38.9158C45.2464 38.7743 44.2517 38.4134 43.3653 37.8571C42.479 37.3008 41.7214 36.562 41.1431 35.6899C40.1666 34.2096 39.7636 32.4097 40.2131 31.0748C40.265 30.9206 40.355 30.782 40.4746 30.6717C40.5943 30.5615 40.7398 30.4831 40.8977 30.4439C41.0557 30.4047 41.2209 30.406 41.3782 30.4475C41.5356 30.489 41.6799 30.5695 41.7979 30.6815C45.2777 33.983 49.2069 34.7948 52.7293 33.487C52.8637 33.437 53.0075 33.4175 53.1503 33.4298C53.2932 33.4422 53.4315 33.4861 53.5553 33.5584C53.6791 33.6307 53.7853 33.7295 53.8663 33.8479C53.9473 33.9662 54.001 34.0991 54.0236 34.2406Z"
                    fill="#323232"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M58.25 58.75C60.3054 58.75 62.2767 57.9335 63.7301 56.4801C65.1835 55.0267 66 53.0554 66 51C66 44.2188 58.25 37.4375 58.25 37.4375C58.25 37.4375 50.5 44.2188 50.5 51C50.5 53.0554 51.3165 55.0267 52.7699 56.4801C54.2233 57.9335 56.1946 58.75 58.25 58.75ZM58.25 54.875C59.2777 54.875 60.2633 54.4667 60.99 53.74C61.7167 53.0133 62.125 52.0277 62.125 51C62.125 48.9346 60.8579 46.4081 59.0444 44.025C58.777 43.6762 58.5122 43.3456 58.25 43.033C57.9878 43.3443 57.723 43.675 57.4556 44.025C55.6441 46.4081 54.375 48.9346 54.375 51C54.375 52.0277 54.7833 53.0133 55.51 53.74C56.2367 54.4667 57.2223 54.875 58.25 54.875Z"
                    fill="#323232"
                  />
                  <path
                    d="M28.8 54.1C31.9 49.9673 38.1 49.9673 41.2 54.1C41.5083 54.5111 41.9673 54.7829 42.476 54.8555C42.9847 54.9282 43.5014 54.7958 43.9125 54.4875C44.3236 54.1792 44.5954 53.7202 44.668 53.2115C44.7407 52.7028 44.6083 52.1861 44.3 51.775C39.65 45.575 30.35 45.575 25.7 51.775C25.3917 52.1861 25.2593 52.7028 25.332 53.2115C25.4047 53.7202 25.6764 54.1792 26.0875 54.4875C26.4986 54.7958 27.0153 54.9282 27.524 54.8555C28.0327 54.7829 28.4917 54.5111 28.8 54.1Z"
                    fill="#323232"
                  />
                </svg>

                <p className="text-base sm:text-xl md:text-2xl text-gray-400 font-handlee italic mt-3 sm:mt-5">
                  Maaf Belum Ada Product Yang Cocok Buat Kamu...
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        userId={userId}
        analysisResultId={resultId || ""}
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        errorMessage={errorModalMessage}
      />

      {/* Locked Modal */}
      {isLockedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-sm text-center flex flex-col items-center mx-4">
            <div className="w-16 h-16 bg-[#FFC6C6] rounded-full flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-[#323232]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-oswald">
              Hasil Analisis Terkunci
            </h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Untuk melihat hasil analisis lengkap dan rekomendasi personal
              hijab Anda, silakan lakukan pembayaran terlebih dahulu.
            </p>
            <Button
              onClick={() => router.push("/ai-overview/payment")}
              className="w-full bg-[#FFC6C6] text-[#323232] font-bold py-3 px-6 rounded-xl hover:bg-pink-300 transition-colors"
            >
              Bayar Sekarang
            </Button>
          </div>
        </div>
      )}
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
