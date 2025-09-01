"use client";

import { Shirt, UserStar } from "lucide-react";
import ProductCardMobile from "@/components/ProductCardMobile";
import ProductCardDesktop from "@/components/ProductCardDesktop";
import ResponsiveCarousel from "@/components/component-landing/carousel";
import EmptyState from "./EmptyState";

interface Product {
  id: string;
  name: string;
  images: string[];
  current_price: number;
  original_price: number;
  total_compatibility_score: number;
  average_rating: number;
  color_recommendations?: string[];
  size_range: string;
  product_link: string;
}

interface ProductRecommendationsSectionProps {
  sortedProducts: Product[];
  topProductScores: Map<string, number>;
  recommendationFilter: "hijab" | "clothes";
  onFilterChange: (filter: "hijab" | "clothes") => void;
}

const ProductRecommendationsSection: React.FC<
  ProductRecommendationsSectionProps
> = ({
  sortedProducts,
  topProductScores,
  recommendationFilter,
  onFilterChange,
}) => {
  return (
    <section className="pt-8 lg:pt-16">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-4 lg:mb-10">
        <hr className="border-t-2 border-black w-full lg:hidden md:hidden block" />
        <h1 className="text-xl sm:text-2xl lg:text-5xl font-oswald font-bold text-[#333333] mb-2 sm:mb-4 lg:mb-[25px]">
          Rekomendasi Produk
        </h1>
        <div className="flex justify-center items-center gap-2 self-start md:self-center">
          <div className=" flex justify-center gap-2 sm:gap-3 min-w-max">
            <button
              onClick={() => onFilterChange("hijab")}
              className={`flex items-center justify-center gap-2.5 rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-all duration-300 ease-in-out transform hover:scale-105 whitespace-nowrap ${
                recommendationFilter === "hijab"
                  ? "bg-[#323232] text-[#f0f0f0] shadow-lg"
                  : "bg-gray-200 text-[#323232]"
              }`}
            >
              <span className="font-poppins font-bold text-sm sm:text-base">
                Hijab
              </span>
              <UserStar className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => onFilterChange("clothes")}
              className={`flex items-center justify-center gap-2.5 rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-all duration-300 ease-in-out transform hover:scale-105 whitespace-nowrap ${
                recommendationFilter === "clothes"
                  ? "bg-[#323232] text-[#f0f0f0] shadow-lg"
                  : "bg-gray-200 text-[#323232]"
              }`}
            >
              <span className="font-poppins font-bold text-sm sm:text-base">
                Pakaian
              </span>
              <Shirt className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        {sortedProducts.length > 0 ? (
          <>
            {/* Mobile Carousel - Single Card */}
            <div className="lg:hidden">
              <ResponsiveCarousel
                key={recommendationFilter} // Reset carousel when filter changes
                data={sortedProducts}
                renderItem={(product) => (
                  <ProductCardMobile
                    product={product}
                    topProductScores={topProductScores}
                    sortedProducts={sortedProducts}
                  />
                )}
              />
            </div>

            <div className="hidden lg:block">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCardDesktop
                    key={product.id}
                    product={product}
                    topProductScores={topProductScores}
                    sortedProducts={sortedProducts}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
};

export default ProductRecommendationsSection;
