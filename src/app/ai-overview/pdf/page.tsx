"use client";
import React, { useState } from "react";

import { Palette, Ruler, Sparkles, Star, User } from "lucide-react";
import Image from "next/image";

const userData = {
  name: "Yasmin Azizah",
  faceShape: "Kotak",
  bodyShape: "Hourglass",
  colorTone: "Cool Winter",
  bmi: 52.2,
  celebrityMatch: {
    name: "Cut Syifa",
    matchPercentage: 88,
    imageUrl: "https://placehold.co/400/f0f0f0/333?text=Selebriti",
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
    bestColors: [
      "#C7D2FE",
      "#BFDBFE",
      "#E0E7FF",
      "#E5E7EB",
      "#F472B6",
      "#60A5FA",
    ],
    neutralColors: [
      "#A3A3A3",
      "#6B7280",
      "#9CA3AF",
      "#D1D5DB",
      "#F59E0B",
      "#FACC15",
    ],
    worstColors: [
      "#F59E0B",
      "#FACC15",
      "#FEF08A",
      "#FDE68A",
      "#C7D2FE",
      "#BFDBFE",
    ],
    combination: [
      "#F472B6",
      "#60A5FA",
      "#3B82F6",
      "#1E3A8A",
      "#C7D2FE",
      "#BFDBFE",
    ],
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

const BackCover = () => (
  <div className="flex items-center justify-center w-full h-screen bg-[#333333]">
    <Image
      src="/tie-by-min-logo-light.png"
      alt="Logo Tie By Min Putih"
      width={250}
      height={80}
      priority
    />
  </div>
);

const PageHeader = ({
  name,
  width,
  fill,
}: {
  name: string;
  width?: number;
  fill?: boolean;
}) => (
  <header className="flex justify-between items-center mt-10">
    <Image
      src="/tie-by-min-logo.png"
      alt="Logo Tie By Min"
      width={width ?? 180}
      height={80}
      className="ml-10"
    />
    {fill ? (
      <div className="font-poppins bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-sm text-start w-[180px]">
        {name}
      </div>
    ) : (
      <div className="font-poppins text-gray-800 text-sm font-semibold px-4 py-2 rounded-sm text-start w-[180px]">
        {name}
      </div>
    )}
  </header>
);

const PageFooter = ({ pageNumber }: { pageNumber: string }) => (
  <footer className="w-full flex justify-between text-gray-600 my-10 ml-10">
    <span>© 2025, Tiebymin AI</span>
    <span className="font-bold">{pageNumber}</span>
  </footer>
);

const BodyShape = () => (
  <div className="relative bg-[#F3F4F6] min-h-screen">
    <PageHeader width={100} name={userData.name} />
    <main className="mx-auto">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="flex justify-center items-center">
          <Image
            width={200}
            height={400}
            src="/model-pdf.png"
            alt="Diagram Bentuk Tubuh Hourglass"
            className="object-contain"
          />
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Bentuk tubuh kamu{" "}
              <span className="text-pink-500">{userData.bodyShape}</span>
            </h1>
            <p className="text-gray-600 mb-10">
              {userData.bodyShapeAnalysis.description}
            </p>
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Karakteristik</h3>
              <ul className="list-disc list-inside space-y-2">
                {userData.bodyShapeAnalysis.characteristics.map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">BMI Index</h2>
        <p className="text-gray-600 mb-4">
          {userData.bodyShapeAnalysis.description}
        </p>
        <div className="w-full bg-gray-200 rounded-md h-10 relative">
          <div
            className="bg-gradient-to-r from-[#FF7EA4] to-[#FFA2BD] h-10 rounded-md"
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

const CelebritiesMatch = () => (
  <div className="relative bg-[#F3F4F6] min-h-screen p-8 pt-32 font-sans">
    <PageHeader name={userData.name} />
    <main className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        Selebriti yang serupa <br /> dengan kamu
      </h1>
      <hr className="w-24 border-t-4 border-gray-800 mb-10" />

      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="relative w-full aspect-[4/5] rounded-lg shadow-xl overflow-hidden">
          <Image
            fill
            src={userData.celebrityMatch.imageUrl}
            alt={userData.celebrityMatch.name}
            className="object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-pink-500 text-white text-lg font-bold px-4 py-2 rounded-full flex items-center shadow-lg">
            <Sparkles className="w-5 h-5 mr-2" />{" "}
            {userData.celebrityMatch.matchPercentage}% Match
          </div>
        </div>
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

const ColorTone = () => {
  const ColorPalette = ({
    title,
    colors,
  }: {
    title?: string;
    colors: string[];
  }) => (
    <div>
      <h3 className="font-semibold text-gray-500 mb-2">{title}</h3>
      <div className="grid grid-cols-3 w-1/2 gap-x-10">
        {colors.map((color: string, index: number) => (
          <div
            key={index}
            className="w-[100px] h-[30px] shadow-md mt-2"
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
    <div className="m-10 flex flex-col justify-center items-center">
      <h3 className="text-xl font-bold text-[#EF789B] mb-3 flex items-center text-center">
        {icon} {title}
      </h3>
      {items.map((item: string, index: number) => (
        <span key={index} className="text-white">
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative bg-[#F3F4F6] min-h-screen">
      <PageHeader width={100} name={userData.name} />
      <main className="mt-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 mx-10 font-oswald">
          Color tone kamu {userData.colorTone}
        </h1>
        <p className="text-gray-600 mb-10 font-poppins mx-10">
          {userData.colorToneAnalysis.description}
        </p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-18 mx-10">
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

        <div className="grid md:grid-cols-2 gap-10 bg-[#323232] w-full">
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
          <PageFooter pageNumber="02" />
        </div>
      </main>
    </div>
  );
};

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
    <div className="relative bg-[#F3F4F6] min-h-screen p-8 pt-32 font-sans">
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

const Cover = () => (
  <div className="relative bg-[#F3F4F6] flex flex-col overflow-hidden">
    <PageHeader fill name={userData.name} />
    <main className="flex flex-col px-10 pt-10">
      <h1 className="font-oswald text-6xl md:text-8xl font-extrabold text-gray-800 leading-tight">
        HASIL ANALISA
        <br />
        LENGKAP
      </h1>
    </main>
    <Image
      src="/many-flower.png"
      alt="Pola Bunga Latar Belakang"
      width={1000}
      height={1000}
      className="object-contain w-full mt-12"
    />
    <PageFooter pageNumber="" />
  </div>
);

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
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
        <div
          className="bg-[#EF789B] h-2.5 rounded-full"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="relative bg-[#F3F4F6] min-h-screen">
      <PageHeader width={100} name={userData.name} />
      <main className="mx-auto grid md:grid-cols-2 gap-10 mt-10 items-start">
        <div className="relative w-full aspect-[4/5] rounded-lg shadow-xl overflow-hidden">
          <Image
            src="/model.png"
            alt="Logo Tie By Min"
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-oswald text-3xl font-bold text-gray-800 mb-2">
            Bentuk wajah kamu {userData.faceShape}
          </h1>
          <p className="text-gray-600 my-6 font-poppins">
            Wajah berbentuk kotak memiliki panjang dan lebar yang hampir sama
            dengan garis rahang yang tegas dan dahi yang lebar. Sudut-sudut
            wajah terlihat jelas dan tajam.
          </p>
          <div className="space-y-10 mb-10">
            <ShapeBar label="Square" value={90} active={true} />
            <ShapeBar label="Oblong" value={40} />
            <ShapeBar label="Oval" value={60} />
            <ShapeBar label="Round" value={30} />
            <ShapeBar label="Heart" value={50} />
            <ShapeBar label="Diamond" value={70} />
          </div>
        </div>
      </main>
      <div className="flex mx-auto">
        <div className="pt-6 mb-6 w-1/2">
          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
            Fakta Unik
          </h3>
          <p className="text-gray-600">
            {userData.faceShapeAnalysis.uniqueFact}
          </p>
        </div>

        <div className="bg-[#323232] text-white p-6 ml-4 w-1/2">
          <h3 className="font-poppins text-xl font-bold mb-4 text-[#EF789B]">
            Karakteristik
          </h3>
          <ul className="list-disc list-inside space-y-2">
            {userData.faceShapeAnalysis.characteristics.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <PageFooter pageNumber="01" />
    </div>
  );
};

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
