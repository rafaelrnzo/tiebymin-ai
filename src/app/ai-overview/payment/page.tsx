"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

interface PricingCardProps {
  isFeatured: boolean;
  tag: string;
  price: string;
  originalPrice: string;
  description: string;
  features: string[];
  onButtonClick: () => void;
}

const PricingCard = ({
  isFeatured,
  tag,
  price,
  originalPrice,
  description,
  features,
  onButtonClick,
}: PricingCardProps) => (
  <motion.div
    layout
    transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
    className={`w-full rounded-2xl p-8 flex flex-col ${
      isFeatured
        ? "bg-gradient-to-r from-[#FF7EA4] to-[#FFA2BD] text-white scale-105 z-10 shadow-2xl"
        : "bg-white border border-gray-300 text-[#323232] scale-95 opacity-80"
    }`}
  >
    <div className="flex items-center gap-4">
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
          fill={isFeatured ? "white" : "#323232"}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.5392 10.9315C13.9817 10.7503 12.4461 12.639 12.4829 14.7606C12.5197 16.8823 14.4275 18.576 16.5392 18.4986C18.5749 18.424 19.9501 16.6752 19.9501 14.7606C19.9501 12.846 19.0966 11.1127 16.5392 10.9315ZM14.9719 14.7606C15.0584 13.756 15.7043 12.8718 16.7235 12.8461C17.7672 12.8197 18.4908 13.7309 18.5673 14.7606C18.654 15.9299 17.7153 17.1406 16.5392 16.9943C15.474 16.8619 14.8809 15.8185 14.9719 14.7606Z"
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
  const [step, setStep] = useState("selection"); // 'selection' atau 'payment'
  const [plan, setPlan] = useState("promo");
  const [selectedMethod, setSelectedMethod] = useState("Bank Central Asia");

  const handleProceedToPayment = () => {
    setStep("payment");
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
    <div className="bg-gray-100 min-h-screen w-full font-poppins text-[#323232] flex flex-col p-4 sm:p-8">
      <div className="w-full max-w-screen-xl lg:mx-[200px]">
        {/* Header */}
        <header className="flex items-center mt-[100px] mb-[50px] gap-4">
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
          <Image src="/tie-by-min-logo.png" alt="Logo" width={99} height={40} />
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
              <div className="flex flex-col gap-[30px] lg:w-2/5 px-4">
                <div className="flex flex-col gap-3">
                  <h1 className="text-5xl lg:text-6xl font-bold font-oswald mb-6">
                    Lihat lengkap
                  </h1>
                  <h1 className="text-5xl lg:text-6xl font-bold font-oswald mb-6">
                    hasil Analisis AI
                  </h1>
                </div>
                <div className="flex items-center border rounded-full max-w-xs mb-6">
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
                <p className="text-gray-600 text-xl leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor.
                </p>
              </div>

              {/* Kolom Kanan: Kartu Harga */}
              <motion.div
                layout
                className="lg:w-3/5 flex flex-col sm:flex-row gap-6 items-center justify-center"
              >
                {plan === "promo" ? (
                  <>
                    <PricingCard
                      key="promo"
                      {...promoPlan}
                      isFeatured={true}
                      onButtonClick={handleProceedToPayment}
                    />
                    <PricingCard
                      key="normal"
                      {...normalPlan}
                      isFeatured={false}
                      onButtonClick={handleProceedToPayment}
                    />
                  </>
                ) : (
                  <>
                    <PricingCard
                      key="normal"
                      {...normalPlan}
                      isFeatured={false}
                      onButtonClick={handleProceedToPayment}
                    />
                    <PricingCard
                      key="promo"
                      {...promoPlan}
                      isFeatured={true}
                      onButtonClick={handleProceedToPayment}
                    />
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
              className="flex w-full"
            >
              <div className="p-8 rounded-2xl flex flex-col w-full">
                <h2 className="text-2xl font-bold mb-6">Detail Pembayaran</h2>
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder="masukan kode promo"
                    className="flex-grow border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF789B]"
                  />
                  <button className="bg-[#323232] text-white font-semibold px-6 rounded-lg hover:bg-black">
                    Gunakan
                  </button>
                </div>
                <div className="space-y-3 text-sm flex-grow">
                  <div className="flex justify-between">
                    <p>Pembelian produk - Tiebymin AI Premium</p>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <p>Subtotal</p>
                    <p>Rp 16,000</p>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <p>Diskon Pesanan</p>
                    <p>-Rp 6,000</p>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t flex justify-between items-center bg-[#EF789B] text-white p-4 rounded-lg">
                  <span className="font-semibold">Total Pembayaran</span>
                  <span className="text-2xl font-bold">Rp 10,000</span>
                </div>
              </div>
              <div className="border-l border-[#323232]"></div>
              <div className="p-8 rounded-2xl flex flex-col w-full">
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
                <button className="w-full mt-8 bg-[#323232] text-white font-semibold py-4 rounded-lg hover:bg-black">
                  Bayar Sekarang
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
