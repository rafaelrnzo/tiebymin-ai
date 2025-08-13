"use client";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/AnalysisContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useBodyShapes } from "@/hooks/useAnalysisData";

// --- Komponen Skeleton Loader untuk Kolom Tengah ---
const BodyTypeSkeleton = () => (
  <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto px-2 md:px-0 animate-pulse">
    <div className="flex flex-col justify-between w-full gap-8">
      <div className="flex flex-row gap-4 justify-center w-full">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="mb-2 h-48 sm:h-64 w-24 sm:w-32 bg-gray-300/50 rounded-lg"></div>
            <div className="h-4 w-20 bg-gray-300/50 rounded"></div>
          </div>
        ))}
      </div>
      <div className="flex flex-row gap-4 justify-center w-full">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="mb-2 h-48 sm:h-64 w-24 sm:w-32 bg-gray-300/50 rounded-lg"></div>
            <div className="h-4 w-20 bg-gray-300/50 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Modal Overlay Component ---
const ScanFaceModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white/90 rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold -mt-4 -mr-2"
            aria-label="Tutup"
          >
            ×
          </Button>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="/scan-face-illustration.png"
            alt="Scan Wajah"
            width={120}
            height={120}
            className="mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Scan Wajah Kamu
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Fitur scan wajah akan segera tersedia! <br /> Nantikan update dari
            kami.
          </p>
          <Button
            onClick={onClose}
            className="bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl px-6 py-2 transition-colors"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Komponen Utama ---
