"use client";

// React and Next.js imports
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic"; // Import for Lazy Loading

// UI Components
import { Navbar } from "@/components/component-landing/navbar";
import { Skeleton } from "@/components/ui/skeleton";

// Feature Components - Lazy load heavy components
const AnalysisTabs = dynamic(
  () => import("@/components/sections/AnalysisTabs")
);
const ProductRecommendationsSection = dynamic(
  () => import("@/components/sections/ProductRecommendationsSection")
);
const UserProfileSection = dynamic(
  () => import("@/components/sections/UserProfileSection")
);

const ErrorModal = dynamic(() =>
  import("@/components/sections/error-modal").then((mod) => ({
    default: mod.ErrorModal,
  }))
);
const FeedbackModal = dynamic(() =>
  import("@/components/sections/feedback-modal").then((mod) => ({
    default: mod.default,
  }))
);
const PaymentModal = dynamic(() =>
  import("@/components/sections/payment-modal").then((mod) => ({
    default: mod.PaymentModal,
  }))
);

// Hooks
import {
  useAnalysisData,
  useCreatePayment,
  useOrderData,
} from "@/hooks/useAnalysisData";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useProductRecommendations } from "@/hooks/useProductRecommendations";
import { useStoryHandler } from "@/hooks/useStoryHandler";
import { useUserData } from "@/hooks/useUserData";

// Types and Constants
import { analysisTabs } from "@/lib/mock-data";
import { AnalysisResult } from "@/types/analysis";
import TabAnimation from "./TabAnimation";

// --- SKELETON COMPONENTS for <Suspense> ---
// These are simple placeholders shown while data is loading.
const UserProfileSkeleton = () => (
  <div className="bg-gray-300 2xl:w-[550px] xl:w-[550px] md:w-full md:h-[250px] 2xl:h-[700px] xl:h-[700px] lg:h-full rounded-3xl animate-pulse">
    <div className="p-5">
      <div className="w-full h-[200px] md:h-[200px] lg:h-[280px] bg-gray-400 rounded-xl mb-4"></div>
      <div className="space-y-3">
        <div className="h-8 bg-gray-400 rounded w-3/4"></div>
        <div className="h-4 bg-gray-400 rounded w-full"></div>
        <div className="h-4 bg-gray-400 rounded w-2/3"></div>
        <div className="flex gap-3 mt-4">
          <div className="h-10 bg-gray-400 rounded-lg flex-1"></div>
          <div className="h-10 bg-gray-400 rounded-lg flex-1"></div>
        </div>
      </div>
    </div>
  </div>
);

const AnalysisContentSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="h-12 bg-gray-300 rounded-lg mb-4"></div>
    <div className="h-96 bg-gray-300 rounded-lg"></div>
  </div>
);

