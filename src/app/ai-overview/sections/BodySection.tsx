"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ======================================================================
// BAGIAN 1: DATA STATIS UNTUK PREVIEW
// Data ini untuk ikon-ikon kecil di bawah gambar utama. Kita biarkan statis.
// ======================================================================

const ALL_BODY_TYPES_PREVIEW = [
  { id: "diamond", img: "/body-select/diamond.png", name: "Diamond" },
  { id: "pear", img: "/body-select/pear.png", name: "Pear" },
  { id: "hourglass", img: "/body-select/hourglass.png", name: "Hourglass" },
  { id: "triangle", img: "/body-select/triangle.png", name: "Triangle" },
  { id: "square", img: "/body-select/square.png", name: "Square" },
  { id: "oval", img: "/body-select/oval.png", name: "Oval" },
];

// ======================================================================
// BAGIAN 2: KOMPONEN UTAMA (BodySection)
// ======================================================================

// Tentukan tipe data untuk prop yang diterima.
// 'bmiResult' bersifat opsional (?) untuk mencegah error jika tidak ada.
interface BodySectionProps {
  bodyShapeId: string;
  bmiResult?: {
    value: number;
    advice: string;
  };
}

const BodySection: React.FC<BodySectionProps> = ({ bodyShapeId, bmiResult }) => {
  // State untuk menyimpan data detail bentuk tubuh
  const [bodyDetails, setBodyDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect untuk fetch data bentuk tubuh
  useEffect(() => {
    if (!bodyShapeId) {
      setError("Body Shape ID tidak tersedia.");
      setIsLoading(false);
      return;
    }

    const fetchBodyDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://b70ab926860b.ngrok-free.app/v1/body-shapes/${bodyShapeId}`);
        setBodyDetails(response.data);
      } catch (err) {
        setError("Gagal memuat detail bentuk tubuh.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBodyDetails();
  }, [bodyShapeId]);

  // Tampilkan UI berdasarkan status pengambilan data
  if (isLoading) return <div className="text-center p-8">Loading body information...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!bodyDetails) return <div className="text-center p-8">Data bentuk tubuh tidak ditemukan.</div>;

  // --- Render konten utama setelah data berhasil dimuat ---
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      
      {/* Kolom Kiri - Informasi Bentuk Tubuh */}
      <div className="border-[1px] border-neutral-600 rounded-2xl p-4 sm:p-6">
        <h3 className="font-bold text-5xl font-oswald">{bodyDetails.name}</h3>
        <div className="flex justify-center my-6">
          <Image
            src={bodyDetails.link_picture || "/body-select/default.png"} // Ganti key menjadi link_picture
            alt={`${bodyDetails.name} body type`}
            width={100}
            height={220}
            className="w-[100px] h-[220px] object-contain"
            priority
          />
        </div>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-4">
          {bodyDetails.penjelasan_body_shape} 
        </p>
        {/* Anda bisa tambahkan `bodyDetails.tips_body_shape` di sini jika mau */}

        {/* Preview gambar-gambar body type lain (menggunakan data statis) */}
        <div className="flex gap-2 justify-center mt-6">
          {ALL_BODY_TYPES_PREVIEW.map((bt) => (
            <button
              key={bt.id}
              type="button"
              className={`rounded-lg p-1 border transition-all ${
                bt.name === bodyDetails.name
                  ? "border-[#EF789B] bg-[#FCE9EC]"
                  : "border-transparent hover:border-gray-300"
              }`}
              tabIndex={-1}
              aria-label={bt.name}
            >
              <Image src={bt.img} alt={bt.name} width={36} height={80} className="w-9 h-16 object-contain" style={{ opacity: bt.name === bodyDetails.name ? 1 : 0.5 }} />
            </button>
          ))}
        </div>
      </div>

      {/* Kolom Kanan - Analisa BMI */}
      <div className="border-[1px] border-neutral-600 rounded-2xl p-4 sm:p-6 space-y-8 flex flex-col items-center">
        <h3 className="font-bold text-5xl text-center font-oswald">BMI Analyst</h3>
        <hr className="w-full" />
        <div className="p-6 rounded-full border border-[#323232] w-fit bg-transparent flex items-center justify-center">
          {/* Gunakan data BMI dari prop 'bmiResult' */}
          <p className="text-3xl font-bold">{bmiResult?.value || 'N/A'}</p>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-center">
          {/* Gunakan saran BMI dari prop 'bmiResult' */}
          {bmiResult?.advice || 'Informasi BMI tidak tersedia.'}
        </p>
      </div>
    </div>
  )
}

export default BodySection;