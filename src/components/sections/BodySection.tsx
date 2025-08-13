"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import url from "@/lib/url";
import { BodyShape, BmiCategory } from "@/types";

const ALL_BODY_TYPES_PREVIEW = [
  { id: "diamond", img: "/body-select/diamond.png", name: "Diamond" },
  { id: "pear", img: "/body-select/pear.png", name: "Pear" },
  { id: "hourglass", img: "/body-select/hourglass.png", name: "Hourglass" },
  { id: "triangle", img: "/body-select/triangle.png", name: "Triangle" },
  { id: "square", img: "/body-select/square.png", name: "Square" },
  { id: "oval", img: "/body-select/oval.png", name: "Oval" },
];

interface BodySectionProps {
  bodyShapeId: string;
  bmiResult?: { value: { value: string | number } }; // Izinkan string untuk menangani format yang salah
  bmiCategoryId?: string;
}

const BodySection: React.FC<BodySectionProps> = ({
  bodyShapeId,
  bmiResult,
  bmiCategoryId,
}) => {
  const [bodyDetails, setBodyDetails] = useState<BodyShape | null>(null);
  const [bmiCategoryDetails, setBmiCategoryDetails] =
    useState<BmiCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          axios.get(`${url}/v1/body-shapes/${bodyShapeId}`),
          axios.get(`${url}/v1/bmi-categories/${bmiCategoryId}`),
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

  // Fungsi untuk membersihkan dan memformat nilai BMI
  const formatBmiValue = (value: number | string | undefined): string => {
    if (value === undefined || value === null) {
      return "0.00";
    }
    // 1. Ubah ke string untuk memastikan .replace() aman digunakan
    const stringValue = String(value);
    // 2. Ganti koma dengan titik
    const sanitizedValue = stringValue.replace(",", ".");
    // 3. Konversi ke Angka dan format
    const numberValue = Number(sanitizedValue);
    // 4. Periksa apakah hasilnya NaN, jika ya, kembalikan 0
    return isNaN(numberValue) ? "0.00" : numberValue.toFixed(2);
  };

  if (isLoading)
    return <div className="text-center p-8">Loading body information...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!bodyDetails || !bmiCategoryDetails)
    return <div className="text-center p-8">Data tubuh tidak ditemukan.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="border-[1px] border-neutral-600 rounded-2xl p-4 sm:p-6">
        <h3 className="font-bold text-5xl font-oswald">{bodyDetails.name}</h3>
        <div className="flex justify-center my-6">
          <Image
            src={bodyDetails.link_picture || "/body-select/pear.png"}
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
        <div className="flex gap-2 justify-center mt-6">
          {ALL_BODY_TYPES_PREVIEW.map((bt) => (
            <Button
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
              <Image
                src={bt.img}
                alt={bt.name}
                width={36}
                height={80}
                className="w-9 h-16 object-contain"
                style={{ opacity: bt.name === bodyDetails.name ? 1 : 0.5 }}
              />
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="border border-neutral-600 rounded-2xl p-6 sm:p-8 text-black">
          {/* Judul */}
          <h3 className="font-bold text-4xl sm:text-5xl font-oswald">
            BMI Analyst
          </h3>
          <hr className="my-4 border-neutral-300" />

          <div className="flex items-center gap-4">
            {/* Lingkaran BMI */}
            <div className="flex items-center justify-center">
              <div className="rounded-full border-2 border-[#EC7498] p-1">
                <div className="rounded-full border border-neutral-600 w-24 h-24 flex items-center justify-center">
                  <p className="text-lg font-bold">
                    {formatBmiValue(bmiResult?.value.value)}
                  </p>
                </div>
              </div>
            </div>

            {/* Teks Keterangan */}
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg">
                {bmiCategoryDetails.kategori}
              </span>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-poppins">
                {bmiCategoryDetails.tips_fashion
                  .split(" ")
                  .slice(0, 12)
                  .join(" ") +
                  (bmiCategoryDetails.tips_fashion.split(" ").length > 12
                    ? "..."
                    : "")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-pink-100 rounded-2xl px-4 py-14 sm:p-6">
          <h3 className="font-bold font-handlee text-gray-800 mb-3 text-lg text-left">
            Karakteristik
          </h3>
          <span className="font-poppins text-sm">
            {bodyDetails.penjelasan_body_shape}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BodySection;
