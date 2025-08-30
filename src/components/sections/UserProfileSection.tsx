"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useImageHandling } from "@/hooks/useImageHandling";

interface UserProfileSectionProps {
  userName: string;
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
  const {
    imageError,
    imageLoading,
    retryCount,
    handleImageLoad,
    handleImageError,
    retryImage,
  } = useImageHandling(userPhotoUrl);

  return (
    <div className="bg-[#323232] w-full lg:w-[35%] lg:h-[735px] rounded-3xl p-5 text-[#f0f0f0] flex flex-col">
      <div className="mb-4 sm:mb-6">
        {userPhotoUrl ? (
          <div className="relative">
            {imageLoading && !imageError && (
              <div className="absolute inset-0 bg-gray-200 rounded-xl flex items-center justify-center animate-pulse z-10">
                <div className="text-sm text-gray-500">Memuat gambar...</div>
              </div>
            )}
            {imageError && retryCount < 3 && (
              <div className="absolute inset-0 bg-gray-200 rounded-xl flex flex-col items-center justify-center z-10">
                <div className="text-sm text-gray-500 mb-2">
                  Memuat ulang...
                </div>
                <div className="text-xs text-gray-400">
                  Percobaan {retryCount + 1}/3
                </div>
              </div>
            )}
            {imageError && retryCount >= 3 ? (
              <div className="h-[200px] sm:h-[250px] bg-gray-200 rounded-xl flex flex-col items-center justify-center">
                <div className="text-sm text-gray-500 mb-2">
                  Gambar tidak dapat dimuat
                </div>
                <button
                  onClick={retryImage}
                  className="text-xs text-blue-500 hover:text-blue-700 underline"
                >
                  Coba lagi
                </button>
              </div>
            ) : (
              <Image
                key={`${userPhotoUrl}-${retryCount}`} // Force re-render on retry
                src={userPhotoUrl}
                alt="Analysis Result"
                width={450}
                height={280}
                className="h-[200px] sm:h-[250px] lg:w-[450px] w-full object-cover rounded-xl"
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                unoptimized={true} // Disable Next.js optimization for external URLs
              />
            )}
          </div>
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
        Dapatkan insight mendalam tentang fashion terbaik untuk kamu dengan
        teknologi AI kami dengan rekomendasi personal yang akurat.
      </p>
      <div className="mb-2 grid grid-cols-2 gap-2 sm:gap-4 justify-center">
        <Button
          onClick={onDownloadStory}
          disabled={!resultId || isGeneratingStory}
          className="bg-[#f0f0f0] text-xs sm:text-sm text-[#323232] px-4 sm:px-6 py-2 rounded-full flex items-center justify-center gap-1 not-last:transition hover:bg-gray-200 disabled:opacity-50"
        >
          <Image
            src="/overview-ai/icons/material-symbols_share.svg"
            width={16}
            height={16}
            alt="Bagikan Hasil"
            loading="lazy"
          />
          <span className="hidden lg:block md:hidden">Share ke Instagram</span>
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
          <span className="text-xs sm:text-sm hidden lg:block md:hidden">
            Download Analisa
          </span>
        </Button>
      </div>
    </div>
  );
};

export default UserProfileSection;