export default function PrepareFacePage() {
  const { analysisData, setAnalysisData } = useAnalysis();
  const { data: allBodyTypes, isLoading, error } = useBodyShapes();
  const router = useRouter();

  // Set default selection when data is loaded
  useEffect(() => {
    if (
      allBodyTypes &&
      allBodyTypes.length > 0 &&
      !analysisData.body_shape_id
    ) {
      console.log("🔧 Setting default body type:", allBodyTypes[0].id);
      setAnalysisData((prev) => ({
        ...prev,
        body_shape_id: allBodyTypes[0].id,
      }));
    }
  }, [allBodyTypes, analysisData.body_shape_id, setAnalysisData]);

  // Fungsi untuk mengubah pilihan bentuk tubuh di context
  const handleSelectBodyType = (typeId: string) => {
    console.log("👆 Body type selected:", typeId);
    setAnalysisData((prev) => ({
      ...prev,
      body_shape_id: typeId,
    }));
  };

  // Navigasi ke halaman selanjutnya
  const handleNext = () => {
    console.log(
      "➡️ Moving to next page with body_shape_id:",
      analysisData.body_shape_id
    );
    router.push(`/analyze/take-face`);
  };

  // --- Variabel turunan untuk mempermudah rendering ---
  const selectedTypeId = analysisData.body_shape_id;
  const selectedType = allBodyTypes?.find((type) => type.id === selectedTypeId);

  // Membagi data secara dinamis untuk tampilan dua baris
  const topRow =
    allBodyTypes?.slice(0, Math.ceil(allBodyTypes.length / 2)) || [];
  const bottomRow =
    allBodyTypes?.slice(Math.ceil(allBodyTypes.length / 2)) || [];

  const bodyImageWidth = 100;
  const bodyImageHeight = 220;
  const bodyImageClass =
    "w-[80px] h-[180px] sm:w-[100px] sm:h-[220px] object-contain";

  // --- Tampilan Error ---
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100 text-red-500 p-4">
        <p className="text-center mb-4">
          {error instanceof Error
            ? error.message
            : "Gagal memuat data bentuk tubuh"}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Coba Lagi
        </Button>
      </div>
    );
  }

  // --- Tampilan Utama ---
  return (
    <div className="min-h-screen w-full px-4 py-8 sm:p-8 flex flex-col items-center justify-center relative bg-[url('/login-bg.png')] bg-cover bg-center">
      {/* CSS untuk Animasi Bintang */}
      <style jsx global>{`
        @keyframes rotate-sparkle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(90deg);
          }
          50% {
            transform: rotate(0deg);
          }
          75% {
            transform: rotate(-90deg);
          }
        }
        .sparkle-animation {
          animation: rotate-sparkle 4s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-center justify-center">
          {/* Kolom Kiri - Kontrol */}
          <div className="space-y-8 w-full max-w-md mx-auto flex flex-col items-center lg:order-1">
            <div className="mb-8 flex justify-center w-full">
              <Image
                src="/tie-by-min-logo.png"
                alt="Tiebymin Logo"
                width={250}
                height={80}
                priority
                className="mx-auto"
              />
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center justify-between w-full max-w-xs mx-auto shadow-md">
              <span className="text-gray-700 font-medium font-poppins">
                Analisa
              </span>
              <span className="text-gray-700 font-bold font-poppins">03</span>
            </div>

            <div className="bg-[#EF789B] rounded-2xl p-6 text-white w-full max-w-xs mx-auto shadow-md">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold font-poppins">
                  Pilih Bentuk Tubuh Kamu
                </h2>
                <div className="w-6 h-6 rounded flex items-center justify-center">
                  <Image
                    src="/stars.png"
                    alt="stars"
                    width={20}
                    height={20}
                    className="sparkle-animation"
                  />
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                Dengan mengetahui bentuk tubuhmu, kami bisa memberikan
                rekomendasi pakaian yang sesuai.
              </p>
            </div>

            <ScanFaceModal
              isOpen={false} // You can manage this state if needed
              onClose={() => {}} // Handle close if needed
            />
          </div>

          {/* Kolom Tengah - Pilihan Bentuk Tubuh */}
          {isLoading ? (
            <BodyTypeSkeleton />
          ) : (
            <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto px-2 md:px-0 lg:order-2">
              <div className="flex flex-col justify-between w-full gap-8">
                {/* Top Row */}
                <div className="flex flex-row gap-4 justify-center w-full">
                  {topRow.map((type) => (
                    <Button
                      key={type.id}
                      type="button"
                      onClick={() => handleSelectBodyType(type.id)}
                      className="focus:outline-none p-0 bg-transparent hover:bg-transparent h-auto"
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative mb-2 flex h-48 sm:h-64 w-24 sm:w-32 items-center justify-center">
                          <div
                            className={`absolute inset-0 transition-opacity duration-300 ${
                              selectedTypeId === type.id
                                ? "rounded-lg opacity-100 bg-gradient-to-b from-white/90 to-transparent"
                                : "opacity-0"
                            }`}
                          />
                          <Image
                            src={type.link_picture}
                            alt={`${type.name} body type`}
                            width={bodyImageWidth}
                            height={bodyImageHeight}
                            className={`${bodyImageClass} relative z-10`}
                            onError={(_e) => {
                              console.warn(
                                "🖼️ Image load error for:",
                                type.name,
                                type.link_picture,
                                _e
                              );
                              // You could set a fallback image here
                            }}
                          />
                        </div>
                        <p
                          className={`${
                            selectedTypeId === type.id
                              ? "text-gray-800 font-bold"
                              : "text-gray-500"
                          } text-sm text-center`}
                        >
                          {type.name}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>

                {/* Bottom Row */}
                <div className="flex flex-row gap-4 justify-center w-full">
                  {bottomRow.map((type) => (
                    <Button
                      key={type.id}
                      type="button"
                      onClick={() => handleSelectBodyType(type.id)}
                      className="focus:outline-none p-0 bg-transparent hover:bg-transparent h-auto"
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative mb-2 flex h-48 sm:h-64 w-24 sm:w-32 items-center justify-center">
                          <div
                            className={`absolute inset-0 transition-opacity duration-300 ${
                              selectedTypeId === type.id
                                ? "rounded-lg opacity-100 bg-gradient-to-b from-white/90 to-transparent"
                                : "opacity-0"
                            }`}
                          />
                          <Image
                            src={type.link_picture}
                            alt={`${type.name} body type`}
                            width={bodyImageWidth}
                            height={bodyImageHeight}
                            className={`${bodyImageClass} relative z-10`}
                            onError={(_e) => {
                              console.warn(
                                "🖼️ Image load error for:",
                                type.name,
                                type.link_picture,
                                _e
                              );
                            }}
                          />
                        </div>
                        <p
                          className={`${
                            selectedTypeId === type.id
                              ? "text-gray-800 font-bold"
                              : "text-gray-500"
                          } text-sm text-center`}
                        >
                          {type.name}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Kolom Kanan - Detail Pilihan */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl py-8 px-4 sm:px-6 w-full max-w-xs md:max-w-sm mx-auto flex flex-col justify-between items-center lg:order-3">
            {isLoading || !selectedType ? (
              <div className="w-full animate-pulse">
                <div className="h-12 w-3/4 bg-gray-300/70 rounded mb-6"></div>
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-24 bg-gray-300/70 rounded-md"></div>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="h-4 w-full bg-gray-300/70 rounded"></div>
                  <div className="h-4 w-full bg-gray-300/70 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-300/70 rounded"></div>
                </div>
                <div className="mb-8">
                  <div className="h-6 w-1/2 bg-gray-300/70 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-300/70 rounded"></div>
                    <div className="h-4 w-full bg-gray-300/70 rounded"></div>
                  </div>
                </div>
                <div className="w-full h-14 bg-gray-400/70 rounded-xl mt-4"></div>
              </div>
            ) : (
              <>
                <div className="w-full">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-oswald text-left">
                    {selectedType.name}
                  </h2>
                  <div className="flex justify-center mb-8">
                    <Image
                      src={selectedType.link_picture}
                      alt={`${selectedType.name} body type`}
                      width={60}
                      height={90}
                      className="w-auto h-24 object-contain"
                    />
                  </div>
                  <p className="text-gray-600 text-sm mb-8 leading-relaxed text-left">
                    {selectedType.penjelasan_body_shape}
                  </p>
                  <div className="mb-8">
                    <h3 className="font-bold text-gray-800 mb-3 text-left">
                      Karakteristik
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600 text-left">
                      {selectedType.karakteristik
                        .split("-")
                        .filter((char: string) => char.trim() !== "")
                        .map((char: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-3 text-gray-500">•</span>
                            <span>{char.trim()}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                <Button
                  className="w-full bg-[#323232] text-center text-white rounded-xl py-3 px-6 font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-4 mt-4"
                  onClick={handleNext}
                  disabled={!selectedTypeId}
                >
                  <span>Selanjutnya</span>
                  <span>→</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
