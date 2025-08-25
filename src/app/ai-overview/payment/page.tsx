"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAnalysis } from "@/context/AnalysisContext";
import { useEffect } from "react";
import { secureUrl } from "@/lib/api";
import axios from "axios";

interface PricingCardProps {
  isFeatured: boolean;
  tag: string;
  price: string;
  originalPrice: string;
  description: string;
  features: string[];
  onButtonClick: () => void;
  className?: string;
}

const PricingCard = ({
  isFeatured,
  tag,
  price,
  originalPrice,
  description,
  features,
  onButtonClick,
  className = "",
}: PricingCardProps) => (
  <motion.div
    layout
    transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
    className={`w-full rounded-2xl p-8 flex flex-col ${className} ${
      isFeatured
        ? "bg-gradient-to-r from-[#FF7EA4] to-[#FFA2BD] text-white scale-105 z-10 shadow-2xl"
        : "bg-white border border-gray-300 text-[#323232] scale-95 opacity-80"
    }`}
  >
    <div className="flex items-center gap-4">
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* --- PERUBAHAN DI SINI --- */}
        <path
          d="M9.38266 4.81C10.1302 2.6225 13.1527 2.55625 14.0389 4.61125L14.1139 4.81125L15.1227 7.76125C15.3538 8.43779 15.7274 9.05689 16.2182 9.57678C16.709 10.0967 17.3055 10.5053 17.9677 10.775L18.2389 10.8762L21.1889 11.8838C23.3764 12.6313 23.4427 15.6537 21.3889 16.54L21.1889 16.615L18.2389 17.6238C17.5621 17.8548 16.9428 18.2283 16.4227 18.7191C15.9026 19.2099 15.4938 19.8065 15.2239 20.4688L15.1227 20.7388L14.1152 23.69C13.3677 25.8775 10.3452 25.9438 9.46016 23.89L9.38266 23.69L8.37516 20.74C8.14413 20.0632 7.77062 19.4439 7.27984 18.9238C6.78905 18.4037 6.1924 17.9949 5.53016 17.725L5.26016 17.6238L2.31016 16.6162C0.12141 15.8687 0.0551599 12.8462 2.11016 11.9612L2.31016 11.8838L5.26016 10.8762C5.9367 10.6451 6.5558 10.2715 7.07569 9.78071C7.59558 9.28993 8.00417 8.69336 8.27391 8.03125L8.37516 7.76125L9.38266 4.81ZM21.7489 0.5C21.9828 0.5 22.2119 0.565598 22.4103 0.689339C22.6088 0.813081 22.7685 0.990003 22.8714 1.2L22.9314 1.34625L23.3689 2.62875L24.6527 3.06625C24.887 3.14587 25.0925 3.29327 25.2429 3.48977C25.3934 3.68627 25.4822 3.92302 25.498 4.17003C25.5138 4.41703 25.4559 4.66316 25.3317 4.87723C25.2074 5.0913 25.0225 5.26367 24.8002 5.3725L24.6527 5.4325L23.3702 5.87L22.9327 7.15375C22.8529 7.38804 22.7054 7.59337 22.5088 7.74374C22.3122 7.89411 22.0755 7.98274 21.8285 7.9984C21.5815 8.01407 21.3354 7.95606 21.1214 7.83172C20.9074 7.70739 20.7351 7.52233 20.6264 7.3L20.5664 7.15375L20.1289 5.87125L18.8452 5.43375C18.6108 5.35413 18.4054 5.20673 18.2549 5.01023C18.1044 4.81373 18.0156 4.57698 17.9998 4.32997C17.984 4.08297 18.0419 3.83684 18.1661 3.62277C18.2904 3.4087 18.4754 3.23633 18.6977 3.1275L18.8452 3.0675L20.1277 2.63L20.5652 1.34625C20.6494 1.09928 20.8089 0.884886 21.0212 0.733124C21.2335 0.581361 21.488 0.499843 21.7489 0.5Z"
          fill={isFeatured ? "white" : "#323232"}
        />
      </svg>

      <span className="font-semibold">{tag}</span>
    </div>
    <div className="my-4">
      <span className="text-4xl font-bold">{price}</span>
      <span className="ml-2 line-through text-[#f0f0f0]/50">
        {originalPrice}
      </span>
    </div>
    <p
      className={`text-sm mb-6 h-16 ${
        isFeatured ? "text-[#f0f0f0]/50" : "text-[#323232]/30"
      }`}
    >
      {description}
    </p>
    <div className="space-y-3 mb-8">
      {features.map((feature: string, index: number) => (
        <div key={index} className="flex items-center gap-3">
          <Check
            className={
              isFeatured
                ? "text-pink-300 bg-white rounded-full w-6 h-6 p-1 font-bold"
                : "text-white bg-[#323232] rounded-full w-6 h-6 p-1 font-bold"
            }
          />
          <span className="text-sm">{feature}</span>
        </div>
      ))}
    </div>
    <button
      onClick={onButtonClick}
      className={`flex items-center justify-center gap-4 w-full mt-auto py-4 rounded-lg font-semibold transition-colors ${
        isFeatured
          ? "bg-white text-[#323232] hover:bg-gray-200"
          : "bg-[#323232] text-white hover:bg-black"
      }`}
    >
      <svg
        width="32"
        height="30"
        viewBox="0 0 32 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M27.0024 3.13645C21.242 -1.46764 18.1972 7.6494 18.1972 7.6494C18.1972 1.08512 11.1019 -1.72544 6.9055 1.08513C2.74732 3.87007 3.26438 10.3845 9.30235 13.2563C2.11185 14.5783 -3.21468 21.8263 2.24875 27.5245C8.90012 34.4616 15.0096 24.9287 16.9307 21.9311C16.9537 21.8952 16.976 21.8603 16.9978 21.8263C21.1485 29.9861 27.5056 29.9104 30.4121 25.382C36.4978 15.9003 23.1293 12.527 23.1293 12.527C23.1293 12.527 34.3547 9.01281 27.0024 3.13645ZM20.3992 13.2357C20.8831 12.952 26.0973 9.81087 23.4972 7.6494C20.3168 5.00547 17.8738 10.9771 17.8738 10.9771C17.8738 10.9771 14.509 4.05734 10.9136 6.19068C7.31831 8.32402 11.9738 13.9401 11.9738 13.9401C8.10197 14.8518 5.2844 20.2544 8.1027 22.3278C13.8654 26.5672 16.9978 19.5015 16.9978 19.5015C16.9978 19.5015 21.5605 25.9746 25.341 21.3705C29.0845 16.8114 21.6635 12.5853 20.3992 13.2357Z"
          fill={isFeatured ? "#323232" : "white"}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.5392 10.9315C13.9817 10.7503 12.4461 12.639 12.4829 14.7606C12.5197 16.8823 14.4275 18.576 16.5392 18.4986C18.5749 18.424 19.9501 16.6752 19.9501 14.7606C19.9501 12.846 19.0966 11.1127 16.5392 10.9315ZM14.9719 14.7606C15.0584 13.756 15.7043 12.8718 16.7235 12.8461C17.7672 12.8197 18.4908 13.7309 18.5673 14.7606C18.654 15.9299 17.7153 17.1406 16.5392 16.9943C15.474 16.8619 14.8809 15.8185 14.9719 14.7606Z"
          fill={isFeatured ? "#323232" : "white"}
        />
      </svg>
      Dapatkan Penawaran
    </button>
  </motion.div>
);

