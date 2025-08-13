import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
// Removed unused imports: Palette, Ruler, Star, User
import { UserData } from '@/hooks/useAnalysisData';

// Common Components
export const PageHeader = ({
  name,
  fill,
}: {
  name?: string;
  width?: number;
  fill?: boolean;
}) => (
  <header className="flex justify-between items-center">
    <Image
      src="/tie-by-min-logo.png"
      alt="Logo Tie By Min"
      width={180}
      height={80}
      className="ml-4 sm:ml-10 w-[120px] sm:w-auto"
    />
    {fill ? (
      <div className="font-poppins bg-gray-800 text-white text-xs sm:text-sm font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-sm text-start w-[140px] sm:w-[180px] mr-2 sm:mr-0 truncate">
        {name}
      </div>
    ) : (
      <div className="font-poppins text-gray-800 text-xs sm:text-sm font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-sm text-start w-[140px] sm:w-[180px] mr-2 sm:mr-0 truncate">
        {name}
      </div>
    )}
  </header>
);

export const PageFooter = ({ pageNumber }: { pageNumber: string }) => (
  <footer className="w-full flex justify-between text-gray-600 my-5 sm:my-10 px-4 sm:px-10 text-xs sm:text-base">
    <span>© 2025, Tiebymin AI</span>
    <span className="font-bold">{pageNumber}</span>
  </footer>
);

