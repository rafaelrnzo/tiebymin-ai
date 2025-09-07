"use client";

import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/AnalysisContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

const hardcodedBodyShapes = [
  {
    name: "Apple",
    penjelasan_body_shape:
      "Bentuk tubuh apple tuh punya karakteristik unik karena bagian tengah tubuhmu lebih dominan dibanding atas dan bawah. ",
    karakteristik:
      "-Bahu yang lebar.\n-Bagian perut lebih menonjol.\n-Tubuhmu punya aura yang kuat.",
    tips_body_shape:
      "-Gunakan atasan dengan potongan A-line atau empire waist\n-Hindari ikat pinggang ketat di bagian perut\n-Pilih celana atau rok yang memberi keseimbangan pada bagian bawah",
    link_picture:
      "https://res.cloudinary.com/dwuuwldcw/image/upload/v1754727467/Body_Shape_6_fjqhlb.png",
    is_active: true,
    id: "633fc3b1-dcec-4127-8272-9f4a0589fe30",
    created_at: "2025-08-09T08:45:04.019165Z",
    updated_at: "2025-08-14T09:33:13.816632Z",
  },
  {
    name: "Diamond",
    penjelasan_body_shape:
      "Bentuk tubuh diamond tuh identik dengan bahu lebar dan bagian atas tubuh yang lebih dominan dibanding bawah.",
    karakteristik:
      "-Bahu lebih lebar dibanding pinggul.\n-Bingkai tubuh yang broad.\n-Kaki biasanya ramping.",
    tips_body_shape:
      "-Fokus di bagian bawah tubuh dengan rok lebar atau celana bernuansa cerah\n-Hindari atasan dengan shoulder pad atau detail besar karena bisa bikin bahu terlihat lebih lebar.\n-V-neck atau neckline rendah bisa bikin tubuhmu terlihat lebih panjang dan proporsional.",
    link_picture:
      "https://res.cloudinary.com/dwuuwldcw/image/upload/v1754727467/Body_Shape_5_uwylsx.png",
    is_active: true,
    id: "c95835b6-f4cf-490e-8fb9-94172e2d2196",
    created_at: "2025-08-09T08:44:20.244761Z",
    updated_at: "2025-08-14T09:34:48.785038Z",
  },
  {
    name: "Hourglass",
    penjelasan_body_shape:
      "Bentuk tubuhmu memiliki proporsi seimbang antara bagian atas dan bawah, dengan pinggang ramping yang bikin siluetmu kelihatan sangat elegan.",
    karakteristik:
      "-Bahu dan pinggul hampir sama lebar.\n-Pinggang yang jelas dan ramping.\n-Kamu punya kesan feminim alami.",
    tips_body_shape:
      "-Highlight pinggangmu dengan ikat pinggang ini bakal bikin kamu keliatan lebih chic.\n-Hindari pakaian oversized yang nggak ngehighlight lekuk tubuhmu.\n-Pilih material yang flowy atau sedikit stretchy biar nyaman dipakai tapi tetap stylish.",
    link_picture:
      "https://res.cloudinary.com/dwuuwldcw/image/upload/v1754727467/Body_Shape_4_dneluz.png",
    is_active: true,
    id: "91b018ad-3405-4fbb-bb7c-258a2cc9ae54",
    created_at: "2025-08-09T08:44:37.799439Z",
    updated_at: "2025-08-19T07:52:42.023153Z",
  },
  {
    name: "Pear",
    penjelasan_body_shape:
      "Bentuk tubuh pear tuh unik banget karena bagian bawah tubuhmu lebih dominan dibanding bagian atas. Jadi pinggulmu lebih lebar dari bahu.",
    karakteristik:
      "-Bahu lebih sempit dibanding pinggul.\n-Lemak berkumpul di bagian bawah.\n-Kakimu biasanya ramping.",
    tips_body_shape:
      "-Coba tambahkan volume di bagian atas untuk ngebalance bentuk tubuhmu.\n-Untuk bawahan, pilih warna gelap dan potongan lurus buat bikin kaki terlihat lebih langsing.\n-Blazer atau outer dengan shoulder pad bisa bikin siluet tubuhmu lebih proporsional.",
    link_picture:
      "https://res.cloudinary.com/dwuuwldcw/image/upload/v1754727467/Body_Shape_8_z82qix.png",
    is_active: true,
    id: "14c44b55-34e3-4a51-9709-bfa4cb64309a",
    created_at: "2025-08-09T08:44:30.636395Z",
    updated_at: "2025-08-14T09:54:10.617747Z",
  },
  {
    name: "Square",
    penjelasan_body_shape:
      "Bentuk tubuh rectangle itu tidak memiliki banyak lekuk, pinggang hampir tidak terlihat. dan semuanya terlihat lurus.",
    karakteristik:
      "-Bahu, pinggang, dan pinggul hampir sejajar.\n-Nggak ada lekuk tubuh yang  terlihat jelas.\n-Aura kamu sporty atau chic.",
    tips_body_shape:
      "-Pakai pakaian yang menciptakan ilusi lekuk tubuh, atau pakai ikat pinggang.\n-Rok berlipit atau flare bisa bikin tubuhmu terlihat lebih feminin dan dinamis.\n-Hindari potongan lurus dari atas ke bawah karena bisa bikin tubuhmu terlihat datar.",
    link_picture:
      "https://res.cloudinary.com/dwuuwldcw/image/upload/v1754727467/Body_Shape_3_kuunps.png",
    is_active: true,
    id: "7cb77e1e-92f5-4a92-9d54-06b1756b731c",
    created_at: "2025-08-09T08:44:53.332959Z",
    updated_at: "2025-08-14T09:38:07.537918Z",
  },
  {
    name: "Triangle",
    penjelasan_body_shape:
      "Bentuk tubuh segitiga ditandai dengan bagian atas tubuh jauh lebih kecil dibandingkan bagian bawah tubuh.",
    karakteristik:
      "-Bagian atas tubuh lebih kecil.\n-Pinggul dan paha lebih besar.\n-Kaki terlihat lebih besar dan berisi.",
    tips_body_shape:
      "-Kamu tambahkan volume yang cukup besar di bagian atas tubuh kamu\n-Untuk bawahan, pilih warna gelap dan potongan lurus buat terlihat lebih langsing.\n-Blazer atau outer dengan shoulder pad bisa bikin siluet tubuhmu lebih proporsional.",
    link_picture:
      "https://res.cloudinary.com/dwuuwldcw/image/upload/v1754727467/Body_Shape_2_jpxhhz.png",
    is_active: true,
    id: "2b15f4fa-e4d9-40ad-8799-4f58dc0b8ee5",
    created_at: "2025-08-09T08:44:46.326364Z",
    updated_at: "2025-08-14T09:39:10.658804Z",
  },
];

