import React from 'react';
import Image from 'next/image';
import { Instagram, Music, Download, Share2 } from 'lucide-react';
import QRCode from 'react-qr-code';

// Story page data interface
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

// Default fallback data
export const defaultStoryUserData: StoryUserData = {
  name: "User",
  faceShape: "Kotak",
  faceShapeDesc:
    "Bentuk wajah kamu itu kotak! Kamu punya garis rahang yang tegas dan dahi nggak terlalu lebar atau sempit.",
  faceShapeAnalysis: [
    { label: "Square", value: 90, active: true },
    { label: "Oblong", value: 40 },
    { label: "Oval", value: 60 },
    { label: "Round", value: 20 },
    { label: "Heart", value: 50 },
    { label: "Diamond", value: 70 },
  ],
  colorTone: "Cool Winter",
  colorToneDesc:
    "Ini berarti kulitmu memiliki undertone dingin dengan hint biru atau pink yang memberikan kesan elegan.",
  colorPalettes: {
    best: ["#323232", "#3B3B98", "#653456", "#6A2E35", "#37598B", "#692F5C"],
    neutral: ["#323232", "#6B7280", "#4A4A4A", "#9CA3AF", "#D1D5DB", "#111827"],
    worst: ["#F59E0B", "#FACC15", "#D97706", "#B45309", "#78350F", "#451A03"],
    combination: [
      "#DC2626",
      "#3B82F6",
      "#323232",
      "#6B21A8",
      "#9333EA",
      "#C084FC",
    ],
  },
  bodyShape: "Hourglass",
  bodyShapeDesc:
    "Bentuk Tubuhmu Memiliki Proporsi Seimbang Antara Bagian Atas Dan Bawah, Dengan Pinggang Yang Terlihat Ramping.",
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

// Component for Shape Bar
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
      className={`text-sm ${active ? "font-bold text-gray-800" : "text-gray-500"}`}
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

// Component for Color Palette
export const ColorPalette = ({
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

// Header component
export const StoryHeader = () => (
  <header className="flex justify-between items-center mb-6">
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
        className="bg-gray-100 p-2 rounded-full"
      >
        <Instagram size={18} />
      </a>
      <a
        href="https://www.tiktok.com/@tiebymin"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-100 p-2 rounded-full"
      >
        <Music size={18} />
      </a>
    </div>
  </header>
);

// User Profile section
export const UserProfile = ({
  name,
  userPhotoUrl,
}: {
  name: string;
  userPhotoUrl: string | null;
}) => (
  <div className="flex items-center space-x-4 mb-6">
    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
      <Image
        src={userPhotoUrl || "/model.png"}
        alt="User Photo"
        fill
        className="object-cover"
        unoptimized
      />
    </div>
    <div>
      <h2 className="font-bold text-lg">{name}</h2>
      <p className="text-sm text-gray-500">Hasil Analisa Personal</p>
    </div>
  </div>
);

// Face Shape Analysis section
export const FaceShapeSection = ({
  userData,
}: {
  userData: StoryUserData;
}) => (
  <section className="mb-8">
    <h3 className="text-lg font-bold mb-2 flex items-center">
      <div className="w-1 h-6 bg-[#EF789B] mr-2"></div>
      Bentuk Wajah: {userData.faceShape}
    </h3>
    <p className="text-sm text-gray-600 mb-4">{userData.faceShapeDesc}</p>

    <div className="space-y-2 mb-4">
      {userData.faceShapeAnalysis.map((shape, index) => (
        <ShapeBar
          key={index}
          label={shape.label}
          value={shape.value}
          active={shape.active}
        />
      ))}
    </div>
  </section>
);

// Color Tone Analysis section
export const ColorToneSection = ({
  userData,
}: {
  userData: StoryUserData;
}) => (
  <section className="mb-8">
    <h3 className="text-lg font-bold mb-2 flex items-center">
      <div className="w-1 h-6 bg-[#EF789B] mr-2"></div>
      Tone Warna: {userData.colorTone}
    </h3>
    <p className="text-sm text-gray-600 mb-4">{userData.colorToneDesc}</p>

    <div className="grid grid-cols-2 gap-4">
      <ColorPalette title="Warna Terbaik" colors={userData.colorPalettes.best} />
      <ColorPalette title="Warna Netral" colors={userData.colorPalettes.neutral} />
      <ColorPalette
        title="Warna yang Dihindari"
        colors={userData.colorPalettes.worst}
      />
      <ColorPalette
        title="Kombinasi Warna"
        colors={userData.colorPalettes.combination}
      />
    </div>
  </section>
);

// Body Shape Analysis section
export const BodyShapeSection = ({
  userData,
}: {
  userData: StoryUserData;
}) => (
  <section className="mb-8">
    <h3 className="text-lg font-bold mb-2 flex items-center">
      <div className="w-1 h-6 bg-[#EF789B] mr-2"></div>
      Bentuk Tubuh: {userData.bodyShape}
    </h3>
    <p className="text-sm text-gray-600 mb-4">{userData.bodyShapeDesc}</p>

    <div className="bg-gray-100 p-4 rounded-lg">
      <h4 className="font-semibold mb-2">Karakteristik:</h4>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
        {userData.bodyCharacteristics.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  </section>
);

// BMI Analysis section
export const BMISection = ({ userData }: { userData: StoryUserData }) => (
  <section className="mb-8">
    <h3 className="text-lg font-bold mb-2 flex items-center">
      <div className="w-1 h-6 bg-[#EF789B] mr-2"></div>
      BMI: {userData.bmi.category}
    </h3>
    <p className="text-sm text-gray-600 mb-4">{userData.bmi.desc}</p>

    <div className="bg-gray-100 p-4 rounded-lg text-center">
      <div className="text-3xl font-bold text-gray-800 mb-1">
        {userData.bmi.value.toFixed(1)}
      </div>
      <div className="text-sm text-gray-500">Body Mass Index</div>
    </div>
  </section>
);

// QR Code and Share section
export const ShareSection = () => (
  <section className="mt-12 border-t pt-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-bold mb-2">Dapatkan Analisa Kamu</h3>
        <p className="text-sm text-gray-600 mb-4">
          Scan QR code untuk analisa personal
        </p>
      </div>
      <div className="bg-white p-2 rounded-lg">
        <QRCode
          value="https://tiebymin.com"
          size={80}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        />
      </div>
    </div>
  </section>
);

// Action Buttons
export const ActionButtons = ({
  onDownload,
  onShare,
  isDownloading,
}: {
  onDownload: () => void;
  onShare: () => void;
  isDownloading: boolean;
}) => (
  <div className="flex space-x-2 mt-6">
    <button
      onClick={onDownload}
      disabled={isDownloading}
      className="flex-1 bg-[#EF789B] text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 disabled:bg-gray-400"
    >
      <Download size={18} />
      <span>{isDownloading ? "Downloading..." : "Download"}</span>
    </button>
    <button
      onClick={onShare}
      className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
    >
      <Share2 size={18} />
      <span>Share</span>
    </button>
  </div>
);