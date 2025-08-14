import { BodyShapeData, UserData } from "@/types";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export const Footer = ({ page }: { page: string }) => {
  return (
    <div className="flex justify-between items-center text-xs text-gray-700 mt-12">
      <span>© 2025, Tiebymin AI</span>
      <span>{page}</span>
    </div>
  );
};

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
  <div className="flex items-center justify-center w-full h-screen">
    <div className="w-[650px] self-center bg-[#333333] h-full">
      <Image
        src="/tie-by-min-logo-light.png"
        alt="Logo Tie By Min Putih"
        width={250}
        height={80}
        priority
      />
    </div>
  </div>
);

export const Cover = ({ userData }: { userData: UserData }) => (
  <div className="flex items-center justify-center w-full h-screen">
    <div className="relative bg-[#F3F4F6] w-[650px] min-h-screen flex flex-col self-center overflow-hidden">
      <PageHeader fill name={userData.name} />
      <main className="flex flex-col justify-center px-10 mt-[10rem] w-full">
        <h1 className="font-oswald text-[64px] font-extrabold text-gray-800">
          HASIL ANALISA LENGKAP
        </h1>
      </main>
      <div className="absolute bottom-0 left-0 right-0 h-1/3">
        <Image
          src="/many-flower.png"
          alt="Pola Bunga Latar Belakang"
          fill
          className="object-cover"
        />
        <Footer page="01" />
      </div>
    </div>
  </div>
);

export const BodyShape = ({
  userData,
  bodyDetails,
}: {
  userData: UserData;
  bodyDetails?: BodyShapeData;
}) => {
  const bmiValue = userData.bmi.value;
  const bmiPercentage = Math.min((bmiValue / 40) * 100, 100);

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="relative bg-white min-h-screen w-[650px]">
        <PageHeader width={100} name={userData.name} />
        <main className="mx-auto py-12 max-w-5xl">
          <div className="flex gap-10">
            <div className="flex justify-center">
              <Image
                src={
                  bodyDetails?.link_picture ||
                  userData.bodyShapeAnalysis.imageUrl
                }
                alt={`Diagram Bentuk Tubuh ${userData.bodyShape}`}
                width={400}
                height={300}
                className="w-[400px] h-[500px] object-contain"
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
                  {userData.bodyShapeAnalysis.characteristics.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <p className="font-bold">
              BMI INDEX: {bmiValue} ({userData.bmi.category})
            </p>
            <p className="text-gray-600 mb-3">{userData.bmi.desc}</p>

            <div className="w-full h-4 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-200" />
            </div>
          </div>
        </main>
        <Footer page="04" />
      </div>
    </div>
  );
};

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
    <div className="space-y-1">
      <span
        className={`text-sm font-poppins ${
          active ? "font-bold text-gray-800" : "text-gray-500"
        }`}
      >
        {label}
      </span>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-[#EF789B] h-2 rounded-full"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="relative bg-white w-[650px] p-6 flex flex-col justify-between min-h-screen">
        <PageHeader name={userData.name} />

        {/* Konten Utama */}
        <div className="flex flex-col gap-4 flex-grow">
          {/* Gambar */}
          <div className="flex w-full gap-8">
            <div className="relative w-[600px] h-[480px] rounded-lg shadow overflow-hidden">
              <Image
                src={userPhotoUrl || "/model.png"}
                alt="Model Wajah"
                fill
                className="object-cover"
                quality={90}
              />
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-2">
              <h1 className="font-oswald text-4xl font-bold text-gray-800 mb-2">
                Bentuk wajah kamu {userData.faceShape}
              </h1>
              <p className="text-gray-600 my-6 font-poppins leading-relaxed">
                {userData.faceShapeAnalysis.uniqueFact}
              </p>
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

          {/* Fakta & Karakteristik */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gray-100 p-3 rounded">
              <h3 className="text-sm font-bold mb-1">Fakta Unik</h3>
              <p className="text-xs text-gray-600 leading-snug">
                {userData.faceShapeAnalysis.uniqueFact}
              </p>
            </div>
            <div className="bg-[#323232] text-white p-3 rounded">
              <h3 className="text-sm font-bold text-[#EF789B] mb-1">
                Karakteristik
              </h3>
              <ul className="list-disc pl-4 text-xs space-y-1">
                {userData.faceShapeAnalysis.characteristics.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer page="02" />
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
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="relative bg-white w-[650px]">
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
            <div className="grid grid-cols-2 gap-10">
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
            <Footer page="03" />
          </div>
        </main>
      </div>
    </div>
  );
};

export const CelebritiesMatch = ({ userData }: { userData: UserData }) => (
  <div className="flex items-center justify-center w-full min-h-screen">
    <div className="relative bg-white w-[650px] p-6 flex flex-col justify-between min-h-screen">
      <PageHeader name={userData.name} />

      {/* Konten Utama */}
      <div className="flex flex-col gap-4 flex-grow">
        {/* Judul */}
        <h1 className="text-xl font-bold text-gray-900 leading-tight">
          Selebriti yang serupa dengan kamu
        </h1>
        <hr className="border-gray-300" />

        {/* Foto & Info selebriti */}
        <div className="flex gap-3">
          {/* Foto */}
          <div className="relative w-[45%] h-[250px] rounded-lg overflow-hidden shadow">
            <Image
              src={userData.celebrityMatch.imageUrl}
              alt={userData.celebrityMatch.name}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute bottom-2 left-2 bg-[#FCA4BE] text-white text-xs font-bold px-2 py-1 rounded flex items-center shadow">
              <Sparkles className="w-4 h-4 mr-1" />
              {userData.celebrityMatch.matchPercentage}% Match
            </div>
          </div>

          {/* Info selebriti */}
          <div className="w-[55%] flex flex-col">
            <h2 className="text-lg font-bold text-gray-900">
              {userData.celebrityMatch.name}
            </h2>
            <p className="text-xs text-gray-700 leading-snug flex-grow">
              {userData.celebrityMatch.description}
            </p>
            {/* Card alasan cocok */}
            <div className="bg-[#323232] text-white p-3 rounded">
              <h3 className="text-sm font-bold mb-1">Kenapa Cocok?</h3>
              <p className="text-xs leading-snug">
                {userData.celebrityMatch.reason}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer page="05" />
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
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="relative bg-white min-h-screen font-sans w-[650px]">
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
        <Footer page="06" />
      </div>
    </div>
  );
};
