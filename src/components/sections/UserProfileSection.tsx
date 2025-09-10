"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { decodeUrl } from "@/lib/urlUtils";

interface UserProfileSectionProps {
  userName: string | null;
  userPhotoUrl: string | null;
  resultId: string | null;
  onDownloadStory: () => void;
  isGeneratingStory: boolean;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  userName,
  userPhotoUrl,
  resultId,
  onDownloadStory,
  isGeneratingStory,
}) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<
    "fast" | "slow" | "unknown"
  >("unknown");
  const [showFallback, setShowFallback] = useState(false);

  const decodedUserPhotoUrl = userPhotoUrl ? decodeUrl(userPhotoUrl) : null;

  const isBlobUrl = decodedUserPhotoUrl?.startsWith("blob:") ?? false;

  const isValidUrl = decodedUserPhotoUrl
    ? (() => {
        try {
          new URL(decodedUserPhotoUrl);
          return true;
        } catch (error) {
          return false;
        }
      })()
    : false;

  // Network quality detection
  useEffect(() => {
    if (typeof window !== "undefined" && "navigator" in window) {
      // Type-safe connection detection
      const connection =
        (
          navigator as Navigator & {
            connection?: { effectiveType: string };
            mozConnection?: { effectiveType: string };
            webkitConnection?: { effectiveType: string };
          }
        ).connection ||
        (
          navigator as Navigator & {
            mozConnection?: { effectiveType: string };
          }
        ).mozConnection ||
        (
          navigator as Navigator & {
            webkitConnection?: { effectiveType: string };
          }
        ).webkitConnection;

      if (connection) {
        const effectiveType = connection.effectiveType;
        if (effectiveType === "slow-2g" || effectiveType === "2g") {
          setConnectionQuality("slow");
        } else if (effectiveType === "3g") {
          setConnectionQuality("slow");
        } else {
          setConnectionQuality("fast");
        }
      } else {
        // Fallback: measure connection by timing a small request
        const img = document.createElement("img");
        const startTime = Date.now();
        img.onload = () => {
          const loadTime = Date.now() - startTime;
          setConnectionQuality(loadTime > 1000 ? "slow" : "fast");
        };
        img.src =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      }
    }
  }, []);

  // Adaptive loading strategy based on connection
  const getLoadingStrategy = () => {
    if (connectionQuality === "slow") {
      return "lazy";
    }
    return "eager";
  };

  // Fallback image for poor connections
  const getFallbackImage = () => {
    return "/placeholder-user.jpg"; // Assume a local placeholder image exists or add one
  };

  const getImageQuality = () => {
    if (connectionQuality === "slow") {
      return 50; // Lower quality for slow connections
    }
    return 80; // Higher quality for fast connections
  };

  // Preload fallback for slow connections
  useEffect(() => {
    if (connectionQuality === "slow" && !imageLoaded && !imageError) {
      const img = new window.Image();
      img.src = "/placeholder-user.png"; // Simple local fallback
      img.onload = () => setShowFallback(true);
    }
  }, [connectionQuality, imageLoaded, imageError]);

  return (
    <div className="bg-[#323232] 2xl:w-[550px] xl:w-[550px] md:w-full md:h-[250px] 2xl:h-[700px] xl:h-[700px] lg:h-full rounded-3xl p-5 text-[#f0f0f0] flex flex-col lg:flex-row md:flex-row items-center xl:flex-col gap-x-5 lg:mt-[60px] xl:mt-0">
      <div className="relative h-[200px] md:h-[200px] lg:h-[280px] w-full rounded-xl overflow-hidden">
        {showFallback ? (
          <Image
            src={getFallbackImage()}
            alt="User Profile Fallback"
            fill
            className="object-cover rounded-xl"
            priority={connectionQuality === "fast"}
            quality={connectionQuality === "slow" ? 30 : 80}
          />
        ) : decodedUserPhotoUrl && (isBlobUrl || isValidUrl) ? (
          isBlobUrl ? (
            <Image
              src={decodedUserPhotoUrl}
              alt="Analysis Result"
              fill
              className="object-cover rounded-xl"
              loading={getLoadingStrategy()}
              onLoadingComplete={() => {
                setImageLoaded(true);
                setShowFallback(false);
              }}
              onError={() => {
                setImageError(true);
                setShowFallback(true);
              }}
              quality={getImageQuality()}
            />
          ) : (
            <Image
              key={decodedUserPhotoUrl}
              src={decodedUserPhotoUrl}
              alt="Analysis Result"
              fill
              className="object-cover rounded-xl"
              loading={getLoadingStrategy()}
              onLoadingComplete={() => {
                setImageLoaded(true);
                setShowFallback(false);
              }}
              onError={() => {
                setImageError(true);
                setShowFallback(true);
              }}
              quality={getImageQuality()}
            />
          )
        ) : (
          <div className="w-full h-full bg-gray-500 rounded-xl animate-pulse flex items-center justify-center">
            <div className="text-white text-sm">
              {connectionQuality === "slow"
                ? "Loading image..."
                : "No image available"}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col w-full justify-evenly gap-4 mt-4">
        <h2 className="w-full text-2xl sm:text-3xl lg:text-4xl font-handlee text-[#FFC6C6] italic leading-tight">
          Hi {userName || "Pengguna"}, Ini Dia
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
