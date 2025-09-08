"use client";
import { useRouter } from "next/navigation";
import React from "react";

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

export default function PrivacyNoticeModal() {
  const router = useRouter();
  return (
    <div className="bg-rose-50 min-h-screen flex items-center justify-center p-4 font-sans">
      {/* Modal Card */}
      <div className="bg-[#FFC6C6] border border-pink-200 rounded-xl p-6 md:p-8 max-w-4xl w-full flex flex-col items-center shadow-md">
        {/* Header Section with Icon and Title */}
        <div className="flex items-center text-center mb-6 gap-4">
          <svg
            width="61"
            height="61"
            viewBox="0 0 61 61"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clip-rule="evenodd"
              d="M60.0834 30.4993C60.0834 14.1605 46.839 0.916016 30.5001 0.916016C14.1612 0.916016 0.916748 14.1605 0.916748 30.4993C0.916748 46.8382 14.1612 60.0827 30.5001 60.0827C46.839 60.0827 60.0834 46.8382 60.0834 30.4993ZM30.5001 15.7077C31.2847 15.7077 32.0371 16.0194 32.5919 16.5742C33.1467 17.129 33.4584 17.8814 33.4584 18.666V33.4577C33.4584 34.2423 33.1467 34.9947 32.5919 35.5495C32.0371 36.1043 31.2847 36.416 30.5001 36.416C29.7155 36.416 28.963 36.1043 28.4082 35.5495C27.8534 34.9947 27.5417 34.2423 27.5417 33.4577V18.666C27.5417 17.8814 27.8534 17.129 28.4082 16.5742C28.963 16.0194 29.7155 15.7077 30.5001 15.7077ZM27.5417 42.3327C27.5417 41.5481 27.8534 40.7956 28.4082 40.2408C28.963 39.686 29.7155 39.3743 30.5001 39.3743H30.5237C31.3083 39.3743 32.0608 39.686 32.6156 40.2408C33.1704 40.7956 33.4821 41.5481 33.4821 42.3327C33.4821 43.1173 33.1704 43.8697 32.6156 44.4245C32.0608 44.9793 31.3083 45.291 30.5237 45.291H30.5001C29.7155 45.291 28.963 44.9793 28.4082 44.4245C27.8534 43.8697 27.5417 43.1173 27.5417 42.3327Z"
              fill="#323232"
            />
          </svg>
          <h1 className="text-4xl font-bold text-[#323232] font-oswald">
            Penting!
          </h1>
        </div>

        {/* Body Text */}
        <p className="text-center text-[#323232] text-xl leading-relaxed mb-8">
          Foto wajah Anda akan kami analisis untuk memahami bentuk dan warna
          kulit. Hasil analisis ini kami gunakan untuk memberikan rekomendasi
          produk yang paling cocok untuk Anda. Data anda tidak akan di bagikan
          dan hanya digunakan untuk meningkatkan pengalaman Anda di aplikasi
          kami. Kami berkomitmen penuh menjaga keamanan privasi Anda.
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-6">
          <button className="w-full bg-transparent border border-[#323232] text-[#323232] py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50">
            <EyeIcon />
            <span>Baca Kebijakan Privasi</span>
          </button>
          <button
            onClick={() => router.back()}
            className="w-full bg-[#323232] text-[#f0f0f0] font-semibold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}
