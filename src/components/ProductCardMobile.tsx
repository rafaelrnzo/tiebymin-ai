"use client";

import Image from "next/image";
import { Star, ThumbsUp } from "lucide-react";
import { Button } from "./ui/button";
import { Product } from "@/types";

interface ProductCardMobileProps {
  product: Product;
  topProductScores?: Map<string, number>;
  sortedProducts: Product[];
  isRegularProduct?: boolean;
}

const ProductCardMobile: React.FC<ProductCardMobileProps> = ({
  product,
  topProductScores = new Map(),
  sortedProducts,
  isRegularProduct = false,
}) => {
  const isUnavailable = product.description === "null";

  const unavailableText =
    (product.stock_quantity ?? 0) === 0 ? "Coming Soon" : "Segera Hadir";

  return (
    <div
      className={`bg-[#f0f0f0] border rounded-2xl overflow-hidden flex flex-col transition-shadow duration-300 min-h-[550px] w-full mx-auto border-[#323232]`}
    >
      <div className="relative p-2">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-72 object-cover rounded-xl"
        />
        {product.total_compatibility_score && (
          <span className="absolute bottom-4 left-4 bg-[#323232] bg-opacity-70 text-[#f0f0f0] px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2">
            {isRegularProduct
              ? "Produk Populer"
              : `${product.total_compatibility_score?.toFixed(0) || 0}% Match`}
          </span>
        )}
        <span className="absolute bottom-4 right-4 bg-[#f0f0f0] text-[#323232] px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          {product.average_rating}
        </span>
      </div>
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2">
          {sortedProducts.findIndex((p) => p.id === product.id) < 3 &&
            product.total_compatibility_score && (
              <div className="flex items-center gap-1 text-pink-500 flex-shrink-0">
                <ThumbsUp className="w-4 h-4" />
                <span className="font-semibold text-xs">Rekomendasi</span>
              </div>
            )}
        </div>

        <h3 className="font-bold text-[#323232] text-lg text-left mb-2">
          {product.name}
        </h3>

        {!isUnavailable && (
          <>
            <div className="flex items-baseline my-1 sm:my-2">
              <span className="text-gray-800 font-extrabold text-lg sm:text-2xl">
                {`Rp${product.current_price.toLocaleString("id-ID")}`}
              </span>
              {product.original_price > 0 && (
                <span className="text-gray-400 text-xs sm:text-sm ml-2 line-through">
                  {`Rp${product.original_price.toLocaleString("id-ID")}`}
                </span>
              )}
            </div>
            <div className="flex items-start justify-between gap-2 sm:gap-4 my-2 sm:my-4">
              <div className="flex flex-col gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-gray-600">
                  Rekomendasi Warna
                </span>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {product.color_recommendations?.map((color, index) => (
                    <div
                      key={index}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Ukuran</span>
                <span className="text-xs sm:text-sm font-medium text-right">
                  {product.size_range}
                </span>
              </div>
            </div>
          </>
        )}

        {isUnavailable ? (
          <div className="bg-[#323232] mt-4 bg-[url('/card-bg.webp')] bg-cover bg-center rounded-2xl flex items-center justify-center gap-4 flex-1">
            <div className="mt-4">
              <svg
                width="31"
                height="30"
                viewBox="0 0 31 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M26.0569 3.5319C20.5294 -0.918722 17.6078 7.89442 17.6078 7.89442C17.6078 1.54895 10.7994 -1.16793 6.77271 1.54896C2.7827 4.24106 3.27885 10.5383 9.07264 13.3145C2.17293 14.5924 -2.93819 21.5988 2.30429 27.107C8.68667 33.8128 14.549 24.5977 16.3925 21.7001C16.4145 21.6654 16.436 21.6316 16.4569 21.5988C20.4397 29.4865 26.5397 29.4133 29.3287 25.0359C35.1682 15.8703 22.3404 12.6094 22.3404 12.6094C22.3404 12.6094 33.1118 9.21238 26.0569 3.5319ZM19.7208 13.2945C20.1851 13.0203 25.1884 9.98384 22.6935 7.89442C19.6416 5.33862 17.2975 11.1112 17.2975 11.1112C17.2975 11.1112 14.0687 4.42209 10.6188 6.48432C7.16883 8.54656 11.636 13.9755 11.636 13.9755C7.9208 14.8567 5.21718 20.0793 7.9215 22.0835C13.4512 26.1816 16.4569 19.3514 16.4569 19.3514C16.4569 19.3514 20.8351 25.6088 24.4626 21.1582C28.0548 16.751 20.9339 12.6658 19.7208 13.2945Z"
                  fill="#EF789B"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.0168 11.0671C13.5628 10.8919 12.0892 12.7177 12.1246 14.7686C12.1599 16.8195 13.9905 18.4568 16.0168 18.382C17.9702 18.3099 19.2898 16.6194 19.2898 14.7686C19.2898 12.9178 18.4708 11.2423 16.0168 11.0671ZM14.5129 14.7686C14.5959 13.7974 15.2157 12.9428 16.1937 12.9179C17.1952 12.8923 17.8895 13.7732 17.9629 14.7686C18.0461 15.8989 17.1454 17.0692 16.0168 16.9278C14.9947 16.7998 14.4256 15.7912 14.5129 14.7686Z"
                  fill="#EF789B"
                />
              </svg>
            </div>
            <p className="font-poppins font-bold text-xl mt-5 text-[#f0f0f0]">
              {unavailableText}
            </p>
          </div>
        ) : (
          <Button
            onClick={() => window.open(product.product_link, "_blank")}
            className="shadow-md flex justify-between mt-3 bg-[#ED80A7] w-full px-4 sm:px-7 py-3 sm:py-5 font-bold rounded-lg text-[#f0f0f0] items-center gap-2 sm:gap-3 text-sm sm:text-base hover:bg-pink-500 transition-colors"
          >
            <span>Beli Sekarang</span>
            <Image
              src="/overview-ai/icons/mynaui_cart-solid.svg"
              width={16}
              height={16}
              alt="Shopping Cart"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCardMobile;
