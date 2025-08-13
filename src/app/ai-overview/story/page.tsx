"use client";
import { Instagram, Music } from "lucide-react"; // Menggunakan ikon Music untuk TikTok
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import url from "@/lib/url";
import { AnalysisData as GlobalAnalysisData } from "@/types";

interface AnalysisData extends GlobalAnalysisData {
  celebrity_id: number | null;
  user_name?: string;
  analysis_details: {
    bmi: {
      value: string | number;
    };
  };
}

interface PhotoData {
  is_processed: boolean;
  file_path: string;
  photo_type: "face_original" | "face_processed" | string;
}

interface FaceShapeData {
  name: string;
  description: string;
  characteristics: string[];
}

interface ColorToneData {
  name: string;
  description: string;
  best_colors: string[];
  neutral_colors: string[];
  worst_colors: string[];
  combination_colors: string[];
}

interface BodyShapeData {
  name: string;
  description: string;
  characteristics: string[];
}

interface BMICategoryData {
  name: string;
  description: string;
}

// Fallback data jika API gagal
const defaultUserData = {
  name: "User",
  faceShape: "Kotak",
  faceShapeDesc: "Bentuk wajah kamu itu kotak! Kamu punya garis rahang yang tegas dan dahi nggak terlalu lebar atau sempit.",
  faceShapeAnalysis: [
    { label: "Square", value: 90, active: true },
    { label: "Oblong", value: 40 },
    { label: "Oval", value: 60 },
    { label: "Round", value: 20 },
    { label: "Heart", value: 50 },
    { label: "Diamond", value: 70 },
  ],
  colorTone: "Cool Winter",
  colorToneDesc: "Ini berarti kulitmu memiliki undertone dingin dengan hint biru atau pink yang memberikan kesan elegan.",
  colorPalettes: {
    best: ["#323232", "#3B3B98", "#653456", "#6A2E35", "#37598B", "#692F5C"],
    neutral: ["#323232", "#6B7280", "#4A4A4A", "#9CA3AF", "#D1D5DB", "#111827"],
    worst: ["#F59E0B", "#FACC15", "#D97706", "#B45309", "#78350F", "#451A03"],
    combination: ["#DC2626", "#3B82F6", "#323232", "#6B21A8", "#9333EA", "#C084FC"],
  },
  bodyShape: "Hourglass",
  bodyShapeDesc: "Bentuk Tubuhmu Memiliki Proporsi Seimbang Antara Bagian Atas Dan Bawah, Dengan Pinggang Yang Terlihat Ramping.",
  bodyCharacteristics: [
    "Bahu dan pinggul kamu lebar-nya sama.",
    "Pinggang yang jelas dan ramping bikin lekuk tubuhmu makin stunning.",
    "Kamu punya kesan feminin alami yang bakal bikin outfit apapun terlihat bagus",
  ],
  bmi: {
    value: 61.43,
    category: "Normal",
    desc: "Tubuhmu Berada Di Titik Ideal Yang Bikin Eksplorasi Gaya Bisa Lebih Bebas.",
  },
};

