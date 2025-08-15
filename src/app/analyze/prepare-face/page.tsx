"use client";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/AnalysisContext";
import { secureUrl } from "@/lib/api";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LeftSideSection from "@/components/component-login/left-side-section";

const BodyTypeSkeleton = ({ count = 6 }) => {
  const topRowCount = Math.ceil(count / 2);
  const bottomRowCount = count - topRowCount;
  const topRow = Array(topRowCount).fill(0);
  const bottomRow = Array(bottomRowCount).fill(0);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto px-2 md:px-0 lg:order-2">
      <div className="flex flex-col justify-between w-full gap-4 sm:gap-8 animate-pulse">
        <div className="flex flex-wrap sm:flex-nowrap gap-4 justify-center w-full">
          {topRow.map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center flex-1 min-w-[100px]"
            >
              <div className="relative mb-2 flex h-40 xs:h-48 sm:h-64 w-20 xs:w-24 sm:w-32 items-center justify-center">
                <div className="absolute inset-0 bg-gray-300/50 rounded-lg" />
              </div>
              <div className="h-4 w-20 bg-gray-300/50 rounded"></div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-4 justify-center w-full">
          {bottomRow.map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center flex-1 min-w-[100px]"
            >
              <div className="relative mb-2 flex h-40 xs:h-48 sm:h-64 w-20 xs:w-24 sm:w-32 items-center justify-center">
                <div className="absolute inset-0 bg-gray-300/50 rounded-lg" />
              </div>
              <div className="h-4 w-20 bg-gray-300/50 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface BodyType {
  id: string;
  name: string;
  link_picture: string;
  penjelasan_body_shape: string;
  karakteristik: string;
}

export default function PrepareFacePage() {
  const { analysisData, setAnalysisData } = useAnalysis();

  const [allBodyTypes, setAllBodyTypes] = useState<BodyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchAllBodyShapes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(secureUrl(`/v1/body-shapes/`));

        if (response.data && response.data.length > 0) {
          setAllBodyTypes(response.data);

          if (!analysisData.body_shape_id) {
            setAnalysisData((prev) => ({
              ...prev,
              bodyType: response.data[0].id,
              body_shape_id: response.data[0].id,
            }));
          }
        } else {
          setError("Tidak ada data bentuk tubuh yang ditemukan.");
        }
      } catch (err) {
        setError("Gagal memuat data bentuk tubuh. Silakan coba lagi nanti.");
        console.error("Fetch error in PrepareFacePage:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBodyShapes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectBodyType = (typeId: string) => {
    setAnalysisData((prev) => ({
      ...prev,
      body_shape_id: typeId,
    }));
  };

  const handleNext = () => {
    router.push(`/analyze/take-face`);
  };

  const handleShowOverlay = () => setShowOverlay(true);
  const handleCloseOverlay = () => setShowOverlay(false);

  const selectedTypeId = analysisData.body_shape_id;
  const selectedType = allBodyTypes.find((type) => type.id === selectedTypeId);

  const topRow = allBodyTypes.slice(0, Math.ceil(allBodyTypes.length / 2));
  const bottomRow = allBodyTypes.slice(Math.ceil(allBodyTypes.length / 2));

  // Responsive image sizes
  const bodyImageWidth = 100;
  const bodyImageHeight = 220;
  const bodyImageClass =
    "w-[70px] h-[140px] xs:w-[80px] xs:h-[180px] sm:w-[100px] sm:h-[220px] object-contain";

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFC6C6] text-red-500">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen w-full p-2 sm:p-3 flex flex-col items-center justify-center relative bg-[url('/login-bg.png')] bg-cover bg-center">
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

      {showOverlay && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-2 sm:p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseOverlay}
          />
          <div className="relative bg-white/90 rounded-2xl shadow-xl p-4 sm:p-8 max-w-md w-full">
            <div className="flex justify-end">
              <Button
                onClick={handleCloseOverlay}
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
                width={100}
                height={100}
                className="mb-4"
              />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 text-center">
                Scan Wajah Kamu
              </h2>
              <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">
                Fitur scan wajah akan segera tersedia! <br /> Nantikan update
                dari kami.
              </p>
              <Button
                onClick={handleCloseOverlay}
                className="bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl px-6 py-2 transition-colors"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-center justify-center">
          <div className="flex flex-col gap-8">
            <LeftSideSection
              currentStep={3}
              title="Pilih Bentuk Tubuh Kamu"
              description="Dengan mengetahui bentuk tubuhmu, kami bisa memberikan rekomendasi pakaian yang sesuai dengan proporsi tubuhmu"
            />
          </div>

          {isLoading ? (
            <BodyTypeSkeleton
              count={allBodyTypes.length > 0 ? allBodyTypes.length : 6}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto px-2 md:px-0 lg:order-2">
              <div className="flex flex-col justify-between w-full gap-4 sm:gap-8">
                {/* Responsive: grid on mobile, flex-row on sm+ */}
                <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4 justify-center w-full">
                  {topRow.map((type) => (
                    <Button
                      key={type.id}
                      type="button"
                      onClick={() => handleSelectBodyType(type.id)}
                      className="focus:outline-none p-0 bg-transparent hover:bg-transparent h-auto flex-1 min-w-[90px] max-w-[120px]"
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative mb-2 flex h-36 xs:h-40 sm:h-64 w-16 xs:w-20 sm:w-32 items-center justify-center">
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
                          />
                        </div>
                        <p
                          className={`${
                            selectedTypeId === type.id
                              ? "text-gray-800 font-bold"
                              : "text-gray-500"
                          } text-xs sm:text-sm text-center`}
                        >
                          {type.name}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4 justify-center w-full">
                  {bottomRow.map((type) => (
                    <Button
                      key={type.id}
                      type="button"
                      onClick={() => handleSelectBodyType(type.id)}
                      className="focus:outline-none p-0 bg-transparent hover:bg-transparent h-auto flex-1 min-w-[90px] max-w-[120px]"
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative mb-2 flex h-36 xs:h-40 sm:h-64 w-16 xs:w-20 sm:w-32 items-center justify-center">
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
                          />
                        </div>
                        <p
                          className={`${
                            selectedTypeId === type.id
                              ? "text-gray-800 font-bold"
                              : "text-gray-500"
                          } text-xs sm:text-sm text-center`}
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

          {/* Kolom Kanan - Detail Pilihan (Dinamis dari API) */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl py-6 sm:py-8 px-2 sm:px-3 w-full max-w-xs md:max-w-sm mx-auto flex flex-col justify-between items-center lg:order-3 mt-6 lg:mt-0">
            {isLoading || !selectedType ? (
              <div className="w-full animate-pulse">
                <div className="h-10 sm:h-12 w-3/4 bg-gray-300/70 rounded mb-4 sm:mb-6"></div>
                <div className="flex justify-center mb-6 sm:mb-8">
                  <div className="w-12 sm:w-16 h-20 sm:h-24 bg-gray-300/70 rounded-md"></div>
                </div>
                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <div className="h-4 w-full bg-gray-300/70 rounded"></div>
                  <div className="h-4 w-full bg-gray-300/70 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-300/70 rounded"></div>
                </div>
                <div className="mb-6 sm:mb-8">
                  <div className="h-5 sm:h-6 w-1/2 bg-gray-300/70 rounded mb-3 sm:mb-4"></div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="h-4 w-full bg-gray-300/70 rounded"></div>
                    <div className="h-4 w-full bg-gray-300/70 rounded"></div>
                  </div>
                </div>
                <div className="w-full h-12 sm:h-14 bg-gray-400/70 rounded-xl mt-4"></div>
              </div>
            ) : (
              <>
                <div className="w-full">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 font-oswald text-left">
                    {selectedType.name}
                  </h2>
                  <div className="flex justify-center mb-6 sm:mb-8">
                    <Image
                      src={selectedType.link_picture}
                      alt={`${selectedType.name} body type`}
                      width={60}
                      height={90}
                      className="w-auto h-20 sm:h-24 object-contain"
                    />
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed text-left">
                    {selectedType.penjelasan_body_shape}
                  </p>
                  <div className="mb-6 sm:mb-8">
                    <h3 className="font-bold text-gray-800 mb-2 sm:mb-3 text-left">
                      Karakteristik
                    </h3>
                    <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600 text-left">
                      {selectedType.karakteristik
                        .split("-")
                        .filter((char: string) => char.trim() !== "")
                        .map((char: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 sm:mr-3 text-gray-500">
                              •
                            </span>
                            <span>{char.trim()}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                <Button
                  className="w-full bg-[#323232] text-center text-white rounded-xl py-2 sm:py-3 px-4 sm:px-6 font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 sm:gap-4 mt-4"
                  onClick={handleNext}
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
