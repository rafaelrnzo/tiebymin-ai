"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ThumbsUp, Search } from "lucide-react";
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
  const [isFlipped, setIsFlipped] = useState(false);

  const isUnavailable = product.description === "null";
  const showFlip =
    !isUnavailable && (product.total_compatibility_score || isRegularProduct);

  const unavailableText =
    (product.stock_quantity ?? 0) === 0 ? "Coming Soon" : "Segera Hadir";

  const handleFlip = () => {
    if (showFlip) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.product_link) {
      window.open(product.product_link, "_blank");
    }
  };

  return (
    <div className="bg-[#f0f0f0] border rounded-2xl overflow-hidden flex flex-col transition-all duration-500 min-h-[550px] w-full mx-auto border-[#323232]">
      {/* Front Side */}
      {!isFlipped ? (
        <>
          <div
            className={`relative p-2 flex-1 ${
              showFlip ? "cursor-pointer hover:shadow-lg" : ""
            }`}
            onClick={showFlip ? handleFlip : undefined}
          >
            {showFlip && (
              <div className="bg-[#323232] rounded-xl mb-3 px-3 py-2 hover:bg-[#2a2a2a] transition-colors">
                <div className="flex justify-between items-center">
                  <p className="text-[#f0f0f0] font-poppins font-bold text-sm">
                    {isRegularProduct ? "Lihat Deskripsi" : "Kenapa Cocok?"}
                  </p>
                  <Search className="text-[#f0f0f0] w-4 h-4" />
                </div>
              </div>
            )}
            {(!showFlip || isUnavailable) && <div className="h-8" />}

            <Image
              src={product.images[0]}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-72 object-cover rounded-xl"
            />

            {product.total_compatibility_score && (
              <span className="absolute bottom-4 left-4 bg-[#323232] bg-opacity-70 text-[#f0f0f0] px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                {isRegularProduct
                  ? "Produk Populer"
                  : `${
                      product.total_compatibility_score?.toFixed(0) || 0
                    }% Match`}
              </span>
            )}
            <span className="absolute bottom-4 right-4 bg-[#f0f0f0] text-[#323232] px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              {product.average_rating}
            </span>
          </div>

          <div className="p-3 sm:p-5 flex flex-col flex-grow border-t border-gray-200">
            <div className="flex items-start justify-between gap-2 mb-2">
              {sortedProducts.findIndex((p) => p.id === product.id) < 3 &&
                product.total_compatibility_score &&
                !isRegularProduct && (
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
                    <span className="text-xs sm:text-sm text-gray-600">
                      Ukuran
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-right">
                      {product.size_range}
                    </span>
                  </div>
                </div>
              </>
            )}

            {isUnavailable ? (
              <div className="flex-1 mt-4 bg-[#323232] bg-[url('/card-bg.webp')] bg-cover bg-center rounded-2xl flex items-center justify-center gap-4">
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
                onClick={handleBuyClick}
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
        </>
      ) : (
        /* Back Side */
        <div
          className="bg-[url('/card-bg.webp')] bg-cover bg-center bg-[#323232] rounded-2xl overflow-hidden flex flex-col cursor-pointer min-h-[550px]"
          onClick={handleFlip}
        >
          <div className="p-3 sm:p-5 flex flex-col h-full">
            <div className="bg-gradient-to-r from-[#FF7EA4] to-[#FFA2BD] px-3 py-2 rounded-xl flex justify-between mb-3">
              <p className="text-[#f0f0f0] font-poppins font-bold text-sm">
                {isRegularProduct ? "Deskripsi Produk" : "Kenapa Cocok?"}
              </p>
              <svg
                width="20"
                height="20"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
              >
                <path
                  d="M16.25 13H15.5C15.1458 13 14.8492 13.12 14.61 13.36C14.3708 13.6 14.2508 13.8967 14.25 14.25C14.2492 14.6033 14.3692 14.9004 14.61 15.1413C14.8508 15.3821 15.1475 15.5017 15.5 15.5H19.25C19.6042 15.5 19.9013 15.38 20.1413 15.14C20.3813 14.9 20.5008 14.6033 20.5 14.25V10.5C20.5 10.1458 20.38 9.84917 20.14 9.61C19.9 9.37083 19.6033 9.25083 19.25 9.25C18.8967 9.24917 18.6 9.36917 18.36 9.61C18.12 9.85083 18 10.1475 18 10.5V11.1875C17.3333 10.3958 16.5367 9.77083 15.61 9.3125C14.6833 8.85417 13.6675 8.625 12.5625 8.625C10.8333 8.625 9.33834 9.14083 8.0775 10.1725C6.81667 11.2042 6.01 12.5008 5.6575 14.0625C5.57417 14.4375 5.64709 14.7708 5.87625 15.0625C6.10542 15.3542 6.39667 15.5 6.75 15.5C7.10333 15.5 7.41083 15.37 7.6725 15.11C7.93417 14.85 8.11625 14.5425 8.21875 14.1875C8.51042 13.2917 9.05209 12.5575 9.84375 11.985C10.6354 11.4125 11.5417 11.1258 12.5625 11.125C13.3125 11.125 14.0104 11.2971 14.6563 11.6413C15.3021 11.9854 15.8333 12.4383 16.25 13ZM13 25.5C11.2708 25.5 9.64584 25.1717 8.125 24.515C6.60417 23.8583 5.28125 22.9679 4.15625 21.8438C3.03125 20.7196 2.14084 19.3967 1.485 17.875C0.829168 16.3533 0.500835 14.7283 0.500002 13C0.499168 11.2717 0.827502 9.64667 1.485 8.125C2.1425 6.60333 3.03292 5.28042 4.15625 4.15625C5.27958 3.03208 6.6025 2.14167 8.125 1.485C9.6475 0.828333 11.2725 0.5 13 0.5C14.7275 0.5 16.3525 0.828333 17.875 1.485C19.3975 2.14167 20.7204 3.03208 21.8438 4.15625C22.9671 5.28042 23.8579 6.60333 24.5163 8.125C25.1746 9.64667 25.5025 11.2717 25.5 13C25.4975 14.7283 25.1692 16.3533 24.515 17.875C23.8608 19.3967 22.9704 20.7196 21.8438 21.8438C20.7171 22.9679 19.3942 23.8587 17.875 24.5162C16.3558 25.1737 14.7308 25.5017 13 25.5Z"
                  fill="#F0F0F0"
                />
              </svg>
            </div>

            <hr className="border-[#f0f0f0] my-3" />

            <div className="flex-1">
              <p className="text-[#f0f0f0] text-start text-sm font-poppins leading-relaxed">
                {isRegularProduct
                  ? product.description && product.description !== "null"
                    ? product.description
                    : "Produk populer dari Tiebymin yang banyak diminati pelanggan kami."
                  : product.compatibility_reason ||
                    "Produk ini cocok untuk Anda berdasarkan analisis AI kami."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCardMobile;
