import { ProductRecommendationSkeleton } from "@/components/skeleton-loading/product-recommendation-skeleton";
import { useProductCompatibility } from "@/hooks/useProductCompatibility";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Product, UserData } from "@/types";
import Image from "next/image";
import { Footer } from "./footer-pdf";
import { PageHeader } from "./header-pdf";

const MainContent = ({
  isLoading,
  error,
  products,
  userData,
}: {
  isLoading: boolean;
  error: Error | null;
  products: Product[];
  userData: UserData;
}) => {
  if (isLoading) {
    return <ProductRecommendationSkeleton userData={userData} />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-red-600 text-lg font-medium">
            Gagal memuat rekomendasi produk
          </p>
          <p className="text-gray-500 text-sm mt-1">Silakan coba lagi nanti</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            Tidak ada rekomendasi produk yang tersedia
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Coba lagi nanti atau hubungi customer service
          </p>
        </div>
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
              src={product.images?.[0]}
              alt={product.name || "Product"}
              fill
              loading="eager"
              decoding="sync"
              className="object-cover"
              priority={true}
              unoptimized={true} // Disable optimization for PDF generation
            />
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-[#f0f0f0] px-3 py-1 rounded-full text-xs font-bold">
              {Math.round((product.total_compatibility_score || 0) * 10)}% Match
            </div>
          </div>
          {/* Card Deskripsi */}
          <div className="w-1/2 bg-[#323232] text-[#f0f0f0] p-6 flex flex-col justify-center h-full rounded-r-lg">
            <h2
              className="text-3xl font-oswald mb-2 truncate"
              title={product.name || "Product"}
            >
              {product.name || "Product Name"}
            </h2>
            <p className="text-sm font-medium text-gray-200 leading-tight line-clamp-3">
              {product.compatibility_reason || "Produk ini cocok untuk Anda"}
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

  // Get compatibility data for hijab and clothes
  const { data: hijabCompatibilityData } = useProductCompatibility(
    resultId,
    "hijab"
  );
  const { data: clothesCompatibilityData } = useProductCompatibility(
    resultId,
    "clothes"
  );

  // Combine compatibility data
  const combinedCompatibilityData = {
    ...hijabCompatibilityData,
    ...clothesCompatibilityData,
  };

  // Menggabungkan dan mengurutkan produk dengan compatibility reasons
  const topProducts = recommendationsData
    ? [
        ...(recommendationsData.hijab || []),
        ...(recommendationsData.clothes || []),
      ]
        .map((product) => ({
          ...product,
          compatibility_reason:
            combinedCompatibilityData[product.id]?.compatibility_reason || "",
          total_compatibility_score:
            combinedCompatibilityData[product.id]?.compatibility_score ||
            product.total_compatibility_score ||
            0,
        }))
        .sort(
          (a, b) => b.total_compatibility_score - a.total_compatibility_score
        )
        .slice(0, 3)
    : [];

  return (
    <div className="bg-[#F0F0F0] w-full h-full px-10 flex flex-col">
      <PageHeader name={userData.name} />

      <main className="flex-grow flex flex-col py-6">
        <h1 className="text-5xl font-oswald text-[#323232]">
          Rekomendasi Produk
        </h1>
        <hr className="border-[#323232] my-10" />

        <div className="flex-grow">
          <MainContent
            isLoading={isLoading}
            error={error}
            products={topProducts}
            userData={userData}
          />
        </div>
      </main>

      <Footer page="07" />
    </div>
  );
};
