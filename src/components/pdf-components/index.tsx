import { BodyShapeData, UserData } from "@/types";
import { Sparkles } from "lucide-react";
import Image from "next/image";

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

export const TipBox = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
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
    <div className="absolute bottom-0 left-0 right-0 h-1/3">
      <Image
        src="/many-flower.png"
        alt="Pola Bunga Latar Belakang"
        fill
        className="object-cover"
      />
    </div>
  </div>
);

export const BodyShape = ({
  userData,
  bodyDetails,
}: {
  userData: UserData;
  bodyDetails?: BodyShapeData;
}) => (
  <div className="relative bg-white min-h-screen p-8">
    <PageHeader width={100} name={userData.name} />
    <main className="mx-auto py-12 max-w-5xl">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <Image
            src={
              bodyDetails?.link_picture || userData.bodyShapeAnalysis.imageUrl
            }
            alt={`Diagram Bentuk Tubuh ${userData.bodyShape}`}
            width={100}
            height={220}
            className="w-[100px] h-[220px] object-contain"
            priority
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
            src={userPhotoUrl || "/model.png"}
            alt="Model Wajah"
            fill
            className="w-[220px] h-[400px] object-cover"
          />
        </div>
        <div>
          <h1 className="font-oswald text-4xl font-bold text-gray-800 mb-2">
            Bentuk wajah kamu {userData.faceShape}
          </h1>
          <p className="text-gray-600 my-6 font-poppins leading-relaxed">
            {userData.faceShapeAnalysis.uniqueFact}
          </p>
          <div className="space-y-8 mb-10">
            {shapeChartData.map((shape) => (
              <ShapeBar
                key={shape.name}
                label={shape.name}
                value={shape.value}
                active={
                  shape.name.toLowerCase() ===
                  englishMainShapeName.toLowerCase()
                }
              />
            ))}
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
    </div>
  );
};

export const ColorTone = ({ userData }: { userData: UserData }) => {
  const ColorPalette = ({
    title,
    colors,
    isCombination = false,
  }: {
    title?: string;
    colors: string[];
    isCombination?: boolean;
  }) => {
    const makePairs = (arr: string[]) => {
      const pairs: string[][] = [];
      for (let i = 0; i < arr.length; i += 2) {
        if (arr[i + 1]) {
          pairs.push([arr[i], arr[i + 1]]);
        }
      }
      return pairs;
    };

    return (
      <div>
        <h3 className="font-semibold text-gray-500 mb-4">{title}</h3>
        {isCombination ? (
          <div className="grid grid-cols-2 gap-y-4">
            {makePairs(colors).map((pair, idx) => (
              <div
                key={idx}
                className="flex overflow-hidden rounded shadow-md"
                style={{ width: 100, height: 48 }}
              >
                {pair.map((color, subIdx) => (
                  <div
                    key={subIdx}
                    style={{
                      backgroundColor: color,
                      width: "50%",
                      height: "100%",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-full h-[50px] rounded shadow-md"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const InfoSection = ({
    title,
    items,
  }: {
    title: string;
    items: string[];
  }) => (
    <div>
      <h3 className="text-lg font-bold text-[#EF789B] mb-3 text-center">
        {title}
      </h3>
      {items.map((item, index) => (
        <p className="text-center text-white" key={index}>
          {item}
        </p>
      ))}
    </div>
  );

  return (
    <div className="relative bg-white">
      {/* Header */}
      <PageHeader width={100} name={userData.name} />

      <main className="py-10">
        <div className="max-w-5xl mx-auto px-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Color tone kamu {userData.colorTone}
          </h1>
          <p className="text-gray-600 mb-12">
            {userData.colorToneAnalysis.description}
          </p>

          {/* Palettes */}
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
              isCombination
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-[#323232] py-10">
          <div className="max-w-5xl mx-auto grid grid-cols-2 gap-10">
            <InfoSection
              title="Make Up Tips"
              items={userData.colorToneAnalysis.tips.makeup}
            />
            <InfoSection
              title="Outfit Tips"
              items={userData.colorToneAnalysis.tips.outfit}
            />
            <InfoSection
              title="Personality"
              items={userData.colorToneAnalysis.tips.personality}
            />
            <InfoSection
              title="Karakteristik"
              items={userData.colorToneAnalysis.tips.characteristics}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export const CelebritiesMatch = ({ userData }: { userData: UserData }) => (
  <div className="relative bg-white min-h-screen p-12 flex flex-col justify-between">
    {/* Header */}
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <Image
          src="/tie-by-min-logo.png"
          alt="Tiebymin"
          width={100}
          height={200}
          className="h-8 mb-12"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
          Selebriti yang serupa <br /> dengan kamu
        </h1>
        <hr className="w-full border-t border-gray-300 mb-10" />
      </div>
      <div className="text-right text-sm font-semibold text-gray-900">
        {userData.name}
      </div>
    </div>

    {/* Main content */}
    <div className="grid md:grid-cols-2 gap-10 items-start">
      {/* Foto */}
      <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-lg">
        <Image
          src={userData.celebrityMatch.imageUrl}
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

      {/* Info selebriti */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {userData.celebrityMatch.name}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          {userData.celebrityMatch.description}
        </p>
        <div className="bg-[#323232] text-white p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-3">Kenapa Cocok?</h3>
          <p className="text-sm leading-relaxed">
            {userData.celebrityMatch.reason}
          </p>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="flex justify-between items-center text-xs text-gray-700 mt-12">
      <span>© 2025, Tiebymin AI</span>
      <span>04</span>
    </div>
  </div>
);

export const Conclusion = ({ userData }: { userData: UserData }) => {
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
    </div>
  );
};