// Komponen untuk Bar Bentuk Wajah
const ShapeBar = ({
  label,
  value,
  active,
}: {
  label: string;
  value: number;
  active?: boolean;
}) => (
  <div>
    <span
      className={`text-sm ${
        active ? "font-bold text-gray-800" : "text-gray-500"
      }`}
    >
      {label}
    </span>
    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
      <div
        className="bg-[#EF789B] h-1.5 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

// Komponen untuk Palet Warna
const ColorPalette = ({
  title,
  colors,
}: {
  title: string;
  colors: string[];
}) => (
  <div>
    <h4 className="font-semibold text-sm text-gray-600 mb-2">{title}</h4>
    <div className="flex space-x-1">
      {colors.map((color, index) => (
        <div
          key={index}
          className="w-8 h-8 rounded-md shadow-sm"
          style={{ backgroundColor: color }}
        ></div>
      ))}
    </div>
  </div>
);

export default function HasilAnalisa() {
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState(defaultUserData);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resultId = searchParams.get("result_id");

    if (!resultId) {
      setError("Analysis Result ID tidak ditemukan di URL.");
      setIsLoading(false);
      return;
    }

    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch analysis data dan foto
        const [analysisResponse, photosResponse] = await Promise.all([
          axios.get(`${url}/v1/user-analysis-results/${resultId}`),
          axios.get(`${url}/v1/user-photos/analysis-results/${resultId}/photos`),
        ]);

        const analysisData: AnalysisData = analysisResponse.data;

        // Fetch data tambahan berdasarkan ID dari hasil analisis
        const [faceShapeResponse, colorToneResponse, bodyShapeResponse, bmiCategoryResponse] = await Promise.all([
          axios.get(`${url}/v1/face-shapes/${analysisData.face_shape_id}`),
          axios.get(`${url}/v1/color-analysis/${analysisData.color_analysis_id}`),
          axios.get(`${url}/v1/body-shapes/${analysisData.body_shape_id}`),
          axios.get(`${url}/v1/bmi-categories/${analysisData.bmi_category_id}`),
        ]);

        const faceShapeData: FaceShapeData = faceShapeResponse.data;
        const colorToneData: ColorToneData = colorToneResponse.data;
        const bodyShapeData: BodyShapeData = bodyShapeResponse.data;
        const bmiCategoryData: BMICategoryData = bmiCategoryResponse.data;

        // Transformasi data untuk format yang dibutuhkan komponen
        const transformedData = {
          name: analysisData.user_name || "User",
          faceShape: faceShapeData?.name || defaultUserData.faceShape,
          faceShapeDesc: faceShapeData?.description || defaultUserData.faceShapeDesc,
          faceShapeAnalysis: [
            { label: "Square", value: faceShapeData?.name === "Square" ? 90 : 40, active: faceShapeData?.name === "Square" },
            { label: "Oblong", value: faceShapeData?.name === "Oblong" ? 90 : 40, active: faceShapeData?.name === "Oblong" },
            { label: "Oval", value: faceShapeData?.name === "Oval" ? 90 : 40, active: faceShapeData?.name === "Oval" },
            { label: "Round", value: faceShapeData?.name === "Round" ? 90 : 40, active: faceShapeData?.name === "Round" },
            { label: "Heart", value: faceShapeData?.name === "Heart" ? 90 : 40, active: faceShapeData?.name === "Heart" },
            { label: "Diamond", value: faceShapeData?.name === "Diamond" ? 90 : 40, active: faceShapeData?.name === "Diamond" },
          ],
          colorTone: colorToneData?.name || defaultUserData.colorTone,
          colorToneDesc: colorToneData?.description || defaultUserData.colorToneDesc,
          colorPalettes: {
            best: colorToneData?.best_colors || defaultUserData.colorPalettes.best,
            neutral: colorToneData?.neutral_colors || defaultUserData.colorPalettes.neutral,
            worst: colorToneData?.worst_colors || defaultUserData.colorPalettes.worst,
            combination: colorToneData?.combination_colors || defaultUserData.colorPalettes.combination,
          },
          bodyShape: bodyShapeData?.name || defaultUserData.bodyShape,
          bodyShapeDesc: bodyShapeData?.description || defaultUserData.bodyShapeDesc,
          bodyCharacteristics: bodyShapeData?.characteristics || defaultUserData.bodyCharacteristics,
          bmi: {
            value: typeof analysisData.analysis_details.bmi.value === 'string' ? 
              parseFloat(analysisData.analysis_details.bmi.value) : 
              Number(analysisData.analysis_details.bmi.value),
            category: bmiCategoryData?.name || defaultUserData.bmi.category,
            desc: bmiCategoryData?.description || defaultUserData.bmi.desc,
          },
        };

        setUserData(transformedData);

        // Set foto user
        const processedPhoto = photosResponse.data.find(
          (photo: PhotoData) => photo.is_processed === true
        );
        if (processedPhoto) {
          setUserPhotoUrl(processedPhoto.file_path);
        } else {
          const originalPhoto = photosResponse.data.find(
            (photo: PhotoData) => photo.photo_type === "face_original"
          );
          if (originalPhoto) setUserPhotoUrl(originalPhoto.file_path);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal memuat data analisa. Menggunakan data default.");
        // Tetap gunakan fallback data jika terjadi error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center p-8">Loading analysis data...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex items-center justify-center">
      <main className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full font-sans">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Image
            src="/tie-by-min-logo.png"
            alt="Logo Tie By Min"
            width={120}
            height={40}
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-right">
            HASIL ANALISA {userData.name.toUpperCase()}
          </h1>
        </div>

        {/* Bagian Atas: Foto & QR */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="relative w-full aspect-[1/1] rounded-lg overflow-hidden">
            <Image
              src={userPhotoUrl || "/model.png"}
              alt={`Foto ${userData.name}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <Image
              src="/noise.png" // Ganti dengan QR code asli
              alt="QR Code untuk Share"
              width={150}
              height={150}
            />
            <p className="text-sm text-gray-600 mt-4 mb-4 max-w-xs">
              Yuk share ke temen kamu untuk coba AI ini dengan scan barcode di
              atas!
            </p>
            <div className="flex space-x-3 w-full">
              <button className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-100 transition">
                <Instagram className="w-4 h-4" />
                <span>tiebymin</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-100 transition">
                <Music className="w-4 h-4" />
                <span>tiebymin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Analisa Wajah */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {userData.faceShapeAnalysis.map((shape) => (
              <ShapeBar key={shape.label} {...shape} />
            ))}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Bentuk wajah kamu {userData.faceShape}
            </h2>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              {userData.faceShapeDesc}
            </p>
          </div>
        </div>

        {/* Color Tone */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800">
            Color tone kamu {userData.colorTone}
          </h2>
          <p className="text-gray-600 mt-2 mb-6 text-sm">
            {userData.colorToneDesc}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorPalette
              title="Best Color"
              colors={userData.colorPalettes.best}
            />
            <ColorPalette
              title="Neutral Color"
              colors={userData.colorPalettes.neutral}
            />
            <ColorPalette
              title="Worst Color"
              colors={userData.colorPalettes.worst}
            />
            <ColorPalette
              title="Combination"
              colors={userData.colorPalettes.combination}
            />
          </div>
        </div>

        {/* Bentuk Tubuh & BMI */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Bentuk tubuh kamu {userData.bodyShape}
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            {userData.bodyShapeDesc}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex justify-center items-center">
              <Image
                src={`/body-select/${userData.bodyShape.toLowerCase()}.png`}
                alt={`Bentuk tubuh ${userData.bodyShape}`}
                width={100}
                height={250}
                className="object-contain"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-bold text-sm mb-2">Karakteristik</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {userData.bodyCharacteristics.map((char, i) => (
                  <li key={i}>{char}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-bold text-sm mb-2">BMI Index</h4>
              <div className="w-full bg-gray-200 rounded-full h-4 relative my-3">
                <div
                  className="bg-[#EF789B] h-4 rounded-full"
                  style={{ width: `${userData.bmi.value}%` }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {typeof userData.bmi.value === 'number' ? userData.bmi.value.toFixed(2) : userData.bmi.value} {userData.bmi.category}
                </span>
              </div>
              <p className="text-sm text-gray-700 text-center">
                {userData.bmi.desc}
              </p>
            </div>
          </div>
        </div>
        {error && <div className="text-center p-4 text-red-500">{error}</div>}
      </main>
    </div>
  );
}
