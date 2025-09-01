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
    <div className="bg-[#323232] xl:w-[500px] md:w-full md:h-[250px] xl:h-[630px] rounded-3xl p-5 text-[#f0f0f0] flex flex-col md:flex-row gap-x-[20px] lg:gap-x-5 xl:flex-col lg:flex-col lg:mt-[130px] xl:mt-0">
      <div className="relative h-[200px] md:h-[200px] lg:h-[280px] w-full mb-4 sm:mb-6 bg-gray-200 rounded-xl overflow-hidden">
        {userPhotoUrl ? (
          <>
            {/* Loading State */}
            {imageLoading && !imageError && (
              <div className="absolute inset-0 bg-gray-200 rounded-xl flex items-center justify-center animate-pulse z-10">
                <div className="text-sm text-gray-500">Memuat gambar...</div>
              </div>
            )}

            {/* Retry Loading State */}
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

            {/* Error State - Max Retries Reached */}
            {imageError && retryCount >= 3 ? (
              <div className="absolute inset-0 bg-gray-200 rounded-xl flex flex-col items-center justify-center z-10">
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
              /* Actual Image */
              <Image
                key={`${userPhotoUrl}-${retryCount}`}
                src={userPhotoUrl}
                alt="Analysis Result"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 500px"
                className="object-cover rounded-xl"
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                unoptimized={true}
                priority={false}
              />
            )}
          </>
        ) : (
          /* No Image Placeholder */
          <div className="h-full w-full bg-gray-300 rounded-xl flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <div className="text-2xl mb-2">📷</div>
              <div className="text-sm">Tidak ada gambar</div>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col w-full">
        <h2 className="w-full text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-4 font-handlee text-[#FFC6C6] italic leading-tight">
          Hi {userName}, Ini Dia
          <br />
          Hasil Analisa Kamu
        </h2>
        <p className="text-[#f0f0f0] text-xs lg:text-base xl:text-xl leading-relaxed font-poppins">
          Dapatkan insight mendalam tentang fashion terbaik untuk kamu dengan
          teknologi AI kami dengan rekomendasi personal yang akurat.
        </p>
        <div className="flex justify-between mt-6 gap-x-3">
          <button
            onClick={onDownloadStory}
            disabled={!resultId || isGeneratingStory}
            className="bg-[#f0f0f0] w-full text-xs sm:text-sm text-[#323232] px-3 lg:py-0 py-2 rounded-lg lg:rounded-full flex items-center justify-center gap-4 lg:gap-1 not-last:transition hover:bg-gray-200 disabled:opacity-50"
          >
            <Image
              src="/overview-ai/icons/material-symbols_share.svg"
              width={16}
              height={16}
              alt="Bagikan Hasil"
              loading="lazy"
            />
            <span className="text-[12px] lg:text-[16px]">Bagikan Hasil</span>
          </button>
          <button
            onClick={() =>
              router.push(`/ai-overview/pdf/preview?result_id=${resultId}`)
            }
            disabled={!resultId}
            className="bg-[#FFC6C6] w-full text-[#323232] px-3 lg:py-0 py-2 rounded-lg lg:rounded-full flex items-center justify-center gap-4 lg:gap-1 hover:bg-pink-600 transition disabled:bg-gray-400 text-xs sm:text-sm"
          >
            <Image
              src="/overview-ai/icons/ic_round-download.svg"
              width={16}
              height={16}
              alt="Unduh Hasil"
              loading="lazy"
            />
            <span className="text-[12px] lg:text-[16px]">Download Hasil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;