export const TipBox = ({ title, items }: { title: string; items: string[] }) => (
  <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <ul className="list-disc list-inside space-y-2">
      {items.map((item, index) => (
        <li key={index} className="text-gray-700">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

// Page Components
export const BackCover = () => (
  <div className="flex items-center justify-center w-full h-screen bg-[#333333]">
    <Image
      src="/tie-by-min-logo-light.png"
      alt="Logo Tie By Min Putih"
      width={250}
      height={80}
      priority
      unoptimized
    />
    <PageFooter pageNumber="" />
  </div>
);

export const Cover = ({ userData }: { userData: UserData }) => (
  <div className="relative bg-[#F3F4F6] h-screen flex flex-col overflow-hidden">
    <PageHeader fill name={userData.name} />
    <main className="flex-grow flex flex-col justify-center px-10">
      <h1 className="font-oswald text-8xl font-extrabold text-gray-800 leading-tight">
        HASIL ANALISA
        <br />
        LENGKAP
      </h1>
    </main>
    <PageFooter pageNumber="" />
  </div>
);

export const BodyShape = ({ userData }: { userData: UserData }) => (
  <div className="relative bg-white min-h-screen p-8">
    <PageHeader width={100} name={userData.name} />
    <main className="mx-auto py-12 max-w-5xl">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <Image
            width={250}
            height={500}
            src={
              userData.bodyShapeAnalysis.imageUrl ||
              "https://placehold.co/250x500/FFFFFF/CCCCCC?text=Bentuk+Tubuh"
            }
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
    </main>
    <PageFooter pageNumber="03" />
  </div>
);

interface IShape {
  name: string;
  value: number;
}

const generateGimmickChartData = (mainShapeName: string): IShape[] => {
  const allShapes = ["Heart", "Oblong", "Oval", "Round", "Square", "Diamond"];

  const shapeNameMap: { [key: string]: string } = {
    Hati: "Heart",
    Oblong: "Oblong",
    Oval: "Oval",
    Bulat: "Round",
    Kotak: "Square",
    Diamond: "Diamond",
  };

  const englishMainShapeName = shapeNameMap[mainShapeName] || mainShapeName;

  const mainValue = 90;
  const otherCount = allShapes.length - 1;

  const baseOtherValue = Math.floor(10 / otherCount);
  let sisa = 10 - baseOtherValue * otherCount;

  const chartData: IShape[] = [];
  allShapes.forEach((shapeName) => {
    if (shapeName.toLowerCase() === englishMainShapeName.toLowerCase()) {
      chartData.push({ name: shapeName, value: mainValue });
    } else {
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

const ShapeBar = ({
  label,
  value,
  active,
}: {
  label: string;
  value: number;
  active?: boolean;
}) => (
  <div className="mb-3">
    <div className="flex justify-between mb-1">
      <span
        className={`text-sm ${active ? "font-bold text-gray-800" : "text-gray-500"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${active ? "font-bold text-gray-800" : "text-gray-500"}`}
      >
        {value}%
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`${active ? "bg-gray-800" : "bg-gray-400"} h-2 rounded-full`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

export const FaceShape = ({
  userData,
  userPhotoUrl,
}: {
  userData: UserData;
  userPhotoUrl?: string | null;
}) => {
  const shapeChartData = generateGimmickChartData(userData.faceShape);

  const shapeNameMap: { [key: string]: string } = {
    Hati: "Heart",
    Oblong: "Oblong",
    Oval: "Oval",
    Bulat: "Round",
    Kotak: "Square",
    Diamond: "Diamond",
  };
  const englishMainShapeName =
    shapeNameMap[userData.faceShape] || userData.faceShape;

  return (
    <div className="relative bg-white min-h-screen p-8">
      <PageHeader name={userData.name} />
      <main className="mx-auto py-12 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4 font-oswald">
              Bentuk wajah kamu {userData.faceShape}
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {userData.faceShapeAnalysis.uniqueFact}
            </p>

            <div className="mb-8">
              {shapeChartData.map((shape) => (
                <ShapeBar
                  key={shape.name}
                  label={shape.name}
                  value={shape.value}
                  active={shape.name.toLowerCase() === englishMainShapeName.toLowerCase()}
                />
              ))}
            </div>

            <div className="bg-[#323232] text-white p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-3">Karakteristik</h3>
              <ul className="list-disc list-inside space-y-2">
                {userData.faceShapeAnalysis.characteristics.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden border-4 border-gray-800">
              <Image
                src={userPhotoUrl || "/model.png"}
                alt="Foto Wajah"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </main>
      <PageFooter pageNumber="01" />
    </div>
  );
};

const ColorSwatch = ({ color }: { color: string }) => (
  <div
    className="w-12 h-12 rounded-md shadow-md"
    style={{ backgroundColor: color }}
  ></div>
);

export const ColorTone = ({ userData }: { userData: UserData }) => (
  <div className="relative bg-white min-h-screen p-8">
    <PageHeader name={userData.name} />
    <main className="mx-auto py-12 max-w-5xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 font-oswald">
        Tone warna kamu {userData.colorTone}
      </h1>
      <p className="text-gray-600 mb-8 leading-relaxed">
        {userData.colorToneAnalysis.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h3 className="text-xl font-bold mb-4">Warna Terbaik</h3>
          <div className="flex flex-wrap gap-3">
            {userData.colorToneAnalysis.bestColors.map((color, index) => (
              <ColorSwatch key={index} color={color} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Warna Netral</h3>
          <div className="flex flex-wrap gap-3">
            {userData.colorToneAnalysis.neutralColors.map((color, index) => (
              <ColorSwatch key={index} color={color} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Warna yang Dihindari</h3>
          <div className="flex flex-wrap gap-3">
            {userData.colorToneAnalysis.worstColors.map((color, index) => (
              <ColorSwatch key={index} color={color} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Kombinasi Warna</h3>
          <div className="flex flex-wrap gap-3">
            {userData.colorToneAnalysis.combination.map((color, index) => (
              <ColorSwatch key={index} color={color} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#323232] text-white p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-3">Tips Makeup</h3>
          <ul className="list-disc list-inside space-y-2">
            {userData.colorToneAnalysis.tips.makeup.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-[#323232] text-white p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-3">Tips Outfit</h3>
          <ul className="list-disc list-inside space-y-2">
            {userData.colorToneAnalysis.tips.outfit.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
    <PageFooter pageNumber="02" />
  </div>
);

export const CelebritiesMatch = ({
  userData,
  userPhotoUrl,
}: {
  userData: UserData;
  userPhotoUrl?: string | null;
}) => (
  <div className="relative bg-white min-h-screen p-8">
    <PageHeader name={userData.name} />
    <main className="mx-auto py-12 max-w-5xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 font-oswald text-center">
        Kamu mirip dengan
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
        <div className="relative w-[200px] h-[200px] rounded-full overflow-hidden border-4 border-gray-200">
          <Image
            src={userPhotoUrl || "/model.png"}
            alt="Foto Kamu"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-full text-xl font-bold mb-4">
            {userData.celebrityMatch.matchPercentage}% Match
          </div>
          <div className="w-20 h-1 bg-gray-300"></div>
        </div>

        <div className="relative w-[200px] h-[200px] rounded-full overflow-hidden border-4 border-gray-800">
          <Image
            src={userData.celebrityMatch.imageUrl}
            alt={`Foto ${userData.celebrityMatch.name}`}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {userData.celebrityMatch.name}
        </h2>
      </div>

      <div className="bg-[#323232] text-white p-6 rounded-lg max-w-2xl mx-auto">
        <h3 className="text-lg font-bold mb-3">Alasan Kemiripan</h3>
        <ul className="list-disc list-inside space-y-2">
          {userData.celebrityMatch.reason.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </main>
    <PageFooter pageNumber="04" />
  </div>
);

export const Conclusion = ({ userData }: { userData: UserData }) => (
  <div className="relative bg-white min-h-screen p-8">
    <PageHeader name={userData.name} />
    <main className="mx-auto py-12 max-w-5xl space-y-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 font-oswald text-center">
        Kesimpulan & Tips
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TipBox
          title="Tips untuk bentuk wajah kamu"
          items={userData.conclusionTips.face}
        />
        <TipBox
          title="Tips untuk bentuk tubuh kamu"
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
      </div>
    </main>
    <PageFooter pageNumber="05" />
  </div>
);