const BodyTypeSkeleton = ({ count = 6 }) => {
  const topRowCount = Math.ceil(count / 2);
  const bottomRowCount = count - topRowCount;
  const topRow = Array(topRowCount).fill(0);
  const bottomRow = Array(bottomRowCount).fill(0);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto px-2 md:px-0 lg:order-2">
      <div className="flex flex-col justify-between w-full gap-4 sm:gap-8 animate-pulse">
        <div className="flex flex-wrap sm:flex-nowrap gap-4 justify-center w-full">
          {topRow.map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center flex-1 min-w-[100px]"
            >
              <div className="relative mb-2 flex h-40 xs:h-48 sm:h-64 w-20 xs:w-24 sm:w-32 items-center justify-center">
                <div className="absolute inset-0 bg-gray-300/50 rounded-lg" />
              </div>
              <div className="h-4 w-20 bg-gray-300/50 rounded"></div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-4 justify-center w-full">
          {bottomRow.map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center flex-1 min-w-[100px]"
            >
              <div className="relative mb-2 flex h-40 xs:h-48 sm:h-64 w-20 xs:w-24 sm:w-32 items-center justify-center">
                <div className="absolute inset-0 bg-gray-300/50 rounded-lg" />
              </div>
              <div className="h-4 w-20 bg-gray-300/50 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface BodyType {
  id: string;
  name: string;
  link_picture: string;
  penjelasan_body_shape: string;
  karakteristik: string;
}

interface BodyShapeStepProps {
  onNext: () => void;
}

export default function BodyShapeStep({ onNext }: BodyShapeStepProps) {
  const { analysisData, setAnalysisData } = useAnalysis();
  const [allBodyTypes] = useState<BodyType[]>(hardcodedBodyShapes);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    // Set default selection if not already set
    if (!analysisData.body_shape_id) {
      setAnalysisData((prev) => ({
        ...prev,
        body_shape_id: hardcodedBodyShapes[0].id,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectBodyType = (typeId: string) => {
    setAnalysisData((prev) => ({ ...prev, body_shape_id: typeId }));

    // Store body_shape_id in tiebymin-analysis-data localStorage
    const currentData = localStorage.getItem("tiebymin-analysis-data");
    const parsedData = currentData ? JSON.parse(currentData) : {};
    const updatedData = {
      ...parsedData,
      body_shape_id: typeId,
    };
    localStorage.setItem("tiebymin-analysis-data", JSON.stringify(updatedData));
  };

  const selectedTypeId = analysisData.body_shape_id;
  const selectedType = allBodyTypes.find((type) => type.id === selectedTypeId);

  const topRow = allBodyTypes.slice(0, Math.ceil(allBodyTypes.length / 2));
  const bottomRow = allBodyTypes.slice(Math.ceil(allBodyTypes.length / 2));

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFC6C6] text-red-500">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="w-full lg:flex-1">
      {isDesktop ? (
        <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-start">
          <div className="lg:order-1">
            {isLoading ? (
              <BodyTypeSkeleton
                count={allBodyTypes.length > 0 ? allBodyTypes.length : 6}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto gap-4 sm:gap-8">
                <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4 justify-center w-full">
                  {topRow.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => handleSelectBodyType(type.id)}
                      className="cursor-pointer flex flex-col items-center flex-1 min-w-[90px] max-w-[120px]"
                    >
                      <div className="relative mb-2 flex h-36 xs:h-40 sm:h-64 w-16 xs:w-20 sm:w-32 items-center justify-center">
                        <div
                          className={`absolute inset-0 transition-opacity duration-300 rounded-lg ${
                            selectedTypeId === type.id
                              ? "opacity-100 bg-gradient-to-b from-[#f0f0f0]/90 to-transparent"
                              : "opacity-0"
                          }`}
                        />
                        <Image
                          src={type.link_picture}
                          alt={`${type.name} body type`}
                          layout="fill"
                          objectFit="contain"
                          className="relative z-10"
                        />
                      </div>
                      <p
                        className={`text-xs sm:text-sm text-center ${
                          selectedTypeId === type.id
                            ? "text-[#323232] font-bold"
                            : "text-[#323232]"
                        }`}
                      >
                        {type.name}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4 justify-center w-full">
                  {bottomRow.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => handleSelectBodyType(type.id)}
                      className="cursor-pointer flex flex-col items-center flex-1 min-w-[90px] max-w-[120px]"
                    >
                      <div className="relative mb-2 flex h-36 xs:h-40 sm:h-64 w-16 xs:w-20 sm:w-32 items-center justify-center">
                        <div
                          className={`absolute inset-0 transition-opacity duration-300 rounded-lg ${
                            selectedTypeId === type.id
                              ? "opacity-100 bg-gradient-to-b from-[#f0f0f0]/90 to-transparent"
                              : "opacity-0"
                          }`}
                        />
                        <Image
                          src={type.link_picture}
                          alt={`${type.name} body type`}
                          layout="fill"
                          objectFit="contain"
                          className="relative z-10"
                        />
                      </div>
                      <p
                        className={`text-xs sm:text-sm text-center ${
                          selectedTypeId === type.id
                            ? "text-[#323232] font-bold"
                            : "text-[#323232]"
                        }`}
                      >
                        {type.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="bg-[#f0f0f0] backdrop-blur-sm shadow-xl rounded-t-2xl lg:rounded-2xl border-0 p-[25px] lg:order-2 flex flex-col">
            {isLoading || !selectedType ? (
              <div className="w-full animate-pulse space-y-4">
                <BodyTypeSkeleton />
              </div>
            ) : (
              <>
                {/* --- PERUBAHAN 3: Bungkus konten utama dengan div 'flex-1' agar bisa tumbuh --- */}
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#323232] font-oswald text-left">
                    {selectedType.name}
                  </h2>

                  {/* Selected Body Shape Image */}
                  <div className="flex justify-center my-4">
                    <div className="relative w-32 h-40 sm:w-40 sm:h-48 overflow-hidden ">
                      <Image
                        src={selectedType.link_picture}
                        alt={`${selectedType.name} body shape`}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>

                  <p className="text-[#323232] text-lg my-4 leading-relaxed text-left">
                    {selectedType.penjelasan_body_shape}
                  </p>
                  <h3 className="font-bold text-[#323232] text-xl mb-2 text-left">
                    Karakteristik
                  </h3>
                  <div className="space-y-2">
                    {selectedType.karakteristik
                      .split("-")
                      .filter((c) => c.trim() !== "")
                      .map((char, index) => (
                        <div
                          key={index}
                          className="flex text-xs lg:text-lg text-[#323232] font-poppins"
                        >
                          <span className="mr-2">•</span>
                          <span>{char.trim()}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* --- PERUBAHAN 4: Tombol sekarang akan otomatis di bawah karena parent-nya adalah flex-col --- */}
                <button
                  className="w-full flex items-center justify-center bg-[#323232] text-[#f0f0f0] rounded-xl py-5 font-bold hover:bg-gray-700 mt-5"
                  onClick={onNext}
                >
                  <span className="font-bold font-poppins text-[#f0f0f0]">
                    Selanjutnya
                  </span>
                  <ChevronRight />
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full mx-auto flex flex-col h-full">
          <div className="bg-[#f0f0f0] lg:min-h-full min-h-[73vh] backdrop-blur-sm shadow-xl rounded-t-2xl lg:rounded-2xl border-0 py-6 px-4 sm:py-8 sm:px-5 md:py-10 md:px-8 lg:px-10 mt-4 lg:mt-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-oswald font-bold mb-4">
              Pilih Bentuk Tubuh Kamu
            </h2>
            <div className="overflow-x-auto flex justify-centeritems-center pb-4">
              <div className="flex justify-between items-center gap-x-7">
                {allBodyTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => handleSelectBodyType(type.id)}
                    className="flex flex-col items-center cursor-pointer flex-shrink-0"
                  >
                    <Image
                      src={type.link_picture}
                      alt={type.name}
                      width={45}
                      height={130}
                      className="h-32 w-auto object-contain"
                    />
                    <div
                      className={`transition-opacity duration-300 ${
                        selectedTypeId === type.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-black mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isLoading || !selectedType ? (
              <div className="animate-pulse space-y-3 mt-6">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="mt-3 border p-3 rounded-lg flex flex-col h-[310px]">
                <h2 className="text-2xl font-bold font-oswald">
                  {selectedType.name}
                </h2>

                <p className="text-[#323232] font-poppins text-sm mt-2 mb-4 overflow-y-auto">
                  {selectedType.penjelasan_body_shape}
                </p>
                <div className="flex-1 overflow-y-auto">
                  <h3 className="font-bold text-[#323232] font-poppins mb-2">
                    Karakteristik
                  </h3>
                  <div className="space-y-2">
                    {selectedType.karakteristik
                      .split("-")
                      .filter((c) => c.trim() !== "")
                      .map((char, index) => (
                        <div
                          key={index}
                          className="flex text-xs lg:text-xl text-[#323232] font-poppins"
                        >
                          <span className="mr-2">•</span>
                          <span>{char.trim()}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <Button
                className="w-full h-14 bg-[#323232] text-[#f0f0f0] mb-10 rounded-xl py-3 font-bold hover:bg-gray-700"
                onClick={onNext}
              >
                Selanjutnya
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
