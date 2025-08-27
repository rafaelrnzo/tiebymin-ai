import { UserData, Product } from "@/types";
import { useRecommendations } from "@/hooks/useRecommendations";
import Image from "next/image";
import { Footer } from "./footer-pdf";
import { PageHeader } from "./header-pdf";

const MainContent = ({
  isLoading,
  error,
  products,
}: {
  isLoading: boolean;
  error: Error | null;
  products: Product[];
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Memuat rekomendasi produk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-600">Gagal memuat rekomendasi produk.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">
          Tidak ada rekomendasi produk yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {products.slice(0, 3).map((product, index) => (
        <div
          key={product.id}
          className="flex flex-row items-center h-[180px] shadow-lg"
        >
          {/* Card Gambar */}
          <div className="w-1/2 h-full relative overflow-hidden rounded-l-lg bg-gray-100">
            <Image
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name || "Product"}
              fill
              loading="eager"
              decoding="sync"
              className="object-cover"
              priority={true}
              unoptimized={true} // Disable optimization for PDF generation
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.png";
              }}
            />
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs font-bold">
              {Math.round((product.total_compatibility_score || 0) * 10)}% Match
            </div>
          </div>
          {/* Card Deskripsi */}
          <div className="w-1/2 bg-[#323232] text-white p-6 flex flex-col justify-center h-full rounded-r-lg">
            <h2
              className="text-3xl font-oswald mb-2 truncate"
              title={product.name || "Product"}
            >
              {product.name || "Product Name"}
            </h2>
            <p className="text-lg font-bold text-gray-200">
              Rp{(product.current_price || 0).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProductRecommendation = ({
  userData,
  resultId,
}: {
  userData: UserData;
  resultId: string;
}) => {
  const {
    data: recommendationsData,
    isLoading,
    error,
  } = useRecommendations(resultId);

  // Menggabungkan dan mengurutkan produk
  const topProducts = recommendationsData
    ? [
        ...(recommendationsData.hijab || []),
        ...(recommendationsData.clothes || []),
      ]
        .sort(
          (a, b) => b.total_compatibility_score - a.total_compatibility_score
        )
        .slice(0, 3)
    : [];

  return (
    // PERUBAHAN 1: Menggunakan satu struktur utama dengan `h-full`
    <div className="bg-[#F0F0F0] w-full h-full px-10 flex flex-col">
      <PageHeader name={userData.name} />

      <main className="flex-grow flex flex-col py-6">
        <h1 className="text-5xl font-oswald text-[#323232]">
          Rekomendasi Produk
        </h1>
        <hr className="border-[#323232] my-10" />

        {/* PERUBAHAN 2: Konten dirender secara dinamis di sini */}
        <div className="flex-grow">
          <MainContent
            isLoading={isLoading}
            error={error}
            products={topProducts}
          />
        </div>
      </main>

      {/* PERUBAHAN 3: Nomor halaman disesuaikan */}
      <Footer page="07" />
    </div>
  );
};
