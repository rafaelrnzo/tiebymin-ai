"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';

// --- Komponen Helper untuk Kartu Tip ---
interface TipCardProps {
  category: string;
  tip: string;
  icon: string;
}

const TipCard: React.FC<TipCardProps> = ({ category, tip, icon }) => (
  <div className="border-[1px] border-neutral-600 rounded-2xl p-4 sm:p-6 h-full">
    <div className="mb-3">
      <Image src={icon} width={32} height={32} alt={`${category} Icon`} />
    </div>
    <h3 className="font-bold font-handlee text-gray-800 mb-3 text-lg sm:text-xl">{category}</h3>
    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{tip}</p>
  </div>
);

// --- Komponen Utama ---
interface TipsSectionProps {
  analysisData: any; // Menerima seluruh data analisa utama
}

const TipsSection: React.FC<TipsSectionProps> = ({ analysisData }) => {
  // State untuk menyimpan semua rangkuman tips
  const [allTips, setAllTips] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ambil semua ID yang diperlukan dari data utama
    const { face_shape_id, color_analysis_id, body_shape_id, bmi_category_id } = analysisData;
    
    // Pastikan semua ID ada sebelum melanjutkan
    if (!face_shape_id || !color_analysis_id || !body_shape_id || !bmi_category_id) {
      setError("Data ID tidak lengkap untuk merangkum semua tips.");
      setIsLoading(false);
      return;
    }

    const fetchAllTips = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Lakukan SEMUA panggilan API untuk mendapatkan tips secara paralel
        const [faceRes, colorRes, bodyRes, bmiRes] = await Promise.all([
          axios.get(`https://b70ab926860b.ngrok-free.app/v1/face-shapes/${face_shape_id}`, { headers: { 'ngrok-skip-browser-warning': 'true' } }),
          axios.get(`https://b70ab926860b.ngrok-free.app/v1/color-analysis/${color_analysis_id}`, { headers: { 'ngrok-skip-browser-warning': 'true' } }),
          axios.get(`https://b70ab926860b.ngrok-free.app/v1/body-shapes/${body_shape_id}`, { headers: { 'ngrok-skip-browser-warning': 'true' } }),
          axios.get(`https://b70ab926860b.ngrok-free.app/v1/bmi-categories/${bmi_category_id}`, { headers: { 'ngrok-skip-browser-warning': 'true' } })
        ]);

        // Gabungkan semua tips yang relevan ke dalam satu objek
        setAllTips({
          faceTip: faceRes.data.tips_bentuk_wajah,
          bodyTip: bodyRes.data.tips_body_shape,
          colorTip: colorRes.data.tips_warna_kulit_pakaian,
          makeupTip: colorRes.data.make_up_tips,
          bmiTip: bmiRes.data.tips_fashion
        });

      } catch (err) {
        setError("Gagal memuat rangkuman tips.");
        console.error("Fetch error in TipsSection:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTips();
  }, [analysisData]); // Jalankan useEffect saat 'analysisData' tersedia

  if (isLoading) return <div className="text-center p-8">Merangkum tips terbaik untukmu...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!allTips) return <div className="text-center p-8">Tidak ada tips yang bisa ditampilkan.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <TipCard
        category="Tips Bentuk Wajah"
        tip={allTips.faceTip}
        icon="/overview-ai/icons/ri_shape-fill.svg"
      />
      <TipCard
        category="Tips Bentuk Tubuh"
        tip={allTips.bodyTip}
        icon="/overview-ai/icons/healthicons_body.svg"
      />
      <TipCard
        category="Tips Warna Pakaian"
        tip={allTips.colorTip}
        icon="/overview-ai/icons/mdi_color.svg"
      />
      {/* Kartu Rekap Cepat bisa diisi dengan gabungan atau tips makeup */}
      <div className="bg-pink-100 rounded-2xl p-4 sm:p-6">
        <div className="mb-3">
          <Image src="/overview-ai/icons/ic_baseline-tips-and-updates.svg" width={32} height={32} alt="Tips & Trick Icon" />
        </div>
        <h3 className="font-bold font-handlee text-gray-800 mb-3 text-lg sm:text-xl">Tips Makeup & BMI</h3>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
          <strong>Makeup:</strong> {allTips.makeupTip}
          <br /><br />
          <strong>Gaya Sesuai BMI:</strong> {allTips.bmiTip}
        </p>
      </div>
    </div>
  );
};

export default TipsSection; 