const promoPlan = {
  tag: "Launching Promo",
  price: "Rp10,000",
  originalPrice: "Rp16,000",
  description:
    "Dapatkan insight mendalam tentang gaya hijab terbaik untuk Anda dengan teknologi AI dari Tiebymin dan rekomendasi personal yang akurat.",
  features: [
    "Analisis Bentuk Wajah",
    "Analisis Color Tone",
    "Analisis Bentuk Tubuh",
    "Kecocokan dengan selebriti",
    "Tips dari AI untuk anda",
    "Rekomendasi produk yang sesuai",
  ],
};

const normalPlan = {
  tag: "Tiebymin AI Premium",
  price: "Rp13,000",
  originalPrice: "Rp16,000",
  description:
    "Dapatkan insight mendalam tentang gaya hijab terbaik untuk Anda dengan...",
  features: [
    "Analisis Bentuk Wajah",
    "Analisis Color Tone",
    "Analisis Bentuk Tubuh",
    "Kecocokan dengan selebriti",
    "Tips dari AI untuk anda",
    "Rekomendasi produk yang sesuai",
  ],
};

// --- Komponen Utama ---
export default function PaymentPage() {
  const router = useRouter();
  const { analysisData } = useAnalysis();
  const [step, setStep] = useState("selection"); // 'selection' atau 'payment'
  const [plan, setPlan] = useState("promo");
  const [selectedMethod, setSelectedMethod] = useState("Bank Central Asia");
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleProceedToPayment = () => {
    console.log("Proceeding to payment step");
    setStep("payment");
  };

  // Debug logging for step changes
  useEffect(() => {
    console.log("Current step:", step);
  }, [step]);

  useEffect(() => {
    console.log("Analysis data on payment page mount:", analysisData);
  }, [analysisData]);

  const handlePayNow = async () => {
    console.log("handlePayNow triggered. Current analysisData:", analysisData);
    setIsAnalysisLoading(true);
    setAnalysisError(null);

    try {
      // Simulate payment process first
      console.log("Processing payment...");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate payment delay

      // Payment successful - now proceed with analysis
      console.log("Payment successful, starting analysis...");

      // Get analysis data from context
      const { tinggi, berat, umur, body_shape_id } = analysisData;

      // Validasi data
      if (!tinggi || !berat || !umur || !body_shape_id) {
        console.error("Analysis data is incomplete:", analysisData);
        setAnalysisError(
          "Data analisis tidak lengkap. Silakan kembali dan lengkapi data Anda."
        );
        setIsAnalysisLoading(false);
        return;
      }

      console.log("Using analysis data:", {
        tinggi,
        berat,
        umur,
        body_shape_id,
      });

      // Get user ID
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setAnalysisError("User ID tidak ditemukan. Mohon login kembali.");
        setIsAnalysisLoading(false);
        return;
      }

      // Get captured image from localStorage (from camera flow)
      let capturedImage = localStorage.getItem("capturedImage");

      // If no captured image from camera, try gallery upload
      if (!capturedImage) {
        capturedImage = localStorage.getItem("uploadedFaceImage");
      }

      if (!capturedImage) {
        setAnalysisError(
          "Foto tidak ditemukan. Silakan ambil foto terlebih dahulu."
        );
        setIsAnalysisLoading(false);
        return;
      }

      // Convert base64 to blob
      const dataURLtoBlob = (dataurl: string) => {
        const arr = dataurl.split(",");
        if (arr.length < 2) return null;
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) return null;
        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      };

      const imageBlob = dataURLtoBlob(capturedImage);
      if (!imageBlob) {
        setAnalysisError("Gagal memproses gambar.");
        setIsAnalysisLoading(false);
        return;
      }

      // Prepare form data for analysis
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("tinggi_badan", tinggi);
      formData.append("berat_badan", berat);
      formData.append("umur", umur);
      formData.append("body_shape_id", body_shape_id);
      formData.append("foto_wajah", imageBlob, "face-photo.png");

      // Call analysis API
      const endpoint = secureUrl(`/v1/analysis/full-analysis`);
      console.log("Calling analysis API endpoint:", endpoint);

      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        const resultId = response.data.analysis_result_id;
        if (resultId) {
          // Clear images from localStorage
          localStorage.removeItem("capturedImage");
          localStorage.removeItem("uploadedFaceImage");
          localStorage.removeItem("uploadedFaceImageName");

          // Redirect to ai-overview with result_id
          console.log("Analysis completed, redirecting to results...");
          router.push(`/ai-overview?result_id=${resultId}`);
        } else {
          throw new Error("Proses analisis gagal. Silakan coba lagi.");
        }
      } else {
        throw new Error(
          response.data?.message ||
            "Terjadi kesalahan saat menghubungi server. Silakan coba lagi."
        );
      }
    } catch (error) {
      console.error("Payment/Analysis Error:", error);
      const err = error as Error;
      setAnalysisError(
        err.message ||
          "Terjadi kesalahan saat memproses pembayaran atau analisis. Silakan coba lagi."
      );
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const selectionVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  const paymentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full font-poppins text-[#323232] flex flex-col lg:p-4">
      <div className="w-full max-w-screen-xl lg:mx-[200px]">
        {/* Header */}
        <header className="flex items-center m-4 gap-4">
          <Link href="/">
            <button className="flex items-center gap-2 font-semibold hover:opacity-75">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#323232"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Link>
          <Image
            src="/vector/tie-by-min-logo.svg"
            alt="Logo"
            width={99}
            height={40}
          />
        </header>

        <AnimatePresence mode="wait">
          {step === "selection" ? (
            <motion.div
              key="selection"
              variants={selectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col lg:flex-row gap-8"
            >
              <div className="flex flex-col gap-[20px] lg:gap-[30px] lg:w-2/5 px-4">
                <div className="flex flex-col gap-3">
                  <h1 className="text-2xl lg:text-6xl font-bold font-oswald mb-0 lg:mb-4 sm:mb-6 whitespace-nowrap sm:whitespace-normal">
                    Lihat lengkap hasil Analisis AI
                  </h1>
                </div>
                <div className="flex items-center border rounded-full max-w-xs mb-0 lg:mb-6">
                  <button
                    onClick={() => setPlan("promo")}
                    className={`w-1/2 py-2 rounded-full text-sm font-semibold transition-colors ${
                      plan === "promo"
                        ? "bg-[#323232] text-white"
                        : "text-gray-500"
                    }`}
                  >
                    Harga Promo
                  </button>
                  <button
                    onClick={() => setPlan("normal")}
                    className={`w-1/2 py-2 rounded-full text-sm font-semibold transition-colors ${
                      plan === "normal"
                        ? "bg-[#323232] text-white"
                        : "text-gray-500"
                    }`}
                  >
                    Harga Normal
                  </button>
                </div>
                <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed">
                  Dapatkan akses penuh ke hasil analisis AI fashion yang telah
                  dipersonalisasi khusus untuk Anda.
                </p>
              </div>

              <motion.div
                layout
                className="lg:w-3/5 mx-5 flex flex-col lg:flex-row gap-6 items-center justify-center"
              >
                {plan === "promo" ? (
                  <>
                    <div className="w-full lg:w-1/2">
                      <PricingCard
                        key="promo"
                        {...promoPlan}
                        isFeatured={true}
                        onButtonClick={() => {
                          console.log("Promo plan button clicked");
                          handleProceedToPayment();
                        }}
                      />
                    </div>
                    <div className="hidden lg:block w-1/2">
                      <PricingCard
                        key="normal"
                        {...normalPlan}
                        isFeatured={false}
                        onButtonClick={handleProceedToPayment}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full lg:w-1/2 ">
                      <PricingCard
                        key="normal"
                        {...normalPlan}
                        isFeatured={false}
                        onButtonClick={() => {
                          console.log("Normal plan button clicked");
                          handleProceedToPayment();
                        }}
                      />
                    </div>
                    <div className="hidden lg:block w-1/2">
                      <PricingCard
                        key="promo"
                        {...promoPlan}
                        isFeatured={true}
                        onButtonClick={handleProceedToPayment}
                      />
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="payment"
              variants={paymentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col lg:flex-row w-full"
            >
              <div className="p-4 lg:p-8 rounded-2xl flex flex-col w-full">
                <h2 className="text-2xl font-bold mb-6 font-oswald">
                  Detail Pembayaran
                </h2>
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder="masukan kode promo"
                    className="flex-grow border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF789B]"
                  />
                  <button className="bg-[#323232] text-white font-semibold px-6 rounded-lg hover:bg-black shadow-md">
                    Gunakan
                  </button>
                </div>
                <div className="space-y-3 text-sm flex-grow">
                  <div className="flex justify-between">
                    <p>Pembelian produk - Tiebymin AI Premium</p>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <p className="font-bold text-[#323232]">Subtotal</p>
                    <p className="text-[#323232]/30">Rp 16,000</p>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <p className="font-bold text-[#323232]">Diskon Pesanan</p>
                    <p className="text-[#323232]/30">-Rp 6,000</p>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t flex justify-between items-center bg-[#EF789B] text-white p-4 rounded-lg">
                  <span className="font-semibold">Total Pembayaran</span>
                  <span className="text-2xl font-bold">Rp 10,000</span>
                </div>
              </div>
              <div className="border-t lg:border-l border-[#323232]/50 m-5 border-2 lg:my-10"></div>
              <div className="p-4 lg:p-8 rounded-2xl flex flex-col w-full">
                <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>
                <input
                  type="text"
                  placeholder="Informasi kontak"
                  className="w-full border rounded-lg px-4 py-3 text-sm mb-8 focus:outline-none focus:ring-2 focus:ring-[#EF789B]"
                />
                <h2 className="text-2xl font-bold mb-6">Metode Pembayaran</h2>
                <div className="space-y-3 flex-grow">
                  {[
                    { name: "Bank Central Asia", logo: "/bca-logo.png" },
                    { name: "Bank Mandiri", logo: "/mandiri-logo.png" },
                    { name: "Gopay", logo: "/gopay-logo.png" },
                    { name: "Ovo", logo: "/ovo-logo.png" },
                  ].map((method) => (
                    <div
                      key={method.name}
                      className={`border rounded-lg p-4 flex justify-between items-center text-sm cursor-pointer ${
                        selectedMethod === method.name
                          ? "border-[#EF789B]"
                          : "border-[#323232]/10"
                      }`}
                      onClick={() => setSelectedMethod(method.name)}
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={method.logo}
                          alt={`${method.name} logo`}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                        <label htmlFor={method.name} className="font-semibold">
                          {method.name}
                        </label>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        id={method.name}
                        className="form-radio h-5 w-5 text-[#EF789B] focus:ring-[#EF789B]"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handlePayNow}
                  disabled={isAnalysisLoading}
                  className="w-full mt-8 bg-[#323232] text-white font-semibold py-4 rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalysisLoading
                    ? "Memproses Analisis..."
                    : "Bayar Sekarang"}
                </button>
                {analysisError && (
                  <p className="mt-4 text-red-600 text-sm text-center">
                    {analysisError}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
