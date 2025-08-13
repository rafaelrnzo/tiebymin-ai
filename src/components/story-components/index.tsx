// @/components/story-components.tsx (VERSI RENOVASI)

import React from "react";
import Image from "next/image";
import { Instagram, Music, Download, Share2 } from "lucide-react";
import QRCode from "react-qr-code";

// Interface tidak berubah, karena struktur datanya masih relevan.
export interface StoryUserData {
  name: string;
  faceShape: string;
  faceShapeDesc: string;
  faceShapeAnalysis: {
    label: string;
    value: number;
    active?: boolean;
  }[];
  colorTone: string;
  colorToneDesc: string;
  colorPalettes: {
    best: string[];
    neutral: string[];
    worst: string[];
    combination: string[];
  };
  bodyShape: string;
  bodyShapeDesc: string;
  bodyCharacteristics: string[];
  bmi: {
    value: number;
    category: string;
    desc: string;
  };
}

export const MainHeader = ({
  name,
  userPhotoUrl,
}: {
  name: string;
  userPhotoUrl: string | null;
}) => (
  <header className="mb-6">
    <div className="flex justify-between items-center mb-4">
      <Image
        src="/tie-by-min-logo.png"
        alt="Logo Tie By Min"
        width={120}
        height={40}
        className="h-auto"
      />
      <div className="flex space-x-2">
        <a
          href="https://www.instagram.com/tiebymin/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Instagram size={18} />
        </a>
        <a
          href="https://www.tiktok.com/@tiebymin"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Music size={18} />
        </a>
      </div>
    </div>
    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-lg">
        <Image
          src={userPhotoUrl || "/model.png"}
          alt="User Photo"
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div>
        <p className="text-sm text-rose-500 font-semibold">
          Hasil Analisa Personal
        </p>
        <h2 className="font-bold text-2xl text-gray-800">{name}</h2>
      </div>
    </div>
  </header>
);

// Komponen helper tidak perlu diubah
export const ShapeBar = ({
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

// Komponen helper tidak perlu diubah
export const ColorPalette = ({
  title,
  colors,
}: {
  title: string;
  colors: string[];
}) => (
  <div className="text-center">
    <h4 className="font-semibold text-xs text-gray-600 mb-2">{title}</h4>
    <div className="flex space-x-1 justify-center">
      {colors.map((color, index) => (
        <div
          key={index}
          className="w-7 h-7 rounded-md shadow-sm border border-gray-100"
          style={{ backgroundColor: color }}
        ></div>
      ))}
    </div>
  </div>
);

// RENOVASI 2: 'FaceShapeSection' dirombak total
export const FaceShapeSection = ({ userData }: { userData: StoryUserData }) => (
  <section className="mb-8 p-4 border rounded-xl bg-white shadow-sm">
    <h3 className="text-lg font-bold mb-1 text-gray-800">
      Bentuk Wajah: <span className="text-[#EF789B]">{userData.faceShape}</span>
    </h3>
    <p className="text-sm text-gray-600 mb-4">{userData.faceShapeDesc}</p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
      {userData.faceShapeAnalysis.map((shape) => (
        <ShapeBar
          key={shape.label}
          label={shape.label}
          value={shape.value}
          active={shape.active}
        />
      ))}
    </div>
  </section>
);

// RENOVASI 3: 'ColorToneSection' dirombak total
export const ColorToneSection = ({ userData }: { userData: StoryUserData }) => (
  <section className="mb-8 p-4 border rounded-xl bg-white shadow-sm">
    <h3 className="text-lg font-bold mb-1 text-gray-800">
      Tone Warna: <span className="text-[#EF789B]">{userData.colorTone}</span>
    </h3>
    <p className="text-sm text-gray-600 mb-4">{userData.colorToneDesc}</p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <ColorPalette
        title="Warna Terbaik"
        colors={userData.colorPalettes.best}
      />
      <ColorPalette
        title="Warna Netral"
        colors={userData.colorPalettes.neutral}
      />
      <ColorPalette
        title="Warna Dihindari"
        colors={userData.colorPalettes.worst}
      />
      <ColorPalette
        title="Kombinasi"
        colors={userData.colorPalettes.combination}
      />
    </div>
  </section>
);

// RENOVASI 4: 'BodyShapeSection' dan 'BMISection' dirombak dan digabung
export const BodyAndBmiSection = ({
  userData,
}: {
  userData: StoryUserData;
}) => (
  <section className="mb-8 p-4 border rounded-xl bg-white shadow-sm">
    <h3 className="text-lg font-bold mb-1 text-gray-800">
      Bentuk Tubuh & BMI:{" "}
      <span className="text-[#EF789B]">
        {userData.bodyShape} & {userData.bmi.category}
      </span>
    </h3>
    <p className="text-sm text-gray-600 mb-4">{userData.bodyShapeDesc}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="font-semibold text-sm mb-2 text-gray-700">
          Karakteristik Tubuh:
        </h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          {userData.bodyCharacteristics.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg text-center">
        <h4 className="font-semibold text-sm mb-2 text-gray-700">
          Body Mass Index (BMI)
        </h4>
        <div className="text-4xl font-bold text-[#EF789B] mb-1">
          {userData.bmi.value.toFixed(1)}
        </div>
        <p className="text-sm text-gray-600">{userData.bmi.desc}</p>
      </div>
    </div>
  </section>
);

// RENOVASI 5: 'ShareSection' dan 'ActionButtons' digabung
export const ShareAndActionSection = ({
  onDownload,
  onShare,
  isDownloading,
}: {
  onDownload: () => void;
  onShare: () => void;
  isDownloading: boolean;
}) => (
  <section className="mt-8 p-4 border rounded-xl bg-white shadow-sm">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-white p-1 rounded-md border">
          <QRCode
            value="https://tiebymin.com"
            size={64}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Share Hasil Analisamu!</h3>
          <p className="text-sm text-gray-600">
            Scan QR atau klik tombol di samping.
          </p>
        </div>
      </div>
      <div className="flex w-full md:w-auto space-x-2">
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="flex-1 bg-[#EF789B] text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 disabled:bg-rose-300 hover:bg-rose-500 transition-colors"
        >
          <Download size={18} />
          <span>{isDownloading ? "Mengunduh..." : "Story"}</span>
        </button>
        <button
          onClick={onShare}
          className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-700 transition-colors"
        >
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>
    </div>
  </section>
);

// Komponen lama yang tidak terpakai lagi setelah digabung bisa dihapus
// atau disimpan untuk referensi. Untuk kebersihan, saya tidak menampilkannya di sini.
// Komponen yang digantikan: StoryHeader, UserProfile, BodyShapeSection, BMISection, ShareSection, ActionButtons
