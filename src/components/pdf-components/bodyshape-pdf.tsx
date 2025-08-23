import { BodyShapeData, UserData } from "@/types";
import Image from "next/image";
import { Footer } from "./footer-pdf";
import { PageHeader } from "./header-pdf";

export const BodyShape = ({
  userData,
  bodyDetails,
}: {
  userData: UserData;
  bodyDetails?: BodyShapeData;
}) => {
  const bmiValue = userData.bmi.value;

  // Helper untuk mem-parse daftar karakteristik dengan aman
  const characteristics =
    bodyDetails?.karakteristik
      ?.split("-")
      .map((point) => point.trim())
      .filter(Boolean) || [];

  return (
    // PERUBAHAN 1: Hapus wrapper dan ganti `h-screen` menjadi `h-full`.
    // Hapus `justify-between` untuk mengandalkan `flex-grow` pada <main>.
    <div className="bg-[#F0F0F0] w-full h-full px-10 flex flex-col">
      <PageHeader width={100} name={userData.name} />

      {/* PERUBAHAN 2: <main> dengan flex-grow akan mengisi sisa ruang secara otomatis. */}
      <main className="mx-auto py-6 max-w-5xl flex-grow flex flex-col">
        {/* Konten Atas: Gambar dan Deskripsi */}
        <div className="flex gap-10">
          <div className="flex-shrink-0">
            <Image
              src={
                bodyDetails?.link_picture || userData.bodyShapeAnalysis.imageUrl
              }
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
            <div className="bg-[#323232] text-white p-6 rounded-lg mt-auto">
              <h3 className="text-lg font-bold mb-3">Karakteristik</h3>
              <ul className="list-disc list-inside space-y-2">
                {characteristics.map((point, index) => (
                  <li key={index} className="text-base font-poppins">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Konten Bawah: BMI Index */}
        <div className="pt-8">
          <p className="font-bold">
            BMI INDEX: {bmiValue} ({userData.bmi.category})
          </p>
          <p className="text-gray-600 mb-3 text-sm">{userData.bmi.desc}</p>
          <div className="w-full h-8 rounded-md bg-gray-200 overflow-hidden">
            <div className="h-full rounded-md bg-gradient-to-r from-[#EF789B] to-[#F7D3DF]" />
          </div>
        </div>
      </main>

      <Footer page="04" />
    </div>
  );
};
