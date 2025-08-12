"use client";
import React, { useState } from "react";

import { Sparkles, User, Palette, Ruler, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";

// Data tiruan untuk konten dinamis
const userData = {
  name: "Yasmin Azizah",
  faceShape: "Kotak",
  bodyShape: "Hourglass",
  colorTone: "Cool Winter",
  bmi: 52.2,
  celebrityMatch: {
    name: "Cut Syifa",
    matchPercentage: 88,
    imageUrl: "https://placehold.co/400x500/f0f0f0/333?text=Cut+Syifa",
    reason: [
      "Kamu punya Rahang tegas dan kuat",
      "Dahi dan rahang memiliki lebar yang hampir sama",
      "Panjang dan lebar wajah hampir seimbang",
    ],
  },
  faceShapeAnalysis: {
    uniqueFact:
      "Bentuk wajah kamu itu kotak! Kamu punya garis rahang yang tegas dan dahi nggak terlalu lebar atau sempit.",
    characteristics: [
      "Kamu punya Rahang tegas dan kuat",
      "Dahi dan rahang memiliki lebar yang hampir sama",
      "Panjang dan lebar wajah hampir seimbang",
    ],
  },
  bodyShapeAnalysis: {
    description:
      "Bagian Tengah Tubuhmu Lebih Dominan, Dengan Bagian Tengah Yang Lebih Menonjol Dan Bahu Yang Lebar Serta Bagian Dada Yang Penuh.",
    characteristics: [
      "Kamu punya Rahang tegas dan kuat",
      "Dahi dan rahang memiliki lebar yang hampir sama",
      "Panjang dan lebar wajah hampir seimbang",
    ],
  },
  colorToneAnalysis: {
    description:
      "Ini berarti kulitmu memiliki undertone dingin dengan hint biru atau pink yang memberikan kesan elegan.",
    bestColors: ["#C7D2FE", "#BFDBFE", "#E0E7FF", "#E5E7EB"],
    neutralColors: ["#A3A3A3", "#6B7280", "#9CA3AF", "#D1D5DB"],
    worstColors: ["#F59E0B", "#FACC15", "#FEF08A", "#FDE68A"],
    combination: ["#F472B6", "#60A5FA", "#3B82F6", "#1E3A8A"],
    tips: {
      makeup: [
        "Kamu punya Rahang tegas dan kuat",
        "Dahi dan rahang memiliki lebar yang hampir sama",
        "Panjang dan lebar wajah hampir seimbang",
      ],
      outfit: [
        "Kamu punya Rahang tegas dan kuat",
        "Dahi dan rahang memiliki lebar yang hampir sama",
        "Panjang dan lebar wajah hampir seimbang",
      ],
      personality: [
        "Kamu punya Rahang tegas dan kuat",
        "Dahi dan rahang memiliki lebar yang hampir sama",
        "Panjang dan lebar wajah hampir seimbang",
      ],
      characteristics: [
        "Kamu punya Rahang tegas dan kuat",
        "Dahi dan rahang memiliki lebar yang hampir sama",
        "Panjang dan lebar wajah hampir seimbang",
      ],
    },
  },
  conclusionTips: {
    face: [
      "Kamu punya Rahang tegas dan kuat",
      "Dahi dan rahang memiliki lebar yang hampir sama",
      "Panjang dan lebar wajah hampir seimbang",
    ],
    body: [
      "Kamu punya Rahang tegas dan kuat",
      "Dahi dan rahang memiliki lebar yang hampir sama",
      "Panjang dan lebar wajah hampir seimbang",
    ],
    color: [
      "Kamu punya Rahang tegas dan kuat",
      "Dahi dan rahang memiliki lebar yang hampir sama",
      "Panjang dan lebar wajah hampir seimbang",
    ],
    quickRecap: [
      "Kamu punya Rahang tegas dan kuat",
      "Dahi dan rahang memiliki lebar yang hampir sama",
      "Panjang dan lebar wajah hampir seimbang",
    ],
  },
};

// Komponen #1: BackCover
const BackCover = () => (
  <div className="flex items-center justify-center w-full h-screen bg-[#333333]">
    <div className="text-white text-6xl font-bold">
      <span className="flex items-center">
        tie
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-1"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm3-8.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
        </svg>
        bymin
      </span>
    </div>
  </div>
);

// Komponen Pembantu: Header Halaman
const PageHeader = ({ name }: { name: string }) => (
  <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center">
    <div className="text-gray-800 text-2xl font-bold">
      <span className="flex items-center">
        tie
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mx-1"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm3-8.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
        </svg>
        bymin
      </span>
    </div>
    <div className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-md">
      {name}
    </div>
  </header>
);

// Komponen Pembantu: Footer Halaman
const PageFooter = ({ pageNumber }: { pageNumber: string }) => (
  <footer className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-center text-gray-600">
    <span>© 2025, Tiebymin AI</span>
    <span className="font-bold">{pageNumber}</span>
  </footer>
);

// Komponen #2: BodyShape
const BodyShape = () => (
  <div className="relative bg-[#F3F4F6] min-h-screen p-8 pt-24 font-sans">
    <PageHeader name={userData.name} />
    <main className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Bentuk tubuh kamu{" "}
        <span className="text-pink-500">{userData.bodyShape}</span>
      </h1>
      <p className="text-gray-600 mb-10">
        {userData.bodyShapeAnalysis.description}
      </p>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Kolom Kiri: Diagram */}
        <div className="flex justify-center items-center">
          <Image
            fill
            src="https://placehold.co/300x500/FFFFFF/CCCCCC?text=Hourglass+Shape"
            alt="Diagram Bentuk Tubuh Hourglass"
            className="max-w-full h-auto"
          />
        </div>
        {/* Kolom Kanan: Karakteristik */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Karakteristik</h3>
          <ul className="list-disc list-inside space-y-2">
            {userData.bodyShapeAnalysis.characteristics.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bagian BMI Index */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">BMI Index</h2>
        <p className="text-gray-600 mb-4">
          {userData.bodyShapeAnalysis.description}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-4 relative">
          <div
            className="bg-pink-400 h-4 rounded-full"
            style={{ width: `${userData.bmi}%` }}
          ></div>
          <div
            className="absolute px-3 py-1 text-sm font-bold text-white bg-gray-800 rounded-md shadow-lg"
            style={{ left: `calc(${userData.bmi}% - 2rem)` }}
          >
            {userData.bmi} Normal
          </div>
        </div>
        <p className="text-gray-600 mt-4">
          {userData.bodyShapeAnalysis.description}{" "}
          {userData.bodyShapeAnalysis.description}
        </p>
      </div>
    </main>
    <PageFooter pageNumber="03" />
  </div>
);

// Komponen #3: CelebritiesMatch
const CelebritiesMatch = () => (
  <div className="relative bg-[#F3F4F6] min-h-screen p-8 pt-24 font-sans">
    <PageHeader name={userData.name} />
    <main className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        Selebriti yang serupa <br /> dengan kamu
      </h1>
      <hr className="w-24 border-t-4 border-gray-800 mb-10" />

      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Kolom Kiri: Gambar Selebriti */}
        <div className="relative">
          <Image
            fill
            src={userData.celebrityMatch.imageUrl}
            alt={userData.celebrityMatch.name}
            className="rounded-lg shadow-xl w-full"
          />
          <div className="absolute bottom-4 left-4 bg-pink-500 text-white text-lg font-bold px-4 py-2 rounded-full flex items-center shadow-lg">
            <Sparkles className="w-5 h-5 mr-2" />{" "}
            {userData.celebrityMatch.matchPercentage}% Match
          </div>
        </div>
        {/* Kolom Kanan: Detail */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {userData.celebrityMatch.name}
          </h2>
          <p className="text-gray-600 my-4">
            Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do
            Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.
          </p>
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-xl font-bold mb-4">Kenapa Cocok?</h3>
            <ul className="list-disc list-inside space-y-2">
              {userData.celebrityMatch.reason.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
    <PageFooter pageNumber="04" />
  </div>
);

// Komponen #4: ColorTone
const ColorTone = () => {
  const ColorPalette = ({
    title,
    colors,
  }: {
    title: string;
    colors: string[];
  }) => (
    <div>
      <h3 className="font-semibold text-gray-500 mb-2">{title}</h3>
      <div className="flex space-x-2">
        {colors.map((color: string, index: number) => (
          <div
            key={index}
            className="w-12 h-12 rounded-md shadow"
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
    </div>
  );

  const InfoSection = ({
    title,
    items,
    icon,
  }: {
    title: string;
    items: string[];
    icon: React.ReactNode;
  }) => (
    <div>
      <h3 className="text-xl font-bold text-pink-500 mb-3 flex items-center">
        {icon} {title}
      </h3>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        {items.map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="relative bg-[#F3F4F6] min-h-screen p-8 pt-24 font-sans">
      <PageHeader name={userData.name} />
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Color tone kamu{" "}
          <span className="text-blue-500">{userData.colorTone}</span>
        </h1>
        <p className="text-gray-600 mb-10">
          {userData.colorToneAnalysis.description}
        </p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12">
          <ColorPalette
            title="Best Color"
            colors={userData.colorToneAnalysis.bestColors}
          />
          <ColorPalette
            title="Neutral Color"
            colors={userData.colorToneAnalysis.neutralColors}
          />
          <ColorPalette
            title="Worst Color"
            colors={userData.colorToneAnalysis.worstColors}
          />
          <ColorPalette
            title="Combination"
            colors={userData.colorToneAnalysis.combination}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <InfoSection
            title="Make Up Tips"
            items={userData.colorToneAnalysis.tips.makeup}
            icon={<Palette className="mr-2" />}
          />
          <InfoSection
            title="Outfit Tips"
            items={userData.colorToneAnalysis.tips.outfit}
            icon={<Ruler className="mr-2" />}
          />
          <InfoSection
            title="Personality"
            items={userData.colorToneAnalysis.tips.personality}
            icon={<User className="mr-2" />}
          />
          <InfoSection
            title="Karakteristik"
            items={userData.colorToneAnalysis.tips.characteristics}
            icon={<Star className="mr-2" />}
          />
        </div>
      </main>
      <PageFooter pageNumber="02" />
    </div>
  );
};

// Komponen #5: Conclusion
const Conclusion = () => {
  const TipBox = ({ title, items }: { title: string; items: string[] }) => (
    <div className="border border-gray-300 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        {items.map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="relative bg-[#F3F4F6] min-h-screen p-8 pt-24 font-sans">
      <PageHeader name={userData.name} />
      <main className="max-w-4xl mx-auto">
        <TipBox
          title="Tips untuk bentuk wajah kamu"
          items={userData.conclusionTips.face}
        />
        <TipBox
          title="Tips untuk bentuk badan kamu"
          items={userData.conclusionTips.body}
        />
        <TipBox
          title="Tips untuk tone warna kamu"
          items={userData.conclusionTips.color}
        />

        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Sparkles className="mr-3" />
            Rekap Cepat Tips Kamu
          </h2>
          <ul className="list-disc list-inside space-y-2">
            {userData.conclusionTips.quickRecap.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </main>
      <PageFooter pageNumber="01" />
    </div>
  );
};

// Komponen #6: Cover
const Cover = () => (
  <div className="relative bg-[#F3F4F6] h-screen flex flex-col font-sans">
    <PageHeader name={userData.name} />
    <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-6xl md:text-8xl font-extrabold text-gray-800 leading-tight">
        HASIL ANALISA
        <br />
        LENGKAP
      </h1>
    </main>
    <div
      className="w-full h-1/3 bg-repeat-x bg-center"
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/flowers.png')",
        backgroundSize: "auto 150px",
        filter: "opacity(0.7)",
      }}
    >
      {/* Div ini untuk pola bunga. Menggunakan tekstur transparan untuk meniru efek. */}
      <div
        className="w-full h-full"
        style={{
          background: "linear-gradient(to right, #f472b6, #f87171, #fb923c)",
        }}
      ></div>
    </div>
    <footer className="absolute bottom-0 left-0 right-0 p-8 text-gray-600">
      <span>© 2025, Tiebymin AI</span>
    </footer>
  </div>
);

// Komponen #7: FaceShape
const FaceShape = () => {
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
        className={`text-lg ${
          active ? "font-bold text-gray-800" : "text-gray-500"
        }`}
      >
        {label}
      </span>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
        <div
          className="bg-gray-800 h-2.5 rounded-full"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="relative bg-[#F3F4F6] min-h-screen p-8 pt-24 font-sans">
      <PageHeader name={userData.name} />
      <main className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        {/* Kolom Kiri: Gambar Wajah */}
        <div className="flex justify-center items-start">
          <Image
            fill
            src="https://placehold.co/400x500/e0e0e0/555?text=Analisis+Wajah"
            alt="Analisis Bentuk Wajah"
            className="rounded-lg shadow-xl w-full"
          />
        </div>
        {/* Kolom Kanan: Detail Analisis */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bentuk wajah kamu{" "}
            <span className="text-purple-600">{userData.faceShape}</span>
          </h1>
          <p className="text-gray-600 mb-8">
            Wajah berbentuk kotak memiliki panjang dan lebar yang hampir sama
            dengan garis rahang yang tegas dan dahi yang lebar. Sudut-sudut
            wajah terlihat jelas dan tajam.
          </p>

          <div className="space-y-4 mb-10">
            <ShapeBar label="Square" value={90} active={true} />
            <ShapeBar label="Oblong" value={40} />
            <ShapeBar label="Oval" value={60} />
            <ShapeBar label="Round" value={30} />
            <ShapeBar label="Heart" value={50} />
            <ShapeBar label="Diamond" value={70} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <ThumbsUp className="text-purple-600 mr-2" />
              Fakta Unik
            </h3>
            <p className="text-gray-600">
              {userData.faceShapeAnalysis.uniqueFact}
            </p>
          </div>

          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Karakteristik</h3>
            <ul className="list-disc list-inside space-y-2">
              {userData.faceShapeAnalysis.characteristics.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <PageFooter pageNumber="01" />
    </div>
  );
};

// Komponen App Utama untuk menavigasi antar halaman
export default function App() {
  const pages: { [key: string]: React.ComponentType } = {
    Cover,
    FaceShape,
    ColorTone,
    BodyShape,
    CelebritiesMatch,
    Conclusion,
    BackCover,
  };
  const [activePage, setActivePage] = useState<keyof typeof pages>("Cover");

  const ActiveComponent = pages[activePage];

  return (
    <div className="bg-gray-100">
      <nav className="p-4 bg-white shadow-md sticky top-0 z-50 flex flex-wrap justify-center gap-2">
        {Object.keys(pages).map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activePage === page
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
      </nav>
      <div className="w-full">
        <ActiveComponent />
      </div>
    </div>
  );
}
