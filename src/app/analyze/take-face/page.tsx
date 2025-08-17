"use client";
import LeftSideSection from "@/components/component-login/left-side-section";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/AnalysisContext";
import { useAllTips } from "@/hooks/useAllTips";
import { useAnalysisData } from "@/hooks/useAnalysisData";
import { secureUrl } from "@/lib/api";
import { sendEmail } from "@/lib/utils";
import axios from "axios";
import { Camera, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const INSTRUCTION_CARDS = [
  {
    title: "Lepaskan Kacamata",
    description: "Lepaskan Kacamata Kamu Supaya Wajah Terlihat Jelas",
    icon: "/vector/kacamata.svg",
  },
  {
    title: "Hapus Makeup",
    description: "Hapus Makeup Agar AI Menganalisa Kulit Kamu Yang Natural",
    icon: "/vector/perempuan.svg",
  },
  {
    title: "Pencahayaan Terang",
    description: "Ambil Gambar Dengan Pencahayaan Yang Terang Natural",
    icon: "/vector/sun.svg",
  },
];

const AnalysisIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2a10 10 0 1 0 10 10c0-4.42-2.87-8.17-6.84-9.5c-.52-.17-1.04.22-1 .75c.03.35.25.65.57.8c2.32.93 3.97 3.19 3.97 5.95a6 6 0 1 1-7.23-5.45c.4-.19.68-.59.59-1.03c-.1-0.44-.52-.75-.97-.63C5.66 3.6 2 7.4 2 12a10 10 0 0 0 10 10z" />{" "}
    <path d="m15.58 12.5-1.08-2.5-2.5-1.08 1.08-2.5 2.5-1.08 1.08 2.5 2.5 1.08-1.08 2.5-2.5 1.08z" />{" "}
    <path d="m6.5 12.5-1-2-2-1 1-2 2-1 1 2 2 1-1 2-2 1z" />
  </svg>
);

const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-800"></div>
);

