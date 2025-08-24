"use client";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/AnalysisContext";
import { secureUrl } from "@/lib/api";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LeftSideSection from "@/components/component-login/left-side-section";
import { ChevronRight } from "lucide-react";

// HELPER HOOK: (Tidak ada perubahan)
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      const listener = () => setMatches(media.matches);
      window.addEventListener("resize", listener);
      return () => window.removeEventListener("resize", listener);
    }
  }, [matches, query]);
  return matches;
};

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

export default function PrepareFacePage() {
  const { analysisData, setAnalysisData } = useAnalysis();
  const [allBodyTypes, setAllBodyTypes] = useState<BodyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    const fetchAllBodyShapes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(secureUrl(`/v1/body-shapes/`));
        if (response.data && response.data.length > 0) {
          setAllBodyTypes(response.data);
          if (!analysisData.body_shape_id) {
            setAnalysisData((prev) => ({
              ...prev,
              body_shape_id: response.data[0].id,
            }));
          }
        } else {
          setError("Tidak ada data bentuk tubuh yang ditemukan.");
        }
      } catch (err) {
        setError("Gagal memuat data bentuk tubuh. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllBodyShapes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectBodyType = (typeId: string) => {
    setAnalysisData((prev) => ({ ...prev, body_shape_id: typeId }));
  };

  const handleNext = () => {
    router.push(`/analyze/take-face`);
  };

  const selectedTypeId = analysisData.body_shape_id;
  const selectedType = allBodyTypes.find((type) => type.id === selectedTypeId);

  // Data untuk layout desktop
  const topRow = allBodyTypes.slice(0, Math.ceil(allBodyTypes.length / 2));
  const bottomRow = allBodyTypes.slice(Math.ceil(allBodyTypes.length / 2));

  // Data untuk stepper mobile
  const steps = [
    { number: "01", title: "Buat Akun", active: false },
    { number: "02", title: "Lengkapi Data", active: false },
    { number: "03", title: "Analisa", active: true },
  ];

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFC6C6] text-red-500">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[url('/login-bg.png')] bg-cover bg-center">
      {isDesktop ? (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-center">
          <div className="lg:order-1">
            <LeftSideSection
              currentStep={3}
              title="Pilih Bentuk Tubuh Kamu"
              description="Dengan mengetahui bentuk tubuhmu, kami bisa memberikan rekomendasi pakaian yang sesuai dengan proporsi tubuhmu"
            />
          </div>
          <div className="lg:order-2">
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
                              ? "opacity-100 bg-gradient-to-b from-white/90 to-transparent"
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
                            ? "text-gray-800 font-bold"
                            : "text-gray-500"
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
                              ? "opacity-100 bg-gradient-to-b from-white/90 to-transparent"
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
                            ? "text-gray-800 font-bold"
                            : "text-gray-500"
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
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl h-[620px] py-6 sm:py-8 px-4 sm:px-6 w-full max-w-xs md:max-w-sm mx-auto flex flex-col justify-between items-center lg:order-3">
            {isLoading || !selectedType ? (
              <div className="w-full animate-pulse space-y-4">
                <BodyTypeSkeleton />
              </div>
            ) : (
              <>
                <div className="w-full">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-oswald text-left">
                    {selectedType.name}
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm my-4 leading-relaxed text-left">
                    {selectedType.penjelasan_body_shape}
                  </p>
                  <h3 className="font-bold text-gray-800 mb-2 text-left">
                    Karakteristik
                  </h3>
                  <ul className="space-y-1 text-xs sm:text-sm text-gray-600 text-left list-disc list-inside">
                    {selectedType.karakteristik
                      .split("-")
                      .filter((char) => char.trim() !== "")
                      .map((char, index) => (
                        <li key={index}>
                          <span>{char.trim()}</span>
                        </li>
                      ))}
                  </ul>
                </div>
                <Button
                  className="w-full bg-[#323232] text-white rounded-xl py-3 font-bold hover:bg-gray-700"
                  onClick={handleNext}
                >
                  Selanjutnya
                  <ChevronRight />
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full mx-auto flex flex-col">
          <LeftSideSection steps={steps} currentStepNumber={3} />
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-oswald font-bold mb-4">
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
                <p className="text-gray-600 text-sm mt-2 mb-4 overflow-y-auto">
                  {selectedType.penjelasan_body_shape}
                </p>
                <div className="flex-1 overflow-y-auto">
                  <h3 className="font-bold text-gray-800 mb-2">
                    Karakteristik
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
                    {selectedType.karakteristik
                      .split("-")
                      .filter((c) => c.trim() !== "")
                      .map((char, index) => (
                        <li key={index}>{char.trim()}</li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-6">
              <Button
                className="w-full bg-[#323232] text-white mb-10 rounded-xl py-3 font-bold hover:bg-gray-700"
                onClick={handleNext}
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
