import { BodyShapeData, UserData, BmiCategory } from "@/types";
import Image from "next/image";
import { Footer } from "./footer-pdf";
import { PageHeader } from "./header-pdf";

export const BodyShape = ({
  userData,
  bodyDetails,
  bmiValue,
  bmiCategory,
  bmiCategoryDetails,
}: {
  userData: UserData;
  bodyDetails?: BodyShapeData;
  bmiValue?: number;
  bmiCategory?: string;
  bmiCategoryDetails?: BmiCategory;
}) => {
  // Use provided BMI value or fallback to userData
  const finalBmiValue = bmiValue ?? userData.bmi?.value ?? 0;
  const finalBmiCategory = bmiCategory ?? userData.bmi?.category ?? "Unknown";

  // Prioritize BMI category details from API when available
  const displayBmiCategory =
    bmiCategoryDetails?.kategori && bmiCategoryDetails.kategori !== "Unknown"
      ? bmiCategoryDetails.kategori
      : finalBmiCategory;
  const displayBmiTips =
    bmiCategoryDetails?.tips_fashion && bmiCategoryDetails.tips_fashion.trim()
      ? bmiCategoryDetails.tips_fashion
      : userData.bmi?.desc || "";

  // Helper untuk mem-parse daftar karakteristik dengan aman
  const characteristics =
    bodyDetails?.karakteristik
      ?.split("-")
      .map((point) => point.trim())
      .filter(Boolean) || [];

  return (
    <div className="bg-[#F0F0F0] w-full h-full px-10 flex flex-col">
      <PageHeader width={100} name={userData.name} />

      <main className="mx-auto py-6 max-w-5xl flex-grow flex flex-col">
        <div className="flex gap-10">
          <div className="flex-shrink-0">
            <Image
              src={bodyDetails?.link_picture as string}
              loading="eager"
              decoding="sync"
              alt={`Diagram Bentuk Tubuh ${userData.bodyShape}`}
              width={300} // Ukuran tetap sesuai desain
              height={400} // Ukuran tetap sesuai desain
              className="object-contain h-[450px]"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[24px] mb-4 font-oswald">
              Bentuk tubuh kamu {userData.bodyShape}
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {bodyDetails?.penjelasan_body_shape}
            </p>
            <div className="bg-[#323232] text-[#f0f0f0] p-6 rounded-lg mt-auto">
              <h3 className="text-lg font-bold mb-3 font-poppins">
                Karakteristik
              </h3>
              <ul className="space-y-2">
                {characteristics.map((point, index) => (
                  <li key={index} className="flex text-base font-poppins">
                    <span className="mr-2">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Konten Bawah: BMI Index */}
        <div className="pt-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex flex-col text-left">
              <span className="font-bold text-lg">
                BMI INDEX: {finalBmiValue} ({displayBmiCategory})
              </span>
              <p className="text-[#323232] text-sm leading-relaxed font-poppins">
                {displayBmiTips}
              </p>
            </div>
          </div>
          <div className="w-full h-6 rounded-md bg-gray-200 overflow-hidden">
            <div className="h-full rounded-md bg-gradient-to-r from-[#EF789B] to-[#F7D3DF]" />
          </div>
        </div>
      </main>

      <Footer page="04" />
    </div>
  );
};
