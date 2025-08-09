"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ======================================================================
// BAGIAN 1: KOMPONEN-KOMPONEN KECIL (HELPER)
// Komponen-komponen ini bersifat presentasional dan tidak perlu diubah.
// ======================================================================

interface IShape {
  name: string;
  value: number;
}

// Data ini untuk bar chart, mungkin nanti perlu dinamis juga dari API
const shapeDistributionData: IShape[] = [
    { name: 'Square', value: 80 },
    { name: 'Round', value: 10 },
    { name: 'Diamond', value: 10 },
    { name: 'Pear', value: 10 },
    { name: 'Oval', value: 10 },
    { name: 'Triangle', value: 10 },
];

interface ShapeBarProps {
    name: string;
    value: number;
}

const ShapeBar: React.FC<ShapeBarProps> = ({ name, value }) => (
    <div>
        <p className="text-base text-gray-800">{name}</p>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-3.5">
            <div
                className="bg-pink-400 h-3.5 rounded-full"
                style={{ width: `${value}%` }}
            ></div>
        </div>
    </div>
);

// Komponen untuk menampilkan bar chart analisa.
// Untuk saat ini, datanya masih statis.
const FaceShapeAnalysis: React.FC = () => {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {shapeDistributionData.map((shape) => (
                    <ShapeBar key={shape.name} name={shape.name} value={shape.value} />
                ))}
            </div>
        </div>
    );
};

// ======================================================================
// BAGIAN 2: KOMPONEN UTAMA (ShapeSection)
// Komponen ini akan menerima 'shapeId', melakukan fetch ke API, dan menampilkan hasilnya.
// ======================================================================

// Mendefinisikan tipe prop yang akan diterima oleh ShapeSection
interface ShapeSectionProps {
  shapeId: string;
}

const ShapeSection: React.FC<ShapeSectionProps> = ({ shapeId }) => {
    
    // State untuk menyimpan data dari API, status loading, dan pesan error
    const [shapeDetails, setShapeDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // useEffect untuk mengambil data dari API
    useEffect(() => {
        // Jangan lakukan fetch jika shapeId tidak ada
        if (!shapeId) {
            setIsLoading(false);
            setError("Shape ID tidak tersedia.");
            return;
        }

        const fetchShapeDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Ganti URL ini dengan URL API Anda yang sebenarnya    
                const response = await axios.get(`https://b70ab926860b.ngrok-free.app/v1/face-shapes/${shapeId}`);
                setShapeDetails(response.data);
            } catch (err) {
                setError("Gagal memuat detail bentuk wajah.");
                console.error("Fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShapeDetails();
    }, [shapeId]); // useEffect ini akan berjalan kembali jika prop 'shapeId' berubah

    // Tampilkan UI berdasarkan status pengambilan data
    if (isLoading) {
        return <div className="text-center p-8">Loading shape information...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    if (!shapeDetails) {
        return <div className="text-center p-8">Data bentuk wajah tidak ditemukan.</div>;
    }

    // --- Render konten utama setelah data berhasil dimuat ---
    return (
        <div className='flex flex-col gap-y-8'>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Kolom Kiri - Nama dan Penjelasan */}
                <div className="border border-gray-300 rounded-2xl p-4 sm:p-6">
                    <h3 className="font-bold text-5xl font-oswald">{shapeDetails.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mt-4">
                        {shapeDetails.penjelasan_face_shape}
                    </p>
                </div>
                
                {/* Kolom Kanan - Karakteristik dan Tips */}
                <div className="bg-pink-100 rounded-2xl p-4 sm:p-6">
                    <h3 className="font-bold font-handlee text-gray-800 mb-3 text-lg text-center">Karakteristik</h3>
                    <ul className="list-disc pl-5 text-gray-600 text-sm leading-relaxed space-y-2">
                        <li>{shapeDetails.karakteristik}</li>
                    </ul>
                    
                    <h3 className="font-bold font-handlee text-gray-800 mt-4 mb-3 text-lg text-center">Tips</h3>
                    <ul className="list-disc pl-5 text-gray-600 text-sm leading-relaxed space-y-2">
                        <li>{shapeDetails.tips_bentuk_wajah}</li>
                    </ul>
                </div>
            </div>

            {/* Komponen Bar Chart di Bawah */}
            <FaceShapeAnalysis />
        </div>
    );
}

export default ShapeSection;