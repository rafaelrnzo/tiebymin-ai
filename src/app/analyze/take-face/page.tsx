"use client";
import LeftSideSection from "@/components/component-login/left-side-section";
import { ErrorModal } from "@/components/sections/error-modal";
import { Button } from "@/components/ui/button";
import { Camera, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { secureUrl } from "@/lib/api";
import axios from "axios";

// HELPER HOOK: (Tidak ada perubahan)
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      const listener = () => setMatches(media.matches);
      window.addEventListener("resize", listener);
      return () => window.removeEventListener("resize", listener);
    }
  }, [matches, query]);
  return matches;
};

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

export default function FaceScanPrepPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Data untuk stepper mobile
  const steps = [
    { number: "01", title: "Buat Akun", active: false },
    { number: "02", title: "Lengkapi Data", active: false },
    { number: "03", title: "Analisa", active: true },
  ];

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

  const handleFullAnalysis = async (
    imageBlobFromGallery: Blob | null = null,
    imageNameFromGallery: string | null = null
  ) => {
    try {
      // Get analysis data from localStorage
      const storedData = localStorage.getItem("tiebymin-analysis-data");
      if (!storedData) {
        setErrorModalMessage(
          "Data analisis tidak ditemukan. Silakan kembali ke halaman analisis dan lengkapi data Anda."
        );
        setIsErrorModalOpen(true);
        return;
      }

      const analysisData = JSON.parse(storedData);
      const { tinggi, berat, umur, body_shape_id } = analysisData;

      // Validate required data
      if (!tinggi || !berat || !umur || !body_shape_id) {
        setErrorModalMessage(
          "Data analisis tidak lengkap. Silakan kembali dan lengkapi data Anda."
        );
        setIsErrorModalOpen(true);
        return;
      }

      console.log("MENYIAPKAN DATA UNTUK ANALISIS:", {
        tinggi,
        berat,
        umur,
        body_shape_id,
        foto_wajah: imageBlobFromGallery
          ? "ada dari galeri"
          : "ada dari kamera",
      });

      let imageToUpload: Blob | null = null;
      let imageFileName: string = "face-photo.png";

      if (imageBlobFromGallery && imageNameFromGallery) {
        imageToUpload = imageBlobFromGallery;
        imageFileName = imageNameFromGallery;
      }

      if (!imageToUpload) {
        setErrorModalMessage("Informasi tidak lengkap. Foto tidak ditemukan.");
        setIsErrorModalOpen(true);
        return;
      }

      // Get user ID
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setErrorModalMessage("User ID tidak ditemukan. Mohon login kembali.");
        setIsErrorModalOpen(true);
        return;
      }

      // Prepare form data for analysis
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("tinggi_badan", tinggi);
      formData.append("berat_badan", berat);
      formData.append("umur", umur);
      formData.append("body_shape_id", body_shape_id);
      formData.append("foto_wajah", imageToUpload, imageFileName);

      // Call analysis API
      const endpoint = secureUrl("/v1/analysis/full-analysis");
      console.log("Calling analysis API endpoint:", endpoint);

      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        const resultId = response.data.analysis_result_id;

        if (resultId) {
          console.log("Analysis completed successfully, result ID:", resultId);
          // Store result ID for later use
          localStorage.setItem("analysisResultId", resultId);

          // Convert selected image to base64 and store it
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64Image = e.target?.result as string;
            localStorage.setItem("uploadedFaceImage", base64Image);
            localStorage.setItem("uploadedFaceImageName", selectedFile!.name);

            // Reset loading state and redirect to open-camera with gallery flag
            setIsAnalyzing(false);
            router.push(
              "/analyze/open-camera?fromGallery=true&skipCamera=true"
            );
          };
          reader.readAsDataURL(selectedFile!);
        } else {
          throw new Error("Gagal mendapatkan ID hasil analisis.");
        }
      } else {
        throw new Error(
          response.data?.message ||
            "Terjadi kesalahan saat menghubungi server. Silakan coba lagi."
        );
      }
    } catch (error) {
      console.error("Analysis error:", error);
      const err = error as Error;
      setErrorModalMessage(
        err.message ||
          "Terjadi kesalahan saat memulai analisis. Silakan coba lagi."
      );
      setIsErrorModalOpen(true);
      setIsAnalyzing(false); // Reset loading state on error
    }
  };

  const handleProceedToCamera = () => {
    if (!selectedFile) {
      setErrorModalMessage("Tidak ada file yang dipilih.");
      setIsErrorModalOpen(true);
      return;
    }

    // Set loading state and perform API analysis first, then redirect
    setIsAnalyzing(true);
    handleFullAnalysis(selectedFile, selectedFile.name);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[url('/login-bg.png')] bg-cover bg-center">
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

      {isDesktop ? (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-center">
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
                  className="bg-transparent border border-[#323232] rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-between text-center space-y-3 sm:space-y-4"
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
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "100%",
                      }}
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
      ) : (
        <div className="w-full mx-auto flex flex-col h-full">
          <LeftSideSection steps={steps} currentStepNumber={3} />
          <div className="bg-white lg:h-full rounded-2xl shadow-lg p-6 mt-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-oswald font-bold">
                Siapkan Wajahmu
              </h2>
              <div className="flex items-center py-3 gap-2 bg-[#EF789B] rounded-full px-4 shadow-md">
                <span className="text-sm font-bold text-white font-poppins">
                  AI Powered
                </span>
                <Image
                  src="/stars.png"
                  alt="stars"
                  width={16}
                  height={16}
                  className="sparkle-animation text-white fill-white"
                />
              </div>
            </div>

            {/* First row: Two cards side by side */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {INSTRUCTION_CARDS.slice(0, 2).map((card, index) => (
                <div
                  key={index}
                  className="bg-transparent border border-[#323232] rounded-2xl p-3 flex flex-col items-center justify-between text-center space-y-2"
                >
                  <h3 className="font-poppins font-bold text-sm text-gray-800">
                    {card.title}
                  </h3>
                  <div className="h-10 w-10 flex items-center justify-center mb-1">
                    <Image
                      src={card.icon}
                      alt={`${card.title} icon`}
                      width={32}
                      height={32}
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "100%",
                      }}
                    />
                  </div>

                  <p className="font-poppins text-xs text-gray-700 leading-snug">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Second row: Full width card */}
            <div className="w-full my-[20px]">
              {INSTRUCTION_CARDS.slice(2, 3).map((card, index) => (
                <div
                  key={index}
                  className="bg-transparent border border-[#323232] rounded-2xl p-4 flex flex-col items-center justify-between text-center space-y-3"
                >
                  <h3 className="font-poppins font-bold text-base text-gray-800">
                    {card.title}
                  </h3>
                  <div className="h-14 w-14 flex items-center justify-center mb-2">
                    <Image
                      src={card.icon}
                      alt={`${card.title} icon`}
                      width={48}
                      height={48}
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "100%",
                      }}
                    />
                  </div>

                  <p className="font-poppins text-sm text-gray-700 leading-snug">
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
                className="bg-[#323232] text-white rounded-lg w-full py-4 px-6 font-semibold text-base hover:bg-[#EF789B] transition-colors flex items-center justify-center gap-3"
                onClick={handleTakePhoto}
              >
                <Camera className="size-[20px] fill-white text-[#323232]" />
                <span className="text-sm font-poppins">
                  Ambil Foto Sekarang
                </span>
              </Button>
              <Button
                className="group bg-transparent border border-[#323232] text-[#323232] rounded-lg w-full py-4 px-6 font-semibold text-base hover:bg-[#EF789B] hover:text-white hover:border-[#EF789B] transition-colors flex items-center justify-center gap-3"
                onClick={handleUploadFromGallery}
              >
                <ImageIcon className="transition-colors group-hover:text-white size-[20px]" />
                <span className="text-sm font-poppins">Upload dari Galeri</span>
              </Button>
            </div>

            {/* Privacy Policy Checkbox */}
            <div className="mt-4 flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy-policy"
                className="mt-1 w-4 h-4 text-[#EF789B] bg-gray-100 border-gray-300 rounded focus:ring-[#EF789B] focus:ring-2"
              />
              <label
                htmlFor="privacy-policy"
                className="text-xs text-gray-600 leading-relaxed mt-1 mb-14"
              >
                Saya menyetujui
                <button className="text-[#EF789B] hover:text-pink-600 underline font-medium">
                  Kebijakan Privasi
                </button>
                dan
                <button className="text-[#EF789B] hover:text-pink-600 underline font-medium">
                  Syarat & Ketentuan
                </button>
                yang berlaku
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Upload */}
      {selectedImage && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#323232]/50 backdrop-blur-lg">
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
            <ErrorModal
              isOpen={isErrorModalOpen}
              onClose={() => setIsErrorModalOpen(false)}
              errorMessage={errorModalMessage}
            />
            <div className="w-full flex flex-col gap-3">
              <Button
                onClick={handleReselect}
                className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100"
              >
                Ganti Gambar
              </Button>
              <Button
                onClick={handleProceedToCamera}
                disabled={isAnalyzing}
                className="w-full py-3 px-4 bg-[#FFC6C6] text-[#323232] font-bold rounded-xl hover:bg-pink-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#323232]"></div>
                    Menganalisa...
                  </>
                ) : (
                  "Mulai Analisa"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