export default function FaceScanPrepPage() {
  const router = useRouter();
  const { analysisData } = useAnalysis();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [analysisResultId, setAnalysisResultId] = useState<string | null>(null);
  const { data: analysisHookData } = useAnalysisData(analysisResultId);
  const { data: allTipsData } = useAllTips({
    analysisData: analysisHookData?.rawAnalysisData,
    enabled: !!analysisHookData?.rawAnalysisData,
  });

  useEffect(() => {
    if (analysisResultId && analysisHookData?.userData && allTipsData) {
      router.push(`/ai-overview?result_id=${analysisResultId}`);
    }
  }, [analysisResultId, analysisHookData, allTipsData, router]);

  const handleTakePhoto = () => {
    router.push(`/analyze/open-camera`);
  };

  const handleUploadFromGallery = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      event.target.value = "";
    }
  };

  const handleReselect = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    handleUploadFromGallery(); // Langsung buka galeri lagi
  };

  const handleAnalyzeFromGallery = async () => {
    if (!selectedFile) {
      setApiError("Tidak ada file yang dipilih.");
      return;
    }

    const { tinggi, berat, umur, body_shape_id } = analysisData;
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setApiError("User ID not found. Please log in again.");
      return;
    }
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("tinggi_badan", tinggi);
    formData.append("berat_badan", berat);
    formData.append("umur", umur);
    formData.append("body_shape_id", body_shape_id);
    formData.append("foto_wajah", selectedFile, selectedFile.name);

    setIsApiLoading(true);
    setApiError("");

    try {
      const response = await axios.post(
        secureUrl(`/v1/analysis/full-analysis`),
        formData
      );
      if (response.status >= 200 && response.status < 300) {
        const resultId = response.data.analysis_result_id;
        if (resultId) {
          setAnalysisResultId(resultId);
        } else {
          throw new Error("API berhasil tapi tidak mengembalikan result ID.");
        }
      } else {
        throw new Error(
          response.data?.message || `HTTP error! status: ${response.status}`
        );
      }
    } catch (error) {
      const err = error as Error;

      console.error("API Error:", err);
      setApiError(err.message || "Terjadi kesalahan saat menghubungi server.");
    } finally {
      setIsApiLoading(false);
      setSelectedImage(null); // Tutup modal setelah selesai
      setSelectedFile(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[url('/login-bg.png')] px-4 py-6 sm:p-8 flex items-center justify-center font-sans">
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

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-1 lg:order-1">
          <LeftSideSection
            currentStep={3}
            title="Scan Wajah Kamu"
            description="Kami butuh foto selfie-mu biar bisa analisis bentuk wajah dan warna kulit dengan akurat. Dengan begitu, rekomendasi hijab yang kami kasih bisa lebih sesuai."
          />
        </div>

        {/* Right Column - Instructions */}
        <div className="w-full lg:col-span-2 lg:order-2 flex flex-col items-center lg:items-start mt-10 lg:mt-12">
          <div className="w-full flex justify-between items-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-oswald font-bold text-[#333333] text-center lg:text-left">
              Siapkan Wajahmu
            </h1>
            <div className="hidden sm:flex items-center gap-2 bg-[#EF789B] rounded-full px-4 py-2 shadow-md">
              <span className="text-md font-bold text-white font-poppins">
                AI Powered
              </span>
              <Image
                src="/stars.png"
                alt="stars"
                width={20}
                height={20}
                className="sparkle-animation text-white fill-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full mb-8 sm:mb-12">
            {INSTRUCTION_CARDS.map((card, index) => (
              <div
                key={index}
                className="bg-transparent border border-black rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-between text-center space-y-3 sm:space-y-4"
              >
                <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-800">
                  {card.title}
                </h3>
                <div className="h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center mb-1 sm:mb-2">
                  <Image
                    src={card.icon}
                    alt={`${card.title} icon`}
                    width={48}
                    height={48}
                    style={{ width: "auto", height: "auto", maxWidth: "100%" }}
                  />
                </div>

                <p className="font-poppins text-xs sm:text-sm text-gray-700 leading-snug">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* Input file tersembunyi */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg"
          />

          {/* Tombol Aksi */}
          <div className="w-full space-y-4">
            <Button
              className="bg-[#323232] text-white rounded-lg w-full py-6 px-8 font-semibold text-base sm:text-lg hover:bg-[#EF789B] transition-colors flex items-center justify-center gap-3"
              onClick={handleTakePhoto}
            >
              <Camera className="size-[26px] fill-white text-[#323232]" />
              <span className="text-[16px] font-poppins">
                Ambil Foto Sekarang
              </span>
            </Button>
            <Button
              className="group bg-transparent border border-[#323232] text-[#323232] rounded-lg w-full py-6 px-8 font-semibold text-base sm:text-lg hover:bg-[#EF789B] hover:text-white hover:border-[#EF789B] transition-colors flex items-center justify-center gap-3"
              onClick={handleUploadFromGallery}
            >
              <ImageIcon className="transition-colors group-hover:text-white size-[26px]" />
              <span className="text-[16px] font-poppins">
                Upload dari Galeri
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Upload */}
      {selectedImage && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-lg">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm text-center flex flex-col items-center mx-4">
            <h2 className="font-oswald text-2xl font-bold text-gray-800">
              Gunakan Gambar Ini
            </h2>
            <p className="font-poppins text-gray-500 text-sm mt-1 mb-6">
              Pastikan wajah terlihat jelas ya
            </p>
            <Image
              src={selectedImage}
              alt="Hasil Foto"
              width={400}
              height={400}
              className="rounded-lg w-full h-auto object-cover mb-6"
            />
            {apiError && (
              <p className="text-red-500 text-sm mb-4">{apiError}</p>
            )}
            <div className="w-full flex flex-col gap-3">
              <Button
                onClick={handleReselect}
                className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100"
                disabled={isApiLoading}
              >
                Pilih Ulang
              </Button>
              <Button
                onClick={handleAnalyzeFromGallery}
                className="w-full py-3 px-4 bg-[#FFC6C6] text-black font-bold rounded-xl hover:bg-pink-300 flex items-center justify-center gap-2"
                disabled={isApiLoading}
              >
                {isApiLoading ? (
                  <Spinner />
                ) : (
                  <>
                    Mulai Analisa <AnalysisIcon className="stroke-black" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
