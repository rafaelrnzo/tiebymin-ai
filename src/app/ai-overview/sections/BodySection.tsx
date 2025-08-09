"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Data Statis Preview ---
const ALL_BODY_TYPES_PREVIEW = [
  { id: "diamond", img: "/body-select/diamond.png", name: "Diamond" }, { id: "pear", img: "/body-select/pear.png", name: "Pear" },
  { id: "hourglass", img: "/body-select/hourglass.png", name: "Hourglass" }, { id: "triangle", img: "/body-select/triangle.png", name: "Triangle" },
  { id: "square", img: "/body-select/square.png", name: "Square" }, { id: "oval", img: "/body-select/oval.png", name: "Oval" },
];

// --- Komponen Utama ---
interface BodySectionProps {
  bodyShapeId: string;
  bmiResult?: { value: number };
  bmiCategoryId?: string;
} 

const BodySection: React.FC<BodySectionProps> = ({ bodyShapeId, bmiResult, bmiCategoryId }) => {
    const [bodyDetails, setBodyDetails] = useState<any>(null);
    const [bmiCategoryDetails, setBmiCategoryDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      console.log(bodyShapeId, bmiCategoryId)
        if (!bodyShapeId || !bmiCategoryId) {
            setError("Data ID untuk tubuh atau BMI tidak lengkap.");
            setIsLoading(false);
            return;
        }
      
        const fetchAllBodyData = async () => {
          setIsLoading(true);
          setError(null);
          try {
              const [bodyShapeResponse, bmiCategoryResponse] = await Promise.all([
              
                  axios.get(`https://b70ab926860b.ngrok-free.app/v1/body-shapes/${bodyShapeId}`, {
                      headers: { 'ngrok-skip-browser-warning': 'true' }
                  }),
          
                  axios.get(`https://b70ab926860b.ngrok-free.app/v1/bmi-categories/${bmiCategoryId}`, {
                      headers: { 'ngrok-skip-browser-warning': 'true' }
                  })
              ]);
              setBodyDetails(bodyShapeResponse.data);
              setBmiCategoryDetails(bmiCategoryResponse.data);
          } catch (err) {
              setError("Gagal memuat detail tubuh atau BMI.");
              console.error("Fetch error in BodySection:", err);
          } finally {
              setIsLoading(false);
          }
      };

      fetchAllBodyData();
  }, [bodyShapeId, bmiCategoryId]);

    if (isLoading) return <div className="text-center p-8">Loading body information...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
    if (!bodyDetails || !bmiCategoryDetails) return <div className="text-center p-8">Data tubuh tidak ditemukan.</div>;

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className="border-[1px] border-neutral-600 rounded-2xl p-4 sm:p-6">
                <h3 className="font-bold text-5xl font-oswald">{bodyDetails.name}</h3>
                <div className="flex justify-center my-6">
                    <Image src={bodyDetails.link_picture || "/body-select/pear.png"} alt={`${bodyDetails.name} body type`} width={100} height={220} className="w-[100px] h-[220px] object-contain" priority />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-4">{bodyDetails.penjelasan_body_shape}</p>
                <div className="flex gap-2 justify-center mt-6">
                    {ALL_BODY_TYPES_PREVIEW.map((bt) => (
                        <button key={bt.id} type="button" className={`rounded-lg p-1 border transition-all ${bt.name === bodyDetails.name ? "border-[#EF789B] bg-[#FCE9EC]" : "border-transparent hover:border-gray-300"}`} tabIndex={-1} aria-label={bt.name}>
                            <Image src={bt.img} alt={bt.name} width={36} height={80} className="w-9 h-16 object-contain" style={{ opacity: bt.name === bodyDetails.name ? 1 : 0.5 }} />
                        </button>
                    ))}
                </div>
            </div>
            <div className="border-[1px] border-neutral-600 rounded-2xl p-4 sm:p-6 space-y-8 flex flex-col items-center">
                <h3 className="font-bold text-5xl text-center font-oswald">BMI Analyst ({bmiCategoryDetails.kategori})</h3>
                <hr className="w-full" />
                <div className="p-6 rounded-full border border-[#323232] w-fit bg-transparent flex items-center justify-center">
                    <p className="text-3xl font-bold">{bmiResult?.value ? (Math.round(bmiResult.value * 10) / 10).toFixed(1) : 'N/A'}</p>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-center">{bmiCategoryDetails.tips_fashion}</p>
            </div>
        </div>
    )
}

export default BodySection;