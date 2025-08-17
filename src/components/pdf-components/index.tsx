import {
  AllTips,
  BodyShapeData,
  Celebrity,
  ColorAnalysis as ColorToneType,
  FaceShape as FaceShapeType,
  UserData,
} from "@/types";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

export const Footer = ({
  page,
  className,
}: {
  page: string;
  className?: string;
}) => {
  return (
    <div
      className={`flex justify-between items-center text-xs text-gray-700 my-12 font-poppins px- ${className}`}
    >
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
}) => {
  let userName = name;
  if (typeof window !== "undefined") {
    userName = localStorage.getItem("firstName") || name;
  }

  return (
    <header className="flex justify-between items-center my-6">
      <Image
        src="/tie-by-min-logo.png"
        alt="Logo Tie By Min"
        width={58}
        height={37}
        className="w-[120px] sm:w-auto"
      />
      {fill ? (
        <div className="font-poppins bg-gray-800 text-white text-xs sm:text-sm font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-sm text-start w-[140px] sm:w-[180px] truncate">
          {userName}
        </div>
      ) : (
        <div className="font-poppins font-bold text-xs">{userName}</div>
      )}
    </header>
  );
};

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
        <li key={index} className="text-gray-700 break-words">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export const BackCover = () => (
  <div className="flex items-center justify-center w-full h-screen">
    <div className="w-full px-10 flex justify-center items-center bg-[#333333] h-full">
      <Image
        src="/tie-by-min-logo-light.png"
        alt="Logo Tie By Min Putih"
        width={250}
        height={80}
        priority
        className="self-center"
      />
    </div>
  </div>
);

