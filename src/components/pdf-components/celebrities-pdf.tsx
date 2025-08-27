import { Celebrity, UserData } from "@/types";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { Footer } from "./footer-pdf";
import { PageHeader } from "./header-pdf";

export const CelebritiesMatch = ({
  userData,
  celebrityDetails,
}: {
  userData: UserData;
  celebrityDetails?: Celebrity;
}) => (
  <div className="bg-[#F0F0F0] w-full h-full px-10 flex flex-col">
    <PageHeader name={userData.name} />

    {/* Konten utama yang mengisi sisa ruang */}
    <main className="flex flex-col flex-grow py-6">
      <h1 className="text-[48px] text-gray-900 leading-tight font-oswald">
        Selebriti yang serupa <br /> dengan kamu
      </h1>
      <hr className="border-[#323232] my-10" />

      <div className="flex gap-6">
        {/* Kolom Kiri: Gambar */}
        <div className="relative w-[55%] h-full overflow-hidden shadow-lg">
          <Image
            loading="eager"
            decoding="sync"
            src={celebrityDetails?.picture_url || "/placeholder.png"} // Tambahkan placeholder
            alt={celebrityDetails?.name || "Celebrity Match"}
            fill
            className="object-cover h-[500px]"
            priority
          />
          <div className="absolute bottom-4 left-4 bg-[#323232] text-white text-sm font-bold px-3 py-2 flex items-center shadow-lg">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
            {userData.celebrityMatch.matchPercentage}% Match
          </div>
        </div>

        {/* Kolom Kanan: Teks */}
        <div className="w-[45%] flex flex-col">
          <h2 className="text-3xl font-oswald mb-2">
            {celebrityDetails?.name}
          </h2>

          <p className="font-poppins text-base text-gray-700 leading-relaxed">
            {celebrityDetails?.description}
          </p>

          {/* Kotak "Kenapa Cocok?" didorong ke bawah */}
          <div className="bg-[#323232] text-white p-6 mt-5">
            <h3 className="text-lg font-bold mb-2">Kenapa Cocok?</h3>
            <p className="text-sm leading-relaxed">
              {/* PERUBAHAN 3: Menggunakan .join untuk menampilkan list lebih rapi */}
              {celebrityDetails?.similarity_text ||
                userData.celebrityMatch.reason.join(", ")}
            </p>
          </div>
        </div>
      </div>
    </main>

    <Footer page="05" />
  </div>
);