function BeautyAnalysisPageInner() {
  // UI State
  const [activeTab, setActiveTab] = useState(0);
  const [visitedTabs, setVisitedTabs] = useState(new Set<string>());
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);

  // Payment State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [needsPayment, setNeedsPayment] = useState(false);
  const [paymentRedirectProcessed, setPaymentRedirectProcessed] =
    useState(false);

  // URL parameter handling
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result_id");
  const urlOrderId = searchParams.get("order_id");
  const statusCode = searchParams.get("status_code");
  const transactionStatus = searchParams.get("transaction_status");

  // Immediately store order_id in localStorage if present in URL to handle quick redirects
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      urlOrderId &&
      !localStorage.getItem("paymentOrderId")
    ) {
      localStorage.setItem("paymentOrderId", urlOrderId);
    }
  }, [urlOrderId]);

  const localStorageOrderId =
    typeof window !== "undefined"
      ? localStorage.getItem("paymentOrderId")
      : null;
  const orderId = urlOrderId || localStorageOrderId;

  // Determine if this is a payment redirect
  const paymentRedirect =
    statusCode === "200" && transactionStatus === "settlement";

  // Fallback result ID
  const [fallbackResultId, setFallbackResultId] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedResultId = localStorage.getItem("analysisResultId");
      setFallbackResultId(resultId || storedResultId);
    }
  }, [resultId]);

  // Custom hooks
  const { userName, userId, logout } = useUserData();
  const { isAuthChecking } = useAuthCheck({
    redirectTo: "/register",
    autoRedirect: false, // Don't auto-redirect, let the component handle it
    fetchUserData: true,
  });
  const { isGeneratingStory, handleDownloadStory } = useStoryHandler();

  // Proper logout function using the hook
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: clear localStorage and redirect manually if API call fails
      if (typeof window !== "undefined") {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  // Data fetching and payment flow
  const {
    data: orderData,
    isLoading: isOrderLoading,
    isSuccess: isOrderSuccess,
    error: orderError,
  } = useOrderData(orderId, !paymentRedirect); // Don't require auth for payment redirects

  const orderAnalysisResultId = orderData?.analysisResultId;
  const finalResultId = orderAnalysisResultId || fallbackResultId;
  const isValidResultId =
    finalResultId &&
    typeof finalResultId === "string" &&
    finalResultId.length > 0;

  // Determine access source
  const getAccessSource = () => {
    if (orderId && statusCode === "200" && transactionStatus === "settlement") {
      return "payment";
    } else if (resultId && !orderId) {
      return "profile";
    } else {
      return "registration";
    }
  };

  const accessSource = getAccessSource();

  // Payment flow effects
  useEffect(() => {
    if (orderId && isOrderLoading) {
      // Order data is loading, preventing any redirects
    }
  }, [orderId, isOrderLoading]);

  useEffect(() => {
    if (isOrderSuccess && orderId && !paymentRedirectProcessed) {
      setPaymentRedirectProcessed(true);
    }
  }, [isOrderSuccess, orderId, paymentRedirectProcessed]);

  // Clear URL parameters only after payment redirect has been fully processed
  // This useEffect will be moved after useAnalysisData hook

  // Payment and error handling
  useEffect(() => {
    if (!isAuthChecking) {
      // Handle order errors
      if (orderId && orderError) {
        setErrorModalMessage(
          "Order tidak ditemukan atau tidak valid. Silakan periksa link yang Anda ikuti."
        );
        setIsErrorModalOpen(true);
        return;
      }

      // Handle missing analysis result ID
      if (orderId && !orderAnalysisResultId && !isOrderLoading) {
        if (isOrderSuccess && !orderData) {
          setErrorModalMessage(
            "Data order tidak ditemukan. Order mungkin sudah kadaluarsa atau tidak valid."
          );
          setIsErrorModalOpen(true);
          return;
        }
      }

      // Show payment modal if no valid result and no order processing
      if (!isValidResultId && !orderId) {
        setNeedsPayment(true);
        setIsPaymentModalOpen(true);
      }
    }
  }, [
    isAuthChecking,
    isValidResultId,
    orderId,
    orderError,
    orderAnalysisResultId,
    isOrderLoading,
    isOrderSuccess,
    orderData,
  ]);

  const {
    data: analysisResult,
    isLoading,
    error,
    isError,
  } = useAnalysisData(isValidResultId && finalResultId ? finalResultId : null, {
    onError: (err) => {
      // Only show error modal if we actually have a resultId to fetch
      // This prevents error modals for new users who haven't completed analysis yet
      if (finalResultId && isValidResultId) {
        setErrorModalMessage(
          err.message || "Terjadi kesalahan saat memuat data analisis"
        );
        setIsErrorModalOpen(true);
      }
    },
  });

  // Handle session expiration and authentication errors
  useEffect(() => {
    if (!isAuthChecking && (error || orderError)) {
      // Check if it's an authentication error (401)
      const isAuthError =
        (error as { response?: { status?: number } })?.response?.status ===
          401 ||
        (orderError as { response?: { status?: number } })?.response?.status ===
          401;

      if (isAuthError) {
        // Clear all localStorage data and logout
        handleLogout();
        return;
      }
    }
  }, [isAuthChecking, error, orderError, handleLogout]);

  // Analysis data and mutations
  const { mutateAsync: createPayment, isPending: isPaymentProcessing } =
    useCreatePayment();

  const { userData, userPhotoUrl, rawAnalysisData }: AnalysisResult =
    analysisResult || {
      userData: null,
      userPhotoUrl: null,
      rawAnalysisData: null,
    };

  // Determine which image to use based on access source and availability
  const getDisplayImage = () => {
    if (typeof window === "undefined")
      return analysisResult?.userPhotoUrl || null;

    // Jika alur registrasi, prioritaskan localStorage
    if (accessSource === "registration") {
      const capturedImage = localStorage.getItem("capturedImage");
      const uploadedImage = localStorage.getItem("uploadedImage");
      if (capturedImage || uploadedImage) {
        return capturedImage || uploadedImage;
      }
    }

    // Gunakan URL langsung dari API
    const apiUrl = analysisResult?.userPhotoUrl;

    // Validate URL before returning
    if (apiUrl) {
      try {
        new URL(apiUrl); // This will throw if URL is invalid
        return apiUrl;
      } catch (error) {
        console.warn("Invalid API image URL:", apiUrl);
        return null;
      }
    }

    return null;
  };

  const displayImage = getDisplayImage();

  // Clean up payment-related data after successful payment processing
  useEffect(() => {
    if (
      paymentRedirectProcessed &&
      orderId &&
      statusCode === "200" &&
      transactionStatus === "settlement" &&
      typeof window !== "undefined" &&
      !isOrderLoading &&
      !isLoading &&
      !isError &&
      orderAnalysisResultId &&
      userData &&
      !isAuthChecking
    ) {
      // Clean up payment-related localStorage data
      localStorage.removeItem("uploadedImage");
      localStorage.removeItem("capturedImage");
      localStorage.removeItem("paymentOrderId");

      // Store the analysisResultId in localStorage for fallback use
      if (orderAnalysisResultId) {
        localStorage.setItem("analysisResultId", orderAnalysisResultId);
      }
    }
  }, [
    paymentRedirectProcessed,
    orderId,
    statusCode,
    transactionStatus,
    isOrderLoading,
    isLoading,
    isError,
    orderAnalysisResultId,
    userData,
    isAuthChecking,
  ]);

  // Product recommendations
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

  // Story generation handler - using existing hook
  const handleStoryDownload = () => {
    handleDownloadStory(finalResultId);
  };

  // Payment handler
  const handlePayment = async () => {
    try {
      if (typeof window === "undefined") return;

      const storedData = localStorage.getItem("tiebymin-analysis-data");
      const userId = localStorage.getItem("userId");
      const capturedImage = localStorage.getItem("capturedImage");
      const uploadedImage = localStorage.getItem("uploadedFaceImage");

      if (!storedData || !userId) {
        setErrorModalMessage(
          "Data analisis tidak ditemukan. Silakan mulai ulang proses analisis."
        );
        setIsErrorModalOpen(true);
        return;
      }

      const analysisData = JSON.parse(storedData);
      const imageBlob = await getImageBlob(capturedImage, uploadedImage);

      if (!imageBlob) {
        setErrorModalMessage(
          "Foto wajah tidak ditemukan. Silakan ambil foto ulang."
        );
        setIsErrorModalOpen(true);
        return;
      }

      const result = await createPayment({
        user_id: userId,
        tinggi_badan: parseFloat(analysisData.tinggi),
        berat_badan: parseFloat(analysisData.berat),
        umur: parseInt(analysisData.umur),
        body_shape_id: analysisData.body_shape_id,
        amount: 9999,
        foto_wajah: imageBlob,
      });

      if (result && result.redirect_url) {
        setIsPaymentModalOpen(false);
        window.location.href = result.redirect_url;
      } else {
        throw new Error("Pembayaran gagal diproses. Silakan coba lagi.");
      }
    } catch (error) {
      const err = error as Error;
      setErrorModalMessage(
        err.message ||
          "Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi."
      );
      setIsErrorModalOpen(true);
    }
  };

  // Helper function to get image blob
  const getImageBlob = async (
    capturedImage: string | null,
    uploadedImage: string | null
  ): Promise<Blob | null> => {
    if (capturedImage) {
      const response = await fetch(capturedImage);
      return await response.blob();
    } else if (uploadedImage) {
      const response = await fetch(uploadedImage);
      return await response.blob();
    }
    return null;
  };

  // UI Effects
  useEffect(() => {
    if (activeTab !== null) {
      const currentTabId = analysisTabs[activeTab]?.id;
      if (currentTabId) {
        setVisitedTabs((prev) => new Set(prev).add(currentTabId));
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (typeof window === "undefined") return;

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
    if (typeof window === "undefined") return;

    const feedbackDismissed = localStorage.getItem("feedbackDismissed");
    if (feedbackDismissed === "true") {
      setFeedbackModalOpen(false);
    }
  }, []);

  useEffect(() => {
    setIsLockedModalOpen(false);
  }, [resultId, isLoading, error, userData, userPhotoUrl, rawAnalysisData]);

  // Data cleanup effects
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!isLoading && !isError && userData && finalResultId) {
      const clearDataTimer = setTimeout(() => {
        // Clear registration data
        localStorage.removeItem("registration-steps-progress");
        localStorage.removeItem("registration-current-step");

        // Clear analysisResultId for non-payment flows to prevent interference
        if (!orderId && !urlOrderId) {
          localStorage.removeItem("analysisResultId");
        }

        // Clean up tiebymin-analysis-data after successful payment
        if (
          paymentRedirectProcessed &&
          orderId &&
          statusCode === "200" &&
          transactionStatus === "settlement"
        ) {
          localStorage.removeItem("tiebymin-analysis-data");
        }
      }, 2000);

      return () => clearTimeout(clearDataTimer);
    }
  }, [
    isLoading,
    isError,
    userData,
    finalResultId,
    orderId,
    urlOrderId,
    paymentRedirectProcessed,
    statusCode,
    transactionStatus,
  ]);

  const renderContent = (tabId: string) => {
    const analysisData = rawAnalysisData;
    if (!analysisData) return null;

    const content = (() => {
      switch (tabId) {
        case "shape":
          const ShapeComponent = dynamic(
            () => import("../../components/sections/ShapeSection")
          );
          return (
            <Suspense
              fallback={
                <div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>
              }
            >
              <ShapeComponent
                shapeId={analysisData.face_shape_id?.toString() || "1"}
              />
            </Suspense>
          );
        case "color":
          const ColorComponent = dynamic(
            () => import("../../components/sections/ColorToneSection")
          );
          return (
            <Suspense
              fallback={
                <div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>
              }
            >
              <ColorComponent
                colorAnalysisId={
                  analysisData.color_analysis_id?.toString() || "1"
                }
              />
            </Suspense>
          );
        case "body":
          const BodyComponent = dynamic(
            () => import("../../components/sections/BodySection")
          );
          return (
            <Suspense
              fallback={
                <div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>
              }
            >
              <BodyComponent
                bodyShapeId={analysisData.body_shape_id?.toString() || "1"}
                bmiCategoryId={analysisData.bmi_category_id?.toString() || "1"}
                bmiResult={{
                  value: userData?.bmi?.value || 0,
                }}
              />
            </Suspense>
          );
        case "celebrity":
          const CelebrityComponent = dynamic(
            () => import("../../components/sections/CelebrityMatchSection")
          );
          return (
            <Suspense
              fallback={
                <div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>
              }
            >
              <CelebrityComponent
                celebrityId={
                  analysisData.celebrity_id
                    ? analysisData.celebrity_id.toString()
                    : null
                }
              />
            </Suspense>
          );
        case "tips":
          const TipsComponent = dynamic(
            () => import("../../components/sections/TipsSection")
          );
          return (
            <Suspense
              fallback={
                <div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>
              }
            >
              <TipsComponent
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
            </Suspense>
          );
        default:
          const DefaultShapeComponent = dynamic(
            () => import("../../components/sections/ShapeSection")
          );
          return (
            <Suspense
              fallback={
                <div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>
              }
            >
              <DefaultShapeComponent
                shapeId={analysisData.face_shape_id?.toString() || "1"}
              />
            </Suspense>
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
    <>
      {/* Preload critical resources */}
      {displayImage && (
        <link
          rel="preload"
          href={displayImage}
          as="image"
          fetchPriority="high"
        />
      )}
      <link
        rel="preconnect"
        href="//minecraft-server-tiebymin-minio.dgrttk.easypanel.host"
        crossOrigin=""
      />

      <div className="min-h-screen bg-[#f0f0f0] min-w-full w-full bg-repeat">
        <Navbar />

        <main className="w-full py-8 lg:py-4 pt-[80px] px-[20px] 2xl:container 2xl:mx-auto">
          <div className="flex flex-col md:flex-col xl:flex-row w-full mb-3 md:mb-6 lg:mb-10 gap-3 md:gap-6 xl:gap-[50px] mt-3 md:mt-6 lg:mt-[100px] xl:mt-[160px]">
            {/* --- PERFORMANCE: Suspense for LCP Element --- */}
            {/* The UI streams to the user. This skeleton appears instantly while the actual profile data loads. */}
            {/* This drastically improves LCP and user experience. */}
            <Suspense fallback={<UserProfileSkeleton />}>
              <UserProfileSection
                userName={userName}
                userPhotoUrl={displayImage}
                resultId={finalResultId}
                onDownloadStory={handleStoryDownload}
                isGeneratingStory={isGeneratingStory}
              />
            </Suspense>

            <div
              className={`w-full ${
                needsPayment ? "blur-sm pointer-events-none" : ""
              }`}
            >
              {/* --- PERFORMANCE: Suspense for Analysis Content --- */}
              <Suspense fallback={<AnalysisContentSkeleton />}>
                {isLoading ? (
                  <AnalysisContentSkeleton />
                ) : (
                  <div>
                    <AnalysisTabs
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                    />

                    <div className="mt-[16px] lg:mt-[50px] relative overflow-hidden">
                      <TabAnimation activeTab={activeTab}>
                        {renderContent(analysisTabs[activeTab].id)}
                      </TabAnimation>
                    </div>
                  </div>
                )}
              </Suspense>
            </div>
          </div>

          {/* This can also be wrapped in Suspense if product loading is slow */}
          <div className={needsPayment ? "blur-sm pointer-events-none" : ""}>
            <ProductRecommendationsSection
              sortedProducts={sortedProducts}
              topProductScores={topProductScores}
              recommendationFilter={recommendationFilter}
              onFilterChange={handleFilterChange}
            />
          </div>
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
          onLogout={handleLogout}
        />
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onProceedToPayment={handlePayment}
          isProcessing={isPaymentProcessing}
        />
      </div>
    </>
  );
}

export default function BeautyAnalysisPage() {
  // The top-level Suspense remains a good pattern for the whole page.
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Skeleton className="h-screen w-full" />
        </div>
      }
    >
      <BeautyAnalysisPageInner />
    </Suspense>
  );
}