export const Cover = ({ userData }: { userData: UserData }) => (
  <div className="flex items-center justify-center w-full h-screen">
    <div className="relative bg-[#F0F0F0] w-full min-h-screen flex flex-col self-center overflow-hidden">
      <div className="ml-10">
        <PageHeader fill name={userData.name} />
      </div>
      <main className="flex flex-col justify-center px-10 mt-[5rem] w-full">
        <h1 className="font-oswald text-[64px] font-extrabold text-gray-800">
          HASIL ANALISA LENGKAP
        </h1>
      </main>
      <div className="absolute bottom-0 left-0 right-0 h-[50%]">
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

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="relative bg-[#F0F0F0] h-screen w-full px-10 flex flex-col justify-between">
        <PageHeader width={100} name={userData.name} />
        <main className="mx-auto py-12 max-w-5xl flex-grow">
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
                className="w-[300px] h-[400px] object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-[24px] mb-4 font-oswald">
                Bentuk tubuh kamu {userData.bodyShape}
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {userData.bodyShapeAnalysis.description
                  .charAt(0)
                  .toUpperCase() +
                  userData.bodyShapeAnalysis.description.slice(1).toLowerCase()}
              </p>
              <div className="bg-[#323232] text-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Karakteristik</h3>
                <ul className="list-disc list-inside space-y-2">
                  {userData.bodyShapeAnalysis.characteristics.map(
                    (item, index) => (
                      <li key={index}>
                        {item.endsWith(".") ? item : `${item}.`}
                      </li>
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

            <div className="w-full h-10 rounded-md bg-gray-200 overflow-hidden">
              <div className="h-full rounded-md bg-gradient-to-r from-pink-400 to-pink-200" />
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
  faceShapeDetails,
}: {
  userData: UserData;
  userPhotoUrl?: string | null;
  faceShapeDetails?: FaceShapeType;
}) => {
  const shapeChartData = generateGimmickChartData(userData.faceShape);
  const infoRef = useRef<HTMLDivElement>(null);
  const [infoHeight, setInfoHeight] = useState(0);

  useLayoutEffect(() => {
    if (infoRef.current) {
      setInfoHeight(infoRef.current.offsetHeight);
    }
  }, [userData, faceShapeDetails]);

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
    <div className="flex flex-col gap-[18px]">
      <span
        className={`text-sm font-poppins ${
          active ? "font-bold text-gray-800" : "text-gray-500"
        }`}
      >
        {label}
      </span>
      <div className="w-full bg-gray-300 rounded-full h-2">
        <div
          className="bg-[#EF789B] h-2 rounded-full"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="relative bg-[#F0F0F0] w-full px-10 flex flex-col justify-between min-h-screen">
        <PageHeader name={userData.name} />

        {/* Konten Utama */}
        <div className="flex flex-col gap-4 flex-grow">
          {/* Gambar */}
          <div className="flex w-full gap-8">
            <div
              className="relative w-[600px] rounded-lg shadow overflow-hidden"
              style={{ height: infoHeight > 0 ? `${infoHeight}px` : "auto" }}
            >
              <Image
                src={userPhotoUrl || "/model.png"}
                alt="Model Wajah"
                fill
                className="object-cover"
                quality={90}
              />
            </div>

            {/* Progress Bar */}
            <div ref={infoRef} className="w-full space-y-2">
              <h1 className="font-oswald text-2xl mb-2">
                Bentuk wajah kamu {userData.faceShape}
              </h1>
              <p className="text-gray-600 my-6 font-poppins leading-relaxed">
                {faceShapeDetails?.penjelasan_face_shape.split("-")[0]}
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
            <div className="p-6">
              <h3 className="text-sm font-bold mb-1">Fakta Unik</h3>
              <p className="text-xs text-gray-600 leading-snug">
                {faceShapeDetails?.penjelasan_face_shape
                  .split("-")
                  .filter((item: string) => item.trim() !== "")
                  .map((item: string, index: number) =>
                    index === 0 ? null : (
                      <span key={index} className="block text-[14px]">
                        •{" "}
                        <span className="text-[14px] ml-2">{item.trim()}</span>
                      </span>
                    )
                  )}
              </p>
            </div>
            <div className="bg-[#323232] text-white p-6 rounded">
              <h3 className="text-sm font-bold text-[#EF789B] mb-1">
                Karakteristik
              </h3>
              <ul className="list-disc pl-4 text-xs space-y-1">
                {userData.faceShapeAnalysis.characteristics.map((item, idx) => (
                  <li key={idx}>{item.endsWith(".") ? item : `${item}.`}</li>
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

export const ColorTone = ({
  userData,
  colorToneDetails,
}: {
  userData: UserData;
  colorToneDetails?: ColorToneType;
}) => {
  const ColorPalette = ({
    title,
    colors,
    isCombination = false,
  }: {
    title?: string;
    colors: string[] | string[][];
    isCombination?: boolean;
  }) => {
    return (
      <div>
        <h3 className="font-semibold text-gray-500 mb-4">{title}</h3>
        {isCombination ? (
          <div className="grid grid-cols-2 gap-y-4">
            {(colors as string[][]).map((pair, idx) => (
              <div
                key={idx}
                className="flex overflow-hidden shadow-md"
                style={{ width: 100, height: 28 }}
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
            {(colors as string[]).map((color, index) => (
              <div
                key={index}
                className="w-full h-[30px] shadow-md"
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

  const analysisRef = useRef<HTMLDivElement>(null);
  const [analysisHeight, setAnalysisHeight] = useState(0);

  useLayoutEffect(() => {
    if (analysisRef.current) {
      setAnalysisHeight(analysisRef.current.offsetHeight);
    }
  }, [colorToneDetails]);
  return (
    <div className="flex justify-center w-full h-screen">
      <div className="relative bg-[#F0F0F0] w-full flex flex-col justify-between h-screen">
        <div className="px-10">
          <PageHeader width={100} name={userData.name} />
        </div>

        <main className="py-10 flex-grow">
          <div className="max-w-5xl px-10" ref={analysisRef}>
            <h1 className="text-2xl mb-2 font-oswald">
              Color tone kamu {userData.colorTone}
            </h1>
            <p className="text-gray-600 mb-12">
              {colorToneDetails?.penjelasan_color_analysis ||
                userData.colorToneAnalysis.description}
            </p>

            <div className="grid grid-cols-2 gap-12">
              <ColorPalette
                title="Best Color"
                colors={colorToneDetails?.best_colour || []}
              />
              <ColorPalette
                title="Neutral Color"
                colors={colorToneDetails?.neutral_colour || []}
              />
              <ColorPalette
                title="Worst Color"
                colors={colorToneDetails?.worst_colour || []}
              />
              <ColorPalette
                title="Combination"
                colors={colorToneDetails?.best_colour_combination || []}
                isCombination
              />
            </div>
          </div>

          {/* Info Section */}
          <div
            className="mt-16 bg-[#323232] p-10"
            style={{
              height: analysisHeight > 0 ? `${analysisHeight}px` : "auto",
            }}
          >
            <div className="grid grid-cols-2 gap-10">
              <InfoSection
                title="Make Up Tips"
                items={
                  colorToneDetails?.make_up_tips
                    ? [colorToneDetails.make_up_tips]
                    : []
                }
              />
              <InfoSection
                title="Outfit Tips"
                items={
                  colorToneDetails?.tips_warna_kulit_pakaian
                    ? [colorToneDetails.tips_warna_kulit_pakaian]
                    : []
                }
              />
              <InfoSection
                title="Personality"
                items={
                  colorToneDetails?.personality
                    ? [colorToneDetails.personality]
                    : []
                }
              />
              <InfoSection
                title="Karakteristik"
                items={
                  colorToneDetails?.karakteristik
                    ? [colorToneDetails.karakteristik]
                    : []
                }
              />
            </div>
          </div>
        </main>
        <Footer page="03" className="text-white px-8" />
      </div>
    </div>
  );
};

export const CelebritiesMatch = ({
  userData,
  celebrityDetails,
}: {
  userData: UserData;
  celebrityDetails?: Celebrity;
}) => (
  <div className="flex items-center justify-center w-full min-h-screen">
    <div className="relative bg-[#F0F0F0] w-full px-10 flex flex-col justify-between min-h-screen">
      <PageHeader name={userData.name} />

      <div className="flex flex-col gap-4 flex-grow">
        <h1 className="text-[48px] text-gray-900 leading-tight font-oswald">
          Selebrity yang serupa <br /> dengan kamu
        </h1>
        <hr className="my-4" />

        <div className="flex gap-6">
          <div className="relative w-[55%] h-[400px] rounded-lg overflow-hidden shadow">
            <Image
              src={
                celebrityDetails?.picture_url ||
                userData.celebrityMatch.imageUrl ||
                "/hijab-1.png"
              }
              alt={userData.celebrityMatch.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-6 left-6 bg-[#323232] text-white text-xs font-bold px-2 py-1 rounded flex items-center shadow">
              <Sparkles className="w-4 h-4 mr-1" />
              {userData.celebrityMatch.matchPercentage}% Match
            </div>
          </div>

          {/* Info selebriti */}
          <div className="w-[45%] flex flex-col">
            <h2 className="text-2xl font-oswald">
              {userData.celebrityMatch.name}
            </h2>
            <div className="flex flex-col gap-5">
              <p className="font-poppins text-xs text-gray-700 leading-snug flex-grow mt-3">
                {celebrityDetails?.description ||
                  userData.celebrityMatch.description ||
                  "Dia adalah artis, pemain film dan content creator terkenal asal indonesia,film paling hits nya berjudul “Ipar adalah maut, 2024”"}
              </p>
              <div className="bg-[#323232] h-[220px] text-white p-8 rounded">
                <h3 className="text-sm font-bold mb-1">Kenapa Cocok?</h3>
                <p className="text-xs leading-snug">
                  {celebrityDetails?.similarity_text ||
                    userData.celebrityMatch.reason.map((text, index) => (
                      <span key={index}>{text}, </span>
                    ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer page="05" />
    </div>
  </div>
);

export const Conclusion = ({
  userData,
  faceTip,
  bodyTip,
  colorTip,
  isLoading = false,
  isError = false,
}: {
  userData: UserData;
  faceTip?: AllTips["faceTip"];
  bodyTip?: AllTips["bodyTip"];
  colorTip?: AllTips["colorTip"];
  isLoading?: boolean;
  isError?: boolean;
}) => {
  const TipBox = ({
    title,
    items,
    loading,
    error,
  }: {
    title: string;
    items?: string[];
    loading: boolean;
    error: boolean;
  }) => {
    if (loading) {
      return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-red-700">{title}</h3>
          <p className="text-red-600">Gagal memuat tips.</p>
        </div>
      );
    }

    return (
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        {items && items.length > 0 ? (
          <ul className="list-disc list-inside space-y-2">
            {items.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Tidak ada tips yang tersedia.</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="relative bg-[#F0F0F0] w-full px-10 flex flex-col justify-between min-h-screen">
        <PageHeader name={userData.name} />
        <main className="py-12 flex-grow">
          <h1 className="text-4xl font-bold text-center mb-2 font-oswald">
            KESIMPULAN & REKOMENDASI
          </h1>
          <p className="text-center text-gray-500 mb-10">
            Berikut adalah ringkasan dan beberapa tips yang disesuaikan untuk
            Anda.
          </p>

          <div className="space-y-8">
            <TipBox
              title="Rekomendasi Bentuk Wajah"
              items={faceTip ? [faceTip] : []}
              loading={isLoading}
              error={isError}
            />
            <TipBox
              title="Rekomendasi Bentuk Tubuh"
              items={bodyTip ? [bodyTip] : []}
              loading={isLoading}
              error={isError}
            />
            <TipBox
              title="Rekomendasi Warna"
              items={colorTip ? [colorTip] : []}
              loading={isLoading}
              error={isError}
            />
          </div>
        </main>
        <Footer page="06" />
      </div>
    </div>
  );
};
