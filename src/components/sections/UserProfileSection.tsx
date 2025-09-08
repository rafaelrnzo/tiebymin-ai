"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProfileSectionProps {
  userName: string;
  userPhotoUrl: string | null;
  resultId: string | null;
  onDownloadStory: () => void;
  isGeneratingStory: boolean;
  accessSource?: "registration" | "profile" | "payment";
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  userName,
  userPhotoUrl,
  resultId,
  onDownloadStory,
  isGeneratingStory,
  accessSource = "registration",
}) => {
  const router = useRouter();

  // State for localStorage values
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // State for image loading
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUploadImage(localStorage.getItem("uploadedImage"));
      setCapturedImage(localStorage.getItem("capturedImage"));
    }
  }, []);

  // Clear localStorage images when viewing results from API to prevent stale data
  useEffect(() => {
    if (resultId && userPhotoUrl && typeof window !== "undefined") {
      // Clear localStorage images when we have API data
      localStorage.removeItem("uploadedImage");
      localStorage.removeItem("capturedImage");
      setUploadImage(null);
      setCapturedImage(null);
    }
  }, [resultId, userPhotoUrl]);

  // Helper function to ensure image has full URL
  const ensureFullImageUrl = (imageUrl: string | null): string | null => {
    if (!imageUrl) return null;

    // If already a full URL, return as is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // If it's a relative path, prepend the base URL
    const baseUrl = "https://tiebymin-backend.withsummon.com/";
    return `${baseUrl}${
      imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl
    }`;
  };

  // Function to fetch image with authentication
  const fetchImageWithAuth = async (imageUrl: string) => {
    try {
      setImageLoading(true);
      setImageError(false);

      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("userToken");

      if (!token) {
        console.error("No authentication token found for image fetch");
        setImageError(true);
        setImageLoading(false);
        return;
      }

      const response = await fetch(imageUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const dataUrl = URL.createObjectURL(blob);
      setImageDataUrl(dataUrl);
      setImageLoading(false);
    } catch (error) {
      console.error("Error fetching image with auth:", error);
      setImageError(true);
      setImageLoading(false);
    }
  };

  // Determine display image based on access source
  let displayImage: string | null = null;

  if (accessSource === "registration") {
    // Registration flow: use localStorage images
    const processedUploadImage = uploadImage
      ? ensureFullImageUrl(uploadImage)
      : null;
    const processedCapturedImage = capturedImage
      ? ensureFullImageUrl(capturedImage)
      : null;
    const processedUserPhotoUrl = userPhotoUrl
      ? ensureFullImageUrl(userPhotoUrl)
      : null;
    displayImage =
      processedUploadImage ||
      processedCapturedImage ||
      processedUserPhotoUrl ||
      null;
  } else if (accessSource === "payment") {
    // Payment redirect: use API data, clear localStorage
    displayImage = userPhotoUrl ? ensureFullImageUrl(userPhotoUrl) : null;
  } else if (accessSource === "profile") {
    // Profile navigation: use API data, don't use localStorage
    displayImage = userPhotoUrl ? ensureFullImageUrl(userPhotoUrl) : null;
  } else {
    // Default fallback
    if (resultId && userPhotoUrl) {
      displayImage = ensureFullImageUrl(userPhotoUrl);
    } else {
      const processedUploadImage = uploadImage
        ? ensureFullImageUrl(uploadImage)
        : null;
      const processedCapturedImage = capturedImage
        ? ensureFullImageUrl(capturedImage)
        : null;
      const processedUserPhotoUrl = userPhotoUrl
        ? ensureFullImageUrl(userPhotoUrl)
        : null;
      displayImage =
        processedUploadImage ||
        processedCapturedImage ||
        processedUserPhotoUrl ||
        null;
    }
  }

  // Determine if we should show skeleton
  const shouldShowSkeleton = (!displayImage && !imageDataUrl) || imageLoading;

  // Fetch image with authentication when displayImage changes
  useEffect(() => {
    if (displayImage) {
      fetchImageWithAuth(displayImage);
    } else {
      setImageDataUrl(null);
      setImageLoading(false);
    }
  }, [displayImage]);

  // Cleanup object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imageDataUrl) {
        URL.revokeObjectURL(imageDataUrl);
      }
    };
  }, [imageDataUrl]);

  return (
    <div className="bg-[#323232] 2xl:w-[550px] xl:w-[550px] md:w-full md:h-[250px] 2xl:h-[700px] xl:h-[700px] lg:h-full rounded-3xl p-5 text-[#f0f0f0] flex flex-col lg:flex-row md:flex-row items-center xl:flex-col gap-x-5 lg:mt-[60px] xl:mt-0">
      <div className="relative h-[200px] md:h-[200px] lg:h-[280px] w-full rounded-xl overflow-hidden">
        {shouldShowSkeleton ? (
          // Skeleton loading state
          <div className="w-full h-full bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-sm">Loading image...</div>
          </div>
        ) : (
          // Actual image
          <Image
            src={imageDataUrl || displayImage!}
            alt="Analysis Result"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 500px"
            className="object-cover rounded-xl"
            loading="lazy"
            unoptimized={true}
            priority={false}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col w-full justify-evenly gap-4 mt-4">
        <h2 className="w-full text-2xl sm:text-3xl lg:text-4xl font-handlee text-[#FFC6C6] italic leading-tight">
          Hi {userName}, Ini Dia
          <br />
          Hasil Analisa Kamu
        </h2>
        <p className="text-[#f0f0f0] text-xs lg:text-base xl:text-xl font-poppins">
          Dapatkan insight mendalam tentang fashion terbaik untuk kamu dengan
          teknologi AI kami dengan rekomendasi personal yang akurat.
        </p>
        <div className="flex justify-between mt-4 gap-x-3">
          <button
            onClick={onDownloadStory}
            disabled={!resultId || isGeneratingStory}
            className="bg-[#f0f0f0] w-full text-xs sm:text-sm text-[#323232] px-3 py-2 rounded-lg xl:rounded-full flex items-center justify-center gap-4 lg:gap-1 not-last:transition hover:bg-gray-200 disabled:opacity-50"
          >
            <Image
              src="/overview-ai/icons/material-symbols_share.svg"
              width={16}
              height={16}
              alt="Bagikan Hasil"
              loading="lazy"
            />
            <span className="text-[12px] lg:text-[16px] font-poppins text-[#323232]">
              Bagikan Hasil
            </span>
          </button>
          <button
            onClick={() =>
              router.push(`/ai-overview/pdf/preview?result_id=${resultId}`)
            }
            disabled={!resultId}
            className="bg-[#FFC6C6] w-full text-[#323232] px-3 py-2 rounded-lg xl:rounded-full flex items-center justify-center gap-4 lg:gap-1 hover:bg-pink-600 transition disabled:bg-gray-400 text-xs sm:text-sm"
          >
            <Image
              src="/overview-ai/icons/ic_round-download.svg"
              width={16}
              height={16}
              alt="Unduh Hasil"
              loading="lazy"
            />
            <span className="text-[12px] lg:text-[16px] font-poppins text-[#323232]">
              Download Hasil
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;
