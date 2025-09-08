"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

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

  // Determine if the URL is a temporary blob URL from localStorage.
  const isBlobUrl = userPhotoUrl?.startsWith("blob:") ?? false;

  // Additional validation for non-blob URLs
  const isValidUrl = userPhotoUrl
    ? (() => {
        try {
          new URL(userPhotoUrl);
          return true;
        } catch {
          return false;
        }
      })()
    : false;

  return (
    <div className="bg-[#323232] 2xl:w-[550px] xl:w-[550px] md:w-full md:h-[250px] 2xl:h-[700px] xl:h-[700px] lg:h-full rounded-3xl p-5 text-[#f0f0f0] flex flex-col lg:flex-row md:flex-row items-center xl:flex-col gap-x-5 lg:mt-[60px] xl:mt-0">
      <div className="relative h-[200px] md:h-[200px] lg:h-[280px] w-full rounded-xl overflow-hidden">
        {userPhotoUrl && (isBlobUrl || isValidUrl) ? (
          isBlobUrl ? (
            // FIX: Use a standard <img> tag for blob URLs, as next/image cannot optimize them.
            // This prevents the "Invalid URL" crash.
            <img
              src={userPhotoUrl}
              alt="Analysis Result"
              className="object-cover rounded-xl w-full h-full"
              loading="eager"
              decoding="async"
            />
          ) : (
            // Use the highly optimized next/image component for all valid standard URLs.
            <Image
              key={userPhotoUrl}
              src={userPhotoUrl}
              alt="Analysis Result"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover rounded-xl"
              priority={true} // Prioritizes loading for this LCP element.
              quality={75} // Further optimize image quality for better performance
              placeholder="blur" // Add blur placeholder for better UX
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
              decoding="async"
            />
          )
        ) : (
          // Skeleton is shown when the URL is not available or invalid.
          <div className="w-full h-full bg-gray-500 rounded-xl animate-pulse" />
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
