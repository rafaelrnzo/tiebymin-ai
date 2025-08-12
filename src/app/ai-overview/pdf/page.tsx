"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

import { Palette, Ruler, Sparkles, Star, User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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

// Komponen Halaman
export const BackCover = () => (
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

export const PageHeader = ({
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

export const PageFooter = ({ pageNumber }: { pageNumber: string }) => (
  <footer className="w-full flex justify-between text-gray-600 my-10 px-10">
    <span>© 2025, Tiebymin AI</span>
    <span className="font-bold">{pageNumber}</span>
  </footer>
);

export const BodyShape = () => (
  <div className="relative bg-white min-h-screen p-8">
    <PageHeader width={100} name={userData.name} />
    <main className="mx-auto py-12 max-w-5xl">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <Image
            width={250}
            height={500}
            src="https://placehold.co/250x500/FFFFFF/CCCCCC?text=Bentuk+Tubuh"
            alt={`Diagram Bentuk Tubuh ${userData.bodyShape}`}
            className="object-contain"
            unoptimized
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-oswald">
            Bentuk tubuh kamu {userData.bodyShape}
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {userData.bodyShapeAnalysis.description}
          </p>
          <div className="bg-[#323232] text-white p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Karakteristik</h3>
            <ul className="list-disc list-inside space-y-2">
              {userData.bodyShapeAnalysis.characteristics.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">BMI Index</h2>
        <p className="text-gray-600 mb-6">
          {userData.bodyShapeAnalysis.description}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-4 relative my-8">
          <div
            className="bg-gradient-to-r from-[#EC7498] to-[#FCA4BE] h-4 rounded-full"
            style={{ width: `${userData.bmi}%` }}
          ></div>
          <div
            className="absolute -top-8 px-3 py-1 text-sm font-bold text-white bg-gray-800 rounded-md shadow"
            style={{ left: `calc(${userData.bmi}% - 2rem)` }}
          >
            {userData.bmi} Normal
          </div>
        </div>
      </div>
    </main>
    <PageFooter pageNumber="03" />
  </div>
);

export const CelebritiesMatch = () => (
  <div className="relative bg-white min-h-screen p-8">
    <PageHeader name={userData.name} />
    <main className="max-w-5xl mx-auto pt-12">
      <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4">
        Selebriti yang serupa <br /> dengan kamu
      </h1>
      <hr className="w-24 border-t-2 border-gray-900 mb-10" />
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-lg">
          <Image
            src="https://placehold.co/400x500/e8e8e8/333?text=Selebriti"
            alt={userData.celebrityMatch.name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute bottom-4 left-4 bg-[#FCA4BE] text-white font-bold px-4 py-2 rounded-lg flex items-center shadow-md">
            <Sparkles className="w-5 h-5 mr-2" />
            {userData.celebrityMatch.matchPercentage}% Match
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {userData.celebrityMatch.name}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do
            Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.
          </p>
          <div className="bg-[#323232] text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Kenapa Cocok?</h3>
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

export const ColorTone = () => {
  const ColorPalette = ({
    title,
    colors,
  }: {
    title?: string;
    colors: string[];
  }) => (
    <div>
      <h3 className="font-semibold text-gray-500 mb-4">{title}</h3>
      <div className="grid grid-cols-3 gap-3">
        {colors.map((color: string, index: number) => (
          <div
            key={index}
            className="w-full h-[30px] shadow-md rounded"
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
    <div className="text-center">
      <h3 className="text-xl font-bold text-[#EF789B] mb-3 flex items-center justify-center">
        {icon} {title}
      </h3>
      <ul className="space-y-1 text-white">
        {items.map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="relative bg-white min-h-screen">
      <PageHeader width={100} name={userData.name} />
      <main className="py-10">
        <div className="max-w-5xl mx-auto px-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 font-oswald">
            Color tone kamu {userData.colorTone}
          </h1>
          <p className="text-gray-600 mb-12 font-poppins">
            {userData.colorToneAnalysis.description}
          </p>
          <div className="grid grid-cols-2 gap-12">
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
        </div>
        <div className="mt-16 bg-[#323232] py-10">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
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
        </div>
      </main>
      <PageFooter pageNumber="02" />
    </div>
  );
};

export const Conclusion = () => {
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
    <div className="relative bg-white min-h-screen p-8 font-sans">
      <PageHeader name={userData.name} />
      <main className="max-w-4xl mx-auto pt-10">
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

export const Cover = () => (
  <div className="relative bg-[#F3F4F6] h-screen flex flex-col overflow-hidden">
    <PageHeader fill name={userData.name} />
    <main className="flex-grow flex flex-col justify-center px-10">
      <h1 className="font-oswald text-8xl font-extrabold text-gray-800 leading-tight">
        HASIL ANALISA
        <br />
        LENGKAP
      </h1>
    </main>
    <div className="absolute bottom-0 left-0 right-0 h-1/3">
      <Image
        src="/many-flower.png"
        alt="Pola Bunga Latar Belakang"
        fill
        className="object-cover"
      />
    </div>
    <PageFooter pageNumber="" />
  </div>
);

export const FaceShape = () => {
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
        className={`text-lg font-poppins ${
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
    <div className="relative bg-white min-h-screen p-8">
      <PageHeader width={100} name={userData.name} />
      <main className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 mt-10 items-center">
        <div className="relative w-full aspect-[4/5] rounded-lg shadow-xl overflow-hidden">
          <Image
            src="/model.png"
            alt="Model Wajah"
            fill
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-oswald text-4xl font-bold text-gray-800 mb-2">
            Bentuk wajah kamu {userData.faceShape}
          </h1>
          <p className="text-gray-600 my-6 font-poppins leading-relaxed">
            Wajah berbentuk kotak memiliki panjang dan lebar yang hampir sama
            dengan garis rahang yang tegas dan dahi yang lebar. Sudut-sudut
            wajah terlihat jelas dan tajam.
          </p>
          <div className="space-y-8 mb-10">
            <ShapeBar label="Square" value={90} active={true} />
            <ShapeBar label="Oblong" value={40} />
            <ShapeBar label="Oval" value={60} />
            <ShapeBar label="Round" value={30} />
            <ShapeBar label="Heart" value={50} />
            <ShapeBar label="Diamond" value={70} />
          </div>
        </div>
      </main>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 mt-10">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Fakta Unik</h3>
          <p className="text-gray-600 leading-relaxed">
            {userData.faceShapeAnalysis.uniqueFact}
          </p>
        </div>
        <div className="bg-[#323232] text-white p-6 rounded-lg">
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

// Komponen utama dibungkus dalam Suspense untuk menangani useSearchParams
function PdfPage() {
  const searchParams = useSearchParams();
  const isPrintMode = searchParams.get("print") === "true";

  const pages: { [key: string]: React.ComponentType } = {
    Cover,
    FaceShape,
    ColorTone,
    BodyShape,
    CelebritiesMatch,
    Conclusion,
    BackCover,
  };
  const pageOrder = Object.keys(pages) as (keyof typeof pages)[];

  const [activePage, setActivePage] = useState<keyof typeof pages>("Cover");
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate PDF: ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hasil-analisa-lengkap.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Gagal mengunduh PDF. Silakan periksa konsol untuk detail.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Jika dalam mode cetak, render semua halaman untuk Puppeteer
  if (isPrintMode) {
    return (
      <main>
        {pageOrder.map((pageKey) => {
          const ComponentToPrint = pages[pageKey];
          return (
            <section key={pageKey} style={{ pageBreakAfter: "always" }}>
              <ComponentToPrint />
            </section>
          );
        })}
      </main>
    );
  }

  // Jika tidak, render UI interaktif
  const ActiveComponent = pages[activePage];

  return (
    <div className="bg-gray-100">
      <nav className="p-4 bg-white shadow-md sticky top-0 z-50 flex flex-wrap justify-center gap-2">
        {pageOrder.map((page) => (
          <Button
            key={page}
            onClick={() => setActivePage(page)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activePage === page
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {page}
          </Button>
        ))}
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition disabled:bg-gray-400"
        >
          {isDownloading ? "Downloading..." : "Download PDF"}
        </button>
      </nav>
      <div className="w-full">
        <ActiveComponent />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PdfPage />
    </Suspense>
  );
}
