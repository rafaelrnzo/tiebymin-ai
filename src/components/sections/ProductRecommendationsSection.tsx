"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types";
import { Shirt, UserStar } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import EmptyState from "./EmptyState";

const ProductCardMobile = dynamic(
  () => import("@/components/ProductCardMobile"),
  {
    loading: () => (
      <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
    ),
  }
) as React.ComponentType<{
  product: Product;
  topProductScores?: Map<string, number>;
  sortedProducts: Product[];
  isRegularProduct?: boolean;
}>;

const ProductCardDesktop = dynamic(
  () => import("@/components/ProductCardDesktop"),
  {
    loading: () => (
      <div className="h-80 bg-gray-200 animate-pulse rounded-lg" />
    ),
  }
) as React.ComponentType<{
  product: Product;
  topProductScores?: Map<string, number>;
  sortedProducts: Product[];
  isRegularProduct?: boolean;
}>;

const ResponsiveCarousel = dynamic(
  () => import("@/components/component-landing/carousel"),
  {
    loading: () => (
      <div className="h-80 bg-gray-200 animate-pulse rounded-lg" />
    ),
  }
) as React.ComponentType<{
  data: Product[];
  renderItem: (product: Product) => React.ReactNode;
  onCardChange?: (currentIndex: number) => void;
}>;

interface ProductRecommendationsSectionProps {
  sortedProducts: Product[];
  topProductScores?: Map<string, number>;
  recommendationFilter: "hijab" | "clothes";
  onFilterChange: (filter: "hijab" | "clothes") => void;
}

const ProductRecommendationsSection: React.FC<
  ProductRecommendationsSectionProps
> = ({
  sortedProducts,
  topProductScores = new Map(),
  recommendationFilter,
  onFilterChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;

  const { data: allProducts = [], isLoading: isLoadingProducts } =
    useProducts();

  // Create a set of recommended product IDs for deduplication
  const recommendedProductIds = new Set(sortedProducts.map((p) => p.id));

  // Filter out products that are already in recommendations and separate by category
  // Include products with description = "null" and stock_quantity = 0
  const regularProducts = allProducts.filter(
    (product) => !recommendedProductIds.has(product.id) && product.is_active
  );

  const regularHijabProducts = regularProducts.filter(
    (p) => p.category === "hijab"
  );
  const regularClothesProducts = regularProducts.filter(
    (p) => p.category === "clothes"
  );

  // Get current category products
  const currentRegularProducts =
    recommendationFilter === "hijab"
      ? regularHijabProducts
      : regularClothesProducts;

  // Combine all products for unified pagination
  const allProductsForPagination = useMemo(() => {
    // First show recommended products, then regular products
    return [...sortedProducts, ...currentRegularProducts];
  }, [sortedProducts, currentRegularProducts]);

  // Client-side pagination logic like profile page
  const paginationData = useMemo(() => {
    const totalItems = allProductsForPagination.length;
    const totalPages = Math.ceil(totalItems / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedItems = allProductsForPagination.slice(startIndex, endIndex);

    return {
      totalItems,
      totalPages,
      paginatedItems,
      startIndex,
      endIndex,
    };
  }, [currentPage, allProductsForPagination, productsPerPage]);

  // Reset to page 1 when data changes
  useEffect(() => {
    if (
      paginationData.totalPages > 0 &&
      currentPage > paginationData.totalPages
    ) {
      setCurrentPage(1);
    }
  }, [allProductsForPagination.length, currentPage, paginationData.totalPages]);

  const generatePageNumbers = useMemo(() => {
    const { totalPages } = paginationData;
    const pages: number[] = [];
    const maxVisiblePages = 5; // Meningkatkan jumlah halaman yang terlihat

    if (totalPages <= maxVisiblePages) {
      // Tampilkan semua halaman jika total kurang dari max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Hitung range di sekitar halaman saat ini
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - halfVisible);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      // Sesuaikan start jika kita mendekati akhir
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      // Tambahkan halaman pertama jika tidak termasuk
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push(-1); // Placeholder untuk "..."
        }
      }

      // Tambahkan halaman di range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Tambahkan halaman terakhir jika tidak termasuk
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push(-1); // Placeholder untuk "..."
        }
        pages.push(totalPages);
      }
    }

    return pages;
  }, [paginationData.totalPages, currentPage]);

  // Handler untuk perubahan halaman
  const handlePageChange = (page: number) => {
    if (
      page >= 1 &&
      page <= paginationData.totalPages &&
      page !== currentPage
    ) {
      setCurrentPage(page);
      // Scroll ke atas untuk UX yang lebih baik
      const sectionElement = document.querySelector("section");
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleCardChange = useCallback(
    (currentIndex: number) => {
      const pageForCurrentCard = Math.floor(currentIndex / productsPerPage) + 1;
      setCurrentPage((prev) =>
        pageForCurrentCard === prev ? prev : pageForCurrentCard
      );
    },
    [productsPerPage]
  );

  // Pagination logic: Page 1 shows only recommendations, Page 2+ shows regular products
  const allDisplayedProducts = paginationData.paginatedItems;

  const productContent = (
    <>
      <div className="lg:hidden">
        <ResponsiveCarousel
          key={recommendationFilter}
          data={allProductsForPagination}
          onCardChange={handleCardChange}
          renderItem={(product) => (
            <ProductCardMobile
              product={product}
              topProductScores={topProductScores}
              sortedProducts={allProductsForPagination}
              isRegularProduct={!recommendedProductIds.has(product.id)}
            />
          )}
        />
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {allDisplayedProducts.map((product) => (
            <ProductCardDesktop
              key={product.id}
              product={product}
              topProductScores={topProductScores}
              sortedProducts={allDisplayedProducts}
              isRegularProduct={!recommendedProductIds.has(product.id)}
            />
          ))}
        </div>
      </div>
    </>
  );

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
              className={`flex items-center justify-center gap-2.5 rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-colors duration-200 whitespace-nowrap ${
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
              className={`flex items-center justify-center gap-2.5 rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-colors duration-200 whitespace-nowrap ${
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
        {allDisplayedProducts.length > 0 ? productContent : <EmptyState />}
      </div>

      {/* Pagination Controls - hanya tampil di desktop */}
      {paginationData.totalPages > 1 && (
        <section className="mt-8 flex justify-center hidden lg:flex">
          <Pagination>
            <PaginationContent className="gap-2">
              {generatePageNumbers.map((page, index) => (
                <PaginationItem key={`${page}-${index}`}>
                  {page === -1 ? (
                    // Ellipsis placeholder
                    <span className="px-3 py-2 text-gray-400">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${
                        page === currentPage
                          ? "bg-[#EF789B] text-[#f0f0f0] border-0 hover:bg-[#EF789B]/90 hover:text-[#f0f0f0]"
                          : "bg-[#323232]/10 text-[#323232] hover:bg-[#EF789B]/10"
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        </section>
      )}
    </section>
  );
};

export default ProductRecommendationsSection;
