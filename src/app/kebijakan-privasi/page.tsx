"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

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

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10 text-[#323232]"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 1.944c-1.933 0-3.867.73-5.303 2.166A7.447 7.447 0 002.53 9.414c-.03.226-.054.453-.072.682-.196 2.457.94 4.874 2.985 6.275a16.89 16.89 0 004.557 2.613c.24.08.496.08.739 0a16.89 16.89 0 004.557-2.613c2.046-1.4 3.182-3.818 2.985-6.275a8.773 8.773 0 00-.072-.682 7.447 7.447 0 00-2.167-5.304C13.867 2.674 11.933 1.944 10 1.944zm0 1.623c1.6 0 3.16.59 4.383 1.767a5.823 5.823 0 011.69 4.14c.02.26.035.52.044.782.164 2.05-.78 4.07-2.5 5.234a15.26 15.26 0 01-3.62 2.074c-.09.03-.183.03-.273 0a15.26 15.26 0 01-3.62-2.074c-1.72-1.164-2.664-3.183-2.5-5.234.01-.262.025-.522.044-.782a5.823 5.823 0 011.69-4.14C6.84 4.157 8.4 3.567 10 3.567z"
      clipRule="evenodd"
    />
    <path d="M10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 6.5a1 1 0 100 2 1 1 0 000-2z" />
  </svg>
);

const NoticeView: React.FC<{
  onShowPolicy: () => void;
  onContinue: () => void;
}> = ({ onShowPolicy, onContinue }) => {
  return (
    <div className="bg-[#FFC6C6] border border-pink-200 rounded-xl p-6 md:p-8 max-w-4xl w-full flex flex-col items-center shadow-md">
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
            clipRule="evenodd"
            d="M60.0834 30.4993C60.0834 14.1605 46.839 0.916016 30.5001 0.916016C14.1612 0.916016 0.916748 14.1605 0.916748 30.4993C0.916748 46.8382 14.1612 60.0827 30.5001 60.0827C46.839 60.0827 60.0834 46.8382 60.0834 30.4993ZM30.5001 15.7077C31.2847 15.7077 32.0371 16.0194 32.5919 16.5742C33.1467 17.129 33.4584 17.8814 33.4584 18.666V33.4577C33.4584 34.2423 33.1467 34.9947 32.5919 35.5495C32.0371 36.1043 31.2847 36.416 30.5001 36.416C29.7155 36.416 28.963 36.1043 28.4082 35.5495C27.8534 34.9947 27.5417 34.2423 27.5417 33.4577V18.666C27.5417 17.8814 27.8534 17.129 28.4082 16.5742C28.963 16.0194 29.7155 15.7077 30.5001 15.7077ZM27.5417 42.3327C27.5417 41.5481 27.8534 40.7956 28.4082 40.2408C28.963 39.686 29.7155 39.3743 30.5001 39.3743H30.5237C31.3083 39.3743 32.0608 39.686 32.6156 40.2408C33.1704 40.7956 33.4821 41.5481 33.4821 42.3327C33.4821 43.1173 33.1704 43.8697 32.6156 44.4245C32.0608 44.9793 31.3083 45.291 30.5237 45.291H30.5001C29.7155 45.291 28.963 44.9793 28.4082 44.4245C27.8534 43.8697 27.5417 43.1173 27.5417 42.3327Z"
            fill="#323232"
          />
        </svg>
        <h1 className="text-4xl font-bold text-[#323232] font-oswald">
          Penting!
        </h1>
      </div>
      <p className="text-center text-[#323232] text-xl leading-relaxed mb-8">
        Foto wajah Anda akan kami analisis untuk memahami bentuk dan warna
        kulit. Hasil analisis ini kami gunakan untuk memberikan rekomendasi
        produk yang paling cocok untuk Anda. Data anda tidak akan di bagikan dan
        hanya digunakan untuk meningkatkan pengalaman Anda di aplikasi kami.
        Kami berkomitmen penuh menjaga keamanan privasi Anda.
      </p>
      <div className="w-full flex flex-col gap-6">
        <button
          onClick={onShowPolicy}
          className="w-full bg-transparent border border-[#323232] text-[#323232] py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
        >
          <EyeIcon />
          <span>Baca Kebijakan Privasi</span>
        </button>
        <button
          onClick={onContinue}
          className="w-full bg-[#323232] text-[#f0f0f0] font-semibold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Back
        </button>
      </div>
    </div>
  );
};

// 2. Tampilan Kebijakan Privasi
const PrivacyPolicyView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="border border-[#323232] rounded-xl p-6 md:p-8 max-w-4xl w-full flex flex-col shadow-md">
      <div className="flex items-center gap-4 mb-6">
        <ShieldIcon />
        <h2 className="text-4xl font-bold text-[#323232] font-oswald">
          Kebijakan Privasi
        </h2>
      </div>
      <div className="space-y-6 text-[#323232] text-lg text-left">
        <div>
          <h3 className="font-bold mb-2">1. Privasi Kamu, Prioritas Kami</h3>
          <p>
            Di Tiebymin AI, kami paham bahwa foto dan data pribadimu sangat
            berharga. Karena itu, semua informasi yang kamu bagikan hanya
            digunakan untuk memberikan analisa wajah, warna kulit, dan bentuk
            tubuh secara personal, tanpa disalahgunakan.
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-2">2. Aman dan Terlindungi</h3>
          <p>
            Kami melindungi datamu dengan teknologi enkripsi dan sistem keamanan
            modern. Datamu tidak akan dijual atau dibagikan ke pihak lain. Jika
            suatu saat kamu ingin menghapus akun, semua data akan dihapus secara
            permanen.
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-2">3. Kamu Punya Kendali</h3>
          <p>
            Kamu bebas mengelola, mengunduh, atau menghapus datamu kapan saja.
            Tujuan kami sederhana: membuatmu nyaman, percaya diri, dan merasa
            aman setiap kali menggunakan Tiebymin AI.
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-full bg-[#323232] text-[#f0f0f0] font-semibold py-3 px-4 rounded-lg mt-8 hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
      >
        Selesai
      </button>
    </div>
  );
};

export default function PrivacyNoticeModal() {
  const router = useRouter();
  const [view, setView] = useState<"notice" | "policy">("notice");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      {view === "notice" ? (
        <NoticeView
          onShowPolicy={() => setView("policy")}
          onContinue={() => router.back()}
        />
      ) : (
        <PrivacyPolicyView onClose={() => setView("notice")} />
      )}
    </div>
  );
}
