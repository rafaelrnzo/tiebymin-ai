"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ======================================================================
// BAGIAN 1: KOMPONEN-KOMPONEN KECIL (HELPER)
// Tidak ada perubahan di sini.
// ======================================================================

interface ColorCircleProps {
  color: string;
  className?: string;
}

interface ColorGroupProps {
  title: string;
  colors: string[];
}

interface InfoCardProps {
  title: string;
  text: string;
}

const ColorCircle: React.FC<ColorCircleProps> = ({ color, className }) => (
  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${className}`} style={{ backgroundColor: color }} />
);

const ColorGroup: React.FC<ColorGroupProps> = ({ title, colors }) => (
  <div className="text-center">
    <h3 className="font-script text-lg sm:text-xl font-bold text-gray-700 font-handlee">{title}</h3>
    <div className="mt-2 grid grid-cols-3 grid-rows-2 gap-2 sm:gap-3">
      {/* Kita tambahkan pengecekan `colors &&` untuk keamanan jika API tidak mengembalikan array */}
      {colors && colors.map((color, index) => <ColorCircle key={index} color={color} />)}
    </div>
  </div>
);

const InfoCard: React.FC<InfoCardProps> = ({ title, text }) => (
  <div>
    <h4 className="font-script text-xl font-bold text-gray-800 font-handlee">{title}</h4>
    <p className="mt-1 text-sm text-gray-700">{text}</p>
  </div>
);

// ======================================================================
// BAGIAN 2: KOMPONEN UTAMA (ColorToneSection)
// ======================================================================

interface ColorToneSectionProps {
  colorAnalysisId: string;
}

const ColorToneSection: React.FC<ColorToneSectionProps> = ({ colorAnalysisId }) => {
  const [colorData, setColorData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!colorAnalysisId) {
      setError("Color Analysis ID tidak tersedia.");
      setIsLoading(false);
      return;
    }

    const fetchColorData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://b70ab926860b.ngrok-free.app/v1/color-analysis/${colorAnalysisId}`);
        setColorData(response.data);
      } catch (err) {
        setError("Gagal memuat data analisa warna.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchColorData();
  }, [colorAnalysisId]);

  if (isLoading) return <div className="text-center p-8">Loading color analysis...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!colorData) return <div className="text-center p-8">Data analisa warna tidak ditemukan.</div>;
  
  // Buat data untuk InfoCard dari state, sesuaikan dengan key dari API
  const infoData: InfoCardProps[] = [
    { title: "Make up Tips", text: colorData.make_up_tips },
    { title: "Outfit Tips", text: colorData.tips_warna_kulit_pakaian },
    { title: "Personality", text: colorData.personality },
    { title: "Karakteristik", text: colorData.karakteristik },
  ];

  return (
    <div className="font-sans max-w-6xl w-full mx-auto space-y-6">
      {/* Bagian Atas: Nama dan Color Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Kartu Nama Season */}
        <div className="lg:col-span-1 p-6 rounded-2xl border-[1px] border-neutral-600">
          <h2 className="text-5xl font-bold font-oswald leading-tight">{colorData.name}</h2>
          <p className="mt-4 text-gray-500">{colorData.penjelasan_color_analysis}</p>
        </div>

        {/* Kartu Color Guide Line */}
        <div className="lg:col-span-2 p-6 rounded-2xl border-[1px] border-neutral-600">
          <h2 className="text-center font-script font-handlee text-xl font-bold text-gray-700">Color Guide Line</h2>

          <div className="mt-4 grid grid-cols-3 gap-4 sm:gap-8">
            <ColorGroup title="Best Color" colors={colorData.best_colour} />
            <ColorGroup title="Worst Color" colors={colorData.worst_colour} />
            <ColorGroup title="Neutral Color" colors={colorData.neutral_colour} />
          </div>

          {/* Bagian Kombinasi (Diubah untuk menampilkan teks) */}
          <div className="mt-6">
            <span className="font-bold text-sm text-gray-700 pl-4">Best Combination</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {colorData.best_colour_combination.map((item: string, index: number) => (
                <div key={index} className="bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Tips & Karakteristik */}
      <div className="bg-[#FADADD] p-6 rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
          {infoData.map((info) => (
            // Tambahkan pengecekan jika teksnya ada, agar tidak render kartu kosong
            info.text && <InfoCard key={info.title} {...info} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ColorToneSection;