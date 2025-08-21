import { UserData } from "@/types";
import { useRecommendations } from "@/hooks/useRecommendations";
import Image from "next/image";
import { Footer } from "./footer-pdf";
import { PageHeader } from "./header-pdf";

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

  // Combine hijab and clothes recommendations
  const allProducts = recommendationsData
    ? [
        ...(recommendationsData.hijab || []),
        ...(recommendationsData.clothes || []),
      ]
    : [];

  // Sort by compatibility score
  const sortedProducts = [...allProducts].sort(
    (a, b) => b.total_compatibility_score - a.total_compatibility_score
  );

  // Take top 3 products for PDF
  const topProducts = sortedProducts.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-[#F0F0F0]">
        <div className="w-full px-10 flex flex-col justify-between min-h-screen ">
          <PageHeader name={userData.name} />
          <main className="flex-grow">
            <h1 className="text-5xl font-oswald text-[#323232] mb-4">
              Rekomendasi Produk
            </h1>
            <hr className="border-[#323232] mb-10" />
            <div className="flex items-center justify-center">
              <p className="text-gray-600">Memuat rekomendasi produk...</p>
            </div>
          </main>
          <Footer page="06" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-white">
        <div className="w-full px-10 flex flex-col justify-between min-h-screen">
          <PageHeader name={userData.name} />
          <main className="flex-grow">
            <h1 className="text-5xl font-oswald text-[#323232] mb-4">
              Rekomendasi Produk
            </h1>
            <hr className="border-[#323232] mb-10" />
            <div className="flex items-center justify-center">
              <p className="text-red-600">Gagal memuat rekomendasi produk.</p>
            </div>
          </main>
          <Footer page="06" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[#F0F0F0]">
      <div className="w-full px-10 flex flex-col justify-between min-h-screen">
        <PageHeader name={userData.name} />
        <main className="flex-grow">
          <h1 className="text-5xl font-oswald text-[#323232] mb-[50px]">
            Rekomendasi Produk
          </h1>
          <hr className="border-[#323232] my-[25px]" />

          {topProducts.length > 0 ? (
            <div className="flex flex-col gap-8">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row items-center"
                >
                  {/* Card Gambar */}
                  <div className="w-full md:w-1/2 h-[180px] relative overflow-hidden shadow-md">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-4 left-4 bg-[#323232] bg-opacity-70 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                      {Math.round(product.total_compatibility_score * 10)}%
                      Match
                    </div>
                  </div>
                  {/* Card Deskripsi */}
                  <div className="w-full md:w-1/2 bg-[#323232] text-white p-8 flex flex-col justify-center h-[180px]">
                    <h2 className="text-4xl font-oswald mb-4">
                      {product.name}
                    </h2>
                    {/* <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">
                        Rp{product.current_price.toLocaleString("id-ID")}
                      </div>
                      {product.original_price > 0 && (
                        <div className="text-sm line-through text-gray-400">
                          Rp{product.original_price.toLocaleString("id-ID")}
                        </div>
                      )}
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-gray-600">
                Tidak ada rekomendasi produk yang tersedia.
              </p>
            </div>
          )}
        </main>
        <Footer page="06" />
      </div>
    </div>
  );
};
