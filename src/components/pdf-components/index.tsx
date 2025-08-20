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
      className={`flex justify-between items-center text-xs text-gray-700 my-12 font-poppins font-bold ${className}`}
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
    <header className="flex justify-between items-center mt-[50px] mb-[25px]">
      <Image
        src="/tie-by-min-logo.png"
        alt="Logo Tie By Min"
        width={58}
        height={37}
        className="w-[120px] sm:w-auto"
      />
      {fill ? (
        <div className="font-poppins bg-[#323232] text-white text-xs sm:text-sm font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-sm text-start w-[140px] sm:w-[180px] truncate">
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
        <header className="flex justify-between items-center my-4">
          <Image
            src="/tie-by-min-logo.png"
            alt="Logo Tie By Min"
            width={60}
            height={50}
            className="w-[140px]"
          />
          <div className="font-poppins bg-[#323232] text-white text-xs sm:text-sm font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-sm text-start w-[140px] sm:w-[180px] truncate">
            {userData.name}
          </div>
        </header>
      </div>
      <main className="flex flex-col justify-center px-10 w-full">
        <h1 className="font-oswald text-[64px] font-extrabold text-gray-800">
          HASIL ANALISA LENGKAP
        </h1>
      </main>
      <div className="absolute bottom-0 left-0 right-0 h-[60%]">
        <Image
          src="/many-flower.png"
          alt="Pola Bunga Latar Belakang"
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute -bottom-12 left-0 right-0">
        <Footer page="01" className="bg-[#F0F0F0] w-full py-[3rem] px-10" />
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
        <main className="mx-auto py-6 max-w-5xl flex-grow">
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
                {bodyDetails?.penjelasan_body_shape}
              </p>
              <div className="bg-[#323232] text-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Karakteristik</h3>
                <ul className="list-disc list-inside space-y-2">
                  {bodyDetails?.karakteristik
                    ?.split("-")
                    .filter((point) => point.trim() !== "")
                    .map((point, index) => (
                      <li key={index} className="text-lg font-poppins">
                        {point.trim()}
                      </li>
                    ))}
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

        {/* Main content with consistent spacing */}
        <main className="flex-grow py-6">
          <div className="flex w-full gap-8 mb-4">
            <div className="relative w-[600px] rounded-lg shadow overflow-hidden">
              <Image
                src={userPhotoUrl || "/model.png"}
                alt="Model Wajah"
                fill
                className="object-cover"
                quality={100}
              />
            </div>
            <div ref={infoRef} className="w-full space-y-2 mb-4">
              <h1 className="font-oswald text-2xl mb-2">
                Bentuk wajah kamu {userData.faceShape}
              </h1>
              <p className="font-poppins text-base text-[#323232] my-4">
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

          <div className="grid grid-cols-2 gap-3">
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
              <ul className="text-[#323232] font-poppins leading-relaxed space-y-2 text-xs">
                {faceShapeDetails?.karakteristik
                  .split("-")
                  .filter((item: string) => item.trim() !== "")
                  .map((item: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2 text-white mb-1">•</span>
                      <span className="text-xs text-white">{item.trim()}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </main>

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

  return (
    <div className="flex justify-center w-full h-screen">
      <div className="relative bg-[#F0F0F0] w-full flex flex-col h-screen">
        <div className="px-10">
          <PageHeader width={100} name={userData.name} />
        </div>

        <div className="px-10 py-6 mb-10">
          <h1 className="text-2xl mb-2 font-oswald">
            Color tone kamu {userData.colorTone}
          </h1>
          <p className="text-[#323232] mb-12 text-base">
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

        {/* Dark section - bagian bawah yang memenuhi sisa ruang */}
        <div className="bg-[#323232] p-10 flex-grow flex flex-col justify-between">
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
          <Footer page="03" className="bg-[#323232] text-white" />
        </div>
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
          <div className="relative w-[55%] rounded-lg overflow-hidden shadow">
            <Image
              src={celebrityDetails?.picture_url as string}
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
          <div className="w-[45%] flex flex-col">
            <h2 className="text-3xl font-oswald">
              {userData.celebrityMatch.name}
            </h2>
            <div className="flex flex-col gap-5">
              <p className="font-poppins text-base text-gray-700 leading-snug flex-grow mt-3">
                {celebrityDetails?.description}
              </p>
              <div className="bg-[#323232] h-[220px] text-white p-8 rounded">
                <h3 className="text-lg font-bold mb-1">Kenapa Cocok?</h3>
                <p className="text-base leading-snug">
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
      <div className="border p-6">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        {items && items.length > 0 ? (
          <div className="list-disc list-inside space-y-2">
            {items.map((item, index) => (
              <span key={index} className="text-gray-700 font-poppins">
                {item}
              </span>
            ))}
          </div>
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
        <main className="flex-grow mt-4">
          <div className="flex flex-col gap-6">
            <TipBox
              title="Tips untuk bentuk wajah kamu"
              items={faceTip ? [faceTip] : []}
              loading={isLoading}
              error={isError}
            />
            <TipBox
              title="Tips untuk bentuk badan kamu"
              items={bodyTip ? [bodyTip] : []}
              loading={isLoading}
              error={isError}
            />
            <TipBox
              title="Tips untuk tone warna kamu"
              items={colorTip ? [colorTip] : []}
              loading={isLoading}
              error={isError}
            />
            <div className="bg-[#323232] font-poppins text-white p-6">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles fill="white" size={20} />
                <p>Rekap Cepat Tips Kamu</p>
              </div>
              <p className="text-sm leading-relaxed">
                {faceTip && `${faceTip.split(".")[0]}. `}
                {bodyTip && `${bodyTip.split(".")[0]}. `}
                {colorTip && `${colorTip.split(".")[0]}.`}
              </p>
            </div>
          </div>
        </main>
        <Footer page="06" />
      </div>
    </div>
  );
};
