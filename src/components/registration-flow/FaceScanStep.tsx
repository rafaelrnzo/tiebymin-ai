"use client";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Camera, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import { ErrorModal } from "../sections/error-modal";

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

interface FaceScanStepProps {
  onComplete: () => void;
}

export default function FaceScanStep({ onComplete }: FaceScanStepProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isChecked, setIsChecked] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  // Store data and redirect to camera/gallery
  const handleProceedToAnalysis = () => {
    // Convert selected image to base64 and store it
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        localStorage.setItem("uploadedFaceImage", e.target?.result as string);
        // Redirect to open-camera page with loading animation
        router.push(`/analyze/open-camera?fromGallery=true&skipCamera=true`);
      };
      reader.onerror = (error) => {
        console.error("Error converting image to base64:", error);
        setErrorModalMessage("Gagal memproses gambar. Silakan coba lagi.");
        setIsErrorModalOpen(true);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleTakePhoto = () => {
    router.push(`/analyze/open-camera`);
  };

  const handleUploadFromGallery = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
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

  const handleProceedToCamera = () => {
    if (!selectedFile) {
      setErrorModalMessage("Tidak ada file yang dipilih.");
      setIsErrorModalOpen(true);
      return;
    }

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

    // Store data and proceed (userId will be set when analysis result is fetched)
    handleProceedToAnalysis();
  };

  return (
    <div className="w-full lg:flex-1 pl-0 xl:pl-[100px]">
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
        <div className="lg:min-h-full min-h-[73vh] backdrop-blur-sm border-0 py-6 px-4 sm:py-8 sm:px-5 md:py-10 md:px-8 lg:px-10 w-full lg:col-span-2 lg:order-2 flex flex-col items-center lg:items-start mt-10 lg:mt-12">
          <div className="w-full flex justify-between items-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-oswald font-bold text-[#333333] text-center lg:text-left">
              Siapkan Wajahmu
            </h1>
            <div className="hidden sm:flex items-center gap-2 bg-[#EF789B] rounded-full px-4 py-2 shadow-md">
              <span className="text-md font-bold text-[#f0f0f0] font-poppins">
                AI Powered
              </span>
              <Image
                src="/stars.png"
                alt="stars"
                width={20}
                height={20}
                className="sparkle-animation text-[#f0f0f0] fill-[#f0f0f0]"
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
          <div className="w-full space-y-6">
            <div className="space-y-4">
              <button
                className="bg-[#323232] text-[#f0f0f0] rounded-lg w-full py-4 px-8 font-semibold text-base sm:text-lg hover:bg-[#EF789B] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#323232]"
                onClick={handleTakePhoto}
                disabled={!isChecked}
              >
                <Camera className="size-[26px] fill-[#f0f0f0] text-[#323232]" />
                <span className="text-[16px] font-poppins">
                  Ambil Foto Sekarang
                </span>
              </button>
              <button
                className="group bg-transparent border border-[#323232] text-[#323232] rounded-lg w-full py-4 px-8 font-semibold text-base sm:text-lg hover:bg-[#EF789B] hover:text-[#f0f0f0] hover:border-[#EF789B] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#323232] disabled:hover:border-[#323232]"
                onClick={handleUploadFromGallery}
                disabled={!isChecked}
              >
                <ImageIcon className="transition-colors group-hover:text-[#f0f0f0] size-[26px]" />
                <span className="text-[16px] font-poppins">
                  Upload dari Galeri
                </span>
              </button>
            </div>

            {/* Privacy Policy Section - Improved Layout */}
            <div className="flex items-center justify-center ">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="privacy-policy"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                  // Styling untuk checkbox agar lebih terlihat
                  className="h-5 w-5 cursor-pointer rounded border-gray-400 bg-gray-100 text-blue-600 accent-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="privacy-policy"
                  // Menerapkan font Poppins dan warna dinamis berdasarkan state isChecked
                  className={`font-poppins cursor-pointer select-none text-base ${
                    isChecked ? "text-[#323232]/50" : "text-[#323232]"
                  } transition-colors`}
                >
                  Saya telah membaca dan menyetujui{" "}
                  <a
                    href="/kebijakan-privasi"
                    className="font-semibold underline hover:text-blue-600"
                  >
                    Kebijakan Privasi
                  </a>
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#f0f0f0] lg:min-h-full min-h-[73vh] backdrop-blur-sm shadow-xl rounded-t-2xl lg:rounded-2xl border-0 py-6 px-4 sm:py-8 sm:px-5 md:py-10 md:px-8 lg:px-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-oswald font-bold">
              Siapkan Wajahmu
            </h2>
            <div className="flex items-center py-3 gap-2 bg-[#EF789B] rounded-full px-4 shadow-md">
              <span className="text-sm font-bold text-[#f0f0f0] font-poppins">
                AI Powered
              </span>
              <Image
                src="/stars.png"
                alt="stars"
                width={16}
                height={16}
                className="sparkle-animation text-[#f0f0f0] fill-[#f0f0f0]"
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
            <button
              className="bg-[#323232] text-[#f0f0f0] rounded-lg w-full py-4 px-6 font-semibold text-base hover:bg-[#EF789B] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#323232]"
              onClick={handleTakePhoto}
              disabled={!isChecked}
            >
              <Camera className="size-[20px] fill-[#f0f0f0] text-[#323232]" />
              <span className="text-sm font-poppins">Ambil Foto Sekarang</span>
            </button>
            <button
              className="group bg-transparent border border-[#323232] text-[#323232] rounded-lg w-full py-4 px-6 font-semibold text-base hover:bg-[#EF789B] hover:text-[#f0f0f0] hover:border-[#EF789B] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#323232] disabled:hover:border-[#323232]"
              onClick={handleUploadFromGallery}
              disabled={!isChecked}
            >
              <ImageIcon className="transition-colors group-hover:text-[#f0f0f0] size-[20px]" />
              <span className="text-sm font-poppins">Upload dari Galeri</span>
            </button>
          </div>

          {/* Privacy Policy Checkbox */}
          <div className="flex items-center justify-center mt-5">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="privacy-policy"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                // Styling untuk checkbox agar lebih terlihat
                className="h-5 w-5 cursor-pointer rounded border-gray-400 bg-gray-100 text-blue-600 accent-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="privacy-policy"
                // Menerapkan font Poppins dan warna dinamis berdasarkan state isChecked
                className={`font-poppins cursor-pointer select-none text-base ${
                  isChecked ? "text-[#323232]/50" : "text-[#323232]"
                } transition-colors`}
              >
                Saya telah membaca dan menyetujui{" "}
                <a
                  href="/kebijakan-privasi"
                  className="font-semibold underline hover:text-blue-600"
                >
                  Kebijakan Privasi
                </a>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Upload */}
      {selectedImage && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#323232]/50 backdrop-blur-lg">
          <div className="bg-[#f0f0f0] rounded-2xl p-6 shadow-2xl w-full max-w-sm text-center flex flex-col items-center mx-4">
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
                className="w-full py-3 px-4 bg-[#FFC6C6] text-[#323232] font-bold rounded-xl hover:bg-pink-300 flex items-center justify-center gap-2"
              >
                Mulai Analisa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
