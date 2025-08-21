import { AllTips, UserData } from "@/types";
import { Sparkles } from "lucide-react";
import { Footer } from "./footer-pdf";
import { PageHeader } from "./header-pdf";

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
