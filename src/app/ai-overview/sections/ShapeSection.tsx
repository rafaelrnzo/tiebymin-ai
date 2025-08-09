"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ======================================================================
// BAGIAN 1: KOMPONEN-KOMPONEN KECIL (HELPER)
// ======================================================================

interface IShape {
  name: string;
  value: number;
}

interface ShapeBarProps { name: string; value: number; }

const ShapeBar: React.FC<ShapeBarProps> = ({ name, value }) => (
    <div>
        <p className="text-base text-gray-800">{name}</p>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-3.5">
            <div className="bg-pink-400 h-3.5 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

const FaceShapeAnalysis: React.FC<{ data: IShape[] }> = ({ data }) => (
    <div className="w-full">
        <h3 className="font-bold text-2xl font-oswald mb-4">Face Shape Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {data.map((shape) => <ShapeBar key={shape.name} {...shape} />)}
        </div>
    </div>
);

const generateGimmickChartData = (mainShapeName: string): IShape[] => {
  // Daftar semua kemungkinan bentuk wajah
  const allShapes = ["Square", "Round", "Diamond", "Oval", "Triangle", "Oblong"];

  // Nilai utama: 90% untuk shape terpilih, sisanya 10% dibagi rata ke yang lain
  const mainValue = 90;
  const otherCount = allShapes.length - 1;
  // Bagi 10% ke shape lain, bagi rata, lalu sisa dibagi ke beberapa (biar "real")
  let baseOtherValue = Math.floor(10 / otherCount);
  let sisa = 10 - (baseOtherValue * otherCount);

  // Buat data chart
  let chartData: IShape[] = [];
  allShapes.forEach((shapeName, idx) => {
    if (shapeName.toLowerCase() === mainShapeName.toLowerCase()) {
      chartData.push({ name: shapeName, value: mainValue });
    } else {
      // Bagi sisa ke beberapa shape biar "real"
      let value = baseOtherValue;
      if (sisa > 0) {
        value += 1;
        sisa -= 1;
      }
      chartData.push({ name: shapeName, value });
    }
  });

  return chartData;
};


// ======================================================================
// BAGIAN 3: KOMPONEN UTAMA (ShapeSection)
// ======================================================================

interface ShapeSectionProps {
  shapeId: string;
}

const ShapeSection: React.FC<ShapeSectionProps> = ({ shapeId }) => {
    const [shapeDetails, setShapeDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State baru untuk menyimpan data chart gimmick
    const [gimmickChartData, setGimmickChartData] = useState<IShape[]>([]);

    useEffect(() => {
        if (!shapeId) {
            setError("Shape ID tidak tersedia.");
            setIsLoading(false);
            return;
        }
        const fetchShapeDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`https://b70ab926860b.ngrok-free.app/v1/face-shapes/${shapeId}`, {
                    headers: { 'ngrok-skip-browser-warning': 'true' }
                });
                setShapeDetails(response.data);

                // Setelah data API didapat, buat data gimmick berdasarkan nama bentuk wajah
                if (response.data && response.data.name) {
                    const chartData = generateGimmickChartData(response.data.name);
                    setGimmickChartData(chartData);
                }

            } catch (err) {
                setError("Gagal memuat detail bentuk wajah.");
                console.error("Fetch error in ShapeSection:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchShapeDetails();
    }, [shapeId]);

    if (isLoading) return <div className="text-center p-8">Loading shape information...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
    if (!shapeDetails) return <div className="text-center p-8">Data bentuk wajah tidak ditemukan.</div>;

    return (
        <div className='flex flex-col gap-y-8'>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-300 rounded-2xl p-4 sm:p-6">
                    <h3 className="font-bold text-5xl font-oswald">{shapeDetails.name}</h3>
                    <p className="text-gray-600 leading-relaxed mt-4">{shapeDetails.penjelasan_face_shape}</p>
                </div>
                <div className="bg-pink-100 rounded-2xl p-4 sm:p-6">
                    <h3 className="font-bold font-handlee text-gray-800 mb-3 text-lg text-left">Karakteristik</h3>
                    <ul className="list-disc pl-5 text-gray-600 leading-relaxed space-y-2">
                        <li>{shapeDetails.karakteristik}</li>
                    </ul>
                    <h3 className="font-bold font-handlee text-gray-800 mt-4 mb-3 text-lg text-left">Tips</h3>
                    <ul className="list-disc pl-5 text-gray-600 leading-relaxed space-y-2">
                        <li>{shapeDetails.tips_bentuk_wajah}</li>
                    </ul>
                </div>
            </div>

            {/* Render komponen bar chart HANYA jika datanya sudah siap */}
            {gimmickChartData.length > 0 && <FaceShapeAnalysis data={gimmickChartData} />}
        </div>
    );
}

export default ShapeSection;