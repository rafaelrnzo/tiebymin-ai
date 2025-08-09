"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';

// ======================================================================
// BAGIAN UTAMA: KOMPONEN CelebrityMatchSection
// ======================================================================

interface CelebrityMatchSectionProps {
  matchId: string; // Asumsi ini adalah ID hasil analisa utama
}

const CelebrityMatchSection: React.FC<CelebrityMatchSectionProps> = ({ matchId }) => {
  // State untuk data API, loading, dan error
  const [matchData, setMatchData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- INI DIA GIMMICK-NYA ---
  // Kita gunakan useState dengan fungsi lazy initializer.
  // Fungsi ini HANYA akan dijalankan SATU KALI saat komponen pertama kali render.
  // Ini memastikan persentase tidak berubah-ubah setiap kali ada re-render.
  const [matchPercentage] = useState(() => {
    // Menghasilkan angka integer random antara 80 dan 95 (inklusif)
    const min = 80;
    const max = 95;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  });

  // useEffect untuk mengambil data dari API
  useEffect(() => {
    if (!matchId) {
      setError("Analysis Result ID tidak tersedia.");
      setIsLoading(false);
      return;
    }

    const fetchCelebrityMatch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Pastikan URL API sudah menggunakan domain ngrok yang baru
        const response = await axios.get(`https://b70ab926860b.ngrok-free.app/v1/analysis-results/${matchId}/celebrity-match`);
        setMatchData(response.data);
      } catch (err) {
        setError("Gagal memuat data kecocokan selebriti.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCelebrityMatch();
  }, [matchId]);

  // Tampilkan UI berdasarkan status pengambilan data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Finding your celebrity match...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Data kecocokan selebriti tidak ditemukan.</p>
      </div>
    );
  }

  // --- Render konten utama setelah data berhasil dimuat ---
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col gap-6 w-full md:w-2/5">
        
        {/* Kartu Atas - Nama dan Alasan Kemiripan */}
        <div className="border-[1px] border-neutral-600 rounded-2xl p-6">
          <p className="font-handlee text-[#ED80A7] text-lg mb-1">Artis yang mirip kamu</p>
          <h3 className="text-3xl font-bold text-gray-800 font-oswald">{matchData.name}</h3>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed">
            {matchData.similarity_text}
          </p>
        </div>
        
        {/* Kartu Bawah - Deskripsi Tentang Artis */}
        <div className="bg-[#FCE9EC] rounded-2xl p-6">
          <h4 className="font-bold font-handlee text-gray-800 text-md mb-2">Tentang Artis Ini</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {matchData.description}
          </p>
        </div>
      </div>
      
      {/* Gambar Artis */}
      <div className="relative w-full md:w-3/5 min-h-[400px]">
        <Image 
          src={matchData.picture_url || "/default-celebrity.png"} 
          alt={matchData.name} 
          fill 
          style={{ objectFit: "cover" }} 
          className="rounded-2xl"
        />
        {/* 
            ===============================================
                      GIMMICK DITAMPILKAN DI SINI
            ===============================================
        */}
        <span className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
          <Image src="/overview-ai/icons/ai-generate.svg" width={16} height={16} alt="Match Icon" />
          {matchPercentage}% Match
        </span>
      </div>
    </div>
  );
};

export default CelebrityMatchSection;