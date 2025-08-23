import { AllTips, UserData } from "@/types";
import { Sparkles } from "lucide-react";
import { Footer } from "./footer-pdf";
import { PageHeader } from "./header-pdf";

// PERUBAHAN 2: Komponen TipBox dibuat lebih "pintar"
const TipBox = ({
  title,
  content, // Mengubah prop dari `items` (array) menjadi `content` (string)
  loading,
  error,
}: {
  title: string;
  content?: string; // Prop sekarang adalah string tunggal
  loading: boolean;
  error: boolean;
}) => {
  if (loading) {
    return (
      <div className="bg-white p-6  animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 ">
        <h3 className="text-xl font-bold mb-2 text-red-700">{title}</h3>
        <p className="text-red-600">Gagal memuat tips.</p>
      </div>
    );
  }

  // Memecah string content menjadi beberapa poin berdasarkan titik.
  const tips =
    content
      ?.split(".")
      .map((tip) => tip.trim())
      .filter((tip) => tip.length > 0) || [];

  return (
    <div className="p-6 border border-[#323232]">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {tips.length > 0 ? (
        <ul className="list-disc list-inside space-y-2">
          {tips.map((tip, index) => (
            <span key={index} className="text-gray-700 font-poppins text-base">
              {tip}. {/* Menambahkan kembali titik di akhir */}
            </span>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Tidak ada tips yang tersedia.</p>
      )}
    </div>
  );
};

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
  // Mengambil kalimat pertama untuk rekap
  const getFirstSentence = (text?: string) =>
    text ? `${text.split(".")[0]}.` : "";

  return (
    // PERUBAHAN 1: Ganti `h-screen` menjadi `h-full` dan sederhanakan struktur root.
    <div className="bg-[#F0F0F0] w-full h-full px-10 flex flex-col">
      <PageHeader name={userData.name} />

      {/* PERUBAHAN 3: Tambahkan `overflow-y-auto` agar konten bisa di-scroll jika panjang */}
      <main className="flex-grow py-6 overflow-y-auto">
        <div className="flex flex-col gap-6">
          <TipBox
            title="Tips untuk bentuk wajah kamu"
            content={faceTip} // Langsung pass string
            loading={isLoading}
            error={isError}
          />
          <TipBox
            title="Tips untuk bentuk badan kamu"
            content={bodyTip} // Langsung pass string
            loading={isLoading}
            error={isError}
          />
          <TipBox
            title="Tips untuk tone warna kamu"
            content={colorTip} // Langsung pass string
            loading={isLoading}
            error={isError}
          />
          <div className="bg-[#323232] font-poppins text-white p-6  shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="fill-white" size={20} />
              <p className="font-bold">Rekap Cepat Tips Kamu</p>
            </div>
            <p className="text-sm leading-relaxed text-gray-200">
              {getFirstSentence(faceTip)} {getFirstSentence(bodyTip)}{" "}
              {getFirstSentence(colorTip)}
            </p>
          </div>
        </div>
      </main>

      <Footer page="06" />
    </div>
  );
};
