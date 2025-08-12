"use client";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/AnalysisContext";
import url from "@/lib/url";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

// --- Komponen Utama ---
interface BodyType {
  id: string;
  name: string;
  link_picture: string;
  penjelasan_body_shape: string;
  karakteristik: string;
}

export default function PrepareFacePage() {
  const { analysisData, setAnalysisData } = useAnalysis();

  const [allBodyTypes, setAllBodyTypes] = useState<BodyType[]>([]); // Menyimpan semua data bentuk tubuh dari API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false); // Untuk modal "Scan Wajah"

  const router = useRouter();

  // useEffect untuk mengambil semua data bentuk tubuh dari API saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchAllBodyShapes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulasi delay untuk melihat skeleton
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const response = await axios.get(`${url}/v1/body-shapes/`);

        if (response.data && response.data.length > 0) {
          setAllBodyTypes(response.data);

          // Jika belum ada pilihan bentuk tubuh di context, set pilihan default
          // Pilihan default diambil dari item pertama yang diterima dari API
          if (!analysisData.body_shape_id) {
            setAnalysisData((prev) => ({
              ...prev,
              bodyType: response.data[0].id, // Set bodyType untuk seleksi awal
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
  }, []); // Dependency array kosong agar hanya berjalan sekali saat mount

  // Fungsi untuk mengubah pilihan bentuk tubuh di context
  const handleSelectBodyType = (typeId: string) => {
    setAnalysisData((prev) => ({
      ...prev,
      body_shape_id: typeId,
    }));
  };

  // Navigasi ke halaman selanjutnya
  const handleNext = () => {
    router.push(`/analyze/take-face`);
  };

  const handleShowOverlay = () => setShowOverlay(true);
  const handleCloseOverlay = () => setShowOverlay(false);

  // --- Variabel turunan untuk mempermudah rendering ---
  const selectedTypeId = analysisData.body_shape_id;
  const selectedType = allBodyTypes.find((type) => type.id === selectedTypeId);

  // Membagi data secara dinamis untuk tampilan dua baris
  const topRow = allBodyTypes.slice(0, Math.ceil(allBodyTypes.length / 2));
  const bottomRow = allBodyTypes.slice(Math.ceil(allBodyTypes.length / 2));

  const bodyImageWidth = 100;
  const bodyImageHeight = 220;
  const bodyImageClass =
    "w-[80px] h-[180px] sm:w-[100px] sm:h-[220px] object-contain";

  // --- Tampilan Error ---
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-100 text-red-500">
        <p>{error}</p>
      </div>
    );

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

      {/* Overlay Scan Wajah (Modal) */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseOverlay}
          />
          <div className="relative bg-white/90 rounded-2xl shadow-xl p-8 max-w-md w-full">
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
                width={120}
                height={120}
                className="mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Scan Wajah Kamu
              </h2>
              <p className="text-gray-600 text-center mb-4">
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
            <Button
              className="w-full border-gray-600/60 border backdrop-blur-sm rounded-lg px-6 py-5 flex items-center justify-between hover:bg-white/80 transition-colors max-w-xs mx-auto"
              onClick={handleShowOverlay}
            >
              <span className="text-gray-700 font-medium">Scan Wajah Kamu</span>
              <div className="w-6 h-6 rounded flex items-center justify-center">
                <Image
                  src="/stars.png"
                  alt="stars"
                  width={20}
                  height={20}
                  style={{ filter: "brightness(0) saturate(100%)" }}
                />
              </div>
            </Button>
          </div>

          {/* Kolom Tengah - Pilihan Bentuk Tubuh (Dinamis dari API) */}
          {isLoading ? (
            <BodyTypeSkeleton />
          ) : (
            <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto px-2 md:px-0 lg:order-2">
              <div className="flex flex-col justify-between w-full gap-8">
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

          {/* Kolom Kanan - Detail Pilihan (Dinamis dari API) */}
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
