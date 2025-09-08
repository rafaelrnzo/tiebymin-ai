"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ThumbsUp, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Product } from "@/types";

const flipStyles = `
  .product-flip-container {
    perspective: 1000px;
  }
  .product-flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s ease-in-out;
    transform-style: preserve-3d;
  }
  .product-flip-front,
  .product-flip-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .product-flip-back {
    transform: rotateY(180deg);
  }
  .product-flip-inner.flipped {
    transform: rotateY(180deg);
  }
`;

if (typeof document !== "undefined") {
  const existingStyle = document.getElementById("product-flip-styles");
  if (!existingStyle) {
    const style = document.createElement("style");
    style.id = "product-flip-styles";
    style.textContent = flipStyles;
    document.head.appendChild(style);
  }
}

interface ProductCardDesktopProps {
  product: Product;
  topProductScores: Map<string, number>;
  sortedProducts: Product[];
}

const ProductCardDesktop: React.FC<ProductCardDesktopProps> = ({
  product,
  topProductScores,
  sortedProducts,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const isUnavailable =
    product.description === "null" ||
    !product.description ||
    product.stock_quantity === 0;

  const unavailableText =
    product.stock_quantity === 0 ? "Coming Soon" : "Segera Hadir";

  const handleFlip = () => {
    // Hanya izinkan flip jika produk tersedia
    if (!isUnavailable) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className="product-flip-container h-[630px] w-full">
      <div className={`product-flip-inner ${isFlipped ? "flipped" : ""}`}>
        <div className="product-flip-front border rounded-2xl overflow-hidden flex flex-col transition-shadow duration-300 w-full border-[#323232]">
          <div className="relative p-2 px-4">
            {!isUnavailable && (
              <div
                className="flex justify-between bg-[#323232] rounded-xl mt-2 mb-4 px-4 py-2 cursor-pointer hover:bg-[#2a2a2a] transition-colors"
                onClick={handleFlip}
              >
                <p className="text-[#f0f0f0] font-poppins font-bold text-xl">
                  Kenapa cocok untuk kamu?
                </p>
                <Search className="text-[#f0f0f0]" />
              </div>
            )}
            {isUnavailable && <div className="pt-4" />}

            <Image
              src={product.images[0]}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-72 object-cover rounded-xl"
            />
            <span className="absolute bottom-4 left-6 bg-[#323232] bg-opacity-70 text-[#f0f0f0] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
              {topProductScores.has(product.id)
                ? `${topProductScores.get(product.id)}% Match`
                : `${product.total_compatibility_score.toFixed(0)}% Match`}
            </span>
            <span className="absolute bottom-4 right-6 bg-[#f0f0f0] text-[#323232] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              {product.average_rating}
            </span>
          </div>

          <div className="p-5 flex flex-col flex-grow">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-[#323232] text-lg text-left">
                {product.name}
              </h3>
              {sortedProducts.findIndex((p) => p.id === product.id) < 3 && (
                <div className="flex items-center gap-1 text-pink-500 flex-shrink-0">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="font-semibold text-xs">Rekomendasi</span>
                </div>
              )}
            </div>

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
              <>
                <div className="flex items-baseline my-2">
                  <span className="text-[#323232] font-extrabold text-2xl">
                    {`Rp${product.current_price.toLocaleString("id-ID")}`}
                  </span>
                  {product.original_price > product.current_price && (
                    <span className="text-[#323232]/50 text-sm ml-2 line-through">
                      {`Rp${product.original_price.toLocaleString("id-ID")}`}
                    </span>
                  )}
                </div>
                <div className="flex items-start justify-between gap-4 my-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs sm:text-sm text-[#323232] font-poppins">
                      Rekomendasi Warna
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.color_recommendations
                        ?.slice(0, 5)
                        .map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className="text-xs sm:text-sm text-[#323232] font-poppins">
                      Ukuran
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#323232]/70 font-poppins">
                      {product.size_range}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => window.open(product.product_link, "_blank")}
                  className="shadow-md flex justify-between mt-auto bg-[#ED80A7] w-full px-7 py-5 font-bold rounded-lg text-[#f0f0f0] items-center gap-3 text-base hover:bg-pink-500 transition-colors"
                >
                  <span>Beli Sekarang</span>
                  <Image
                    src="/overview-ai/icons/mynaui_cart-solid.svg"
                    width={20}
                    height={20}
                    alt="Shopping Cart"
                    className="w-5 h-5"
                  />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Back of card */}
        <div className="product-flip-back bg-[url('/card-bg.webp')] bg-cover bg-center bg-[#323232] rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 flex flex-col h-full">
            <div
              className="bg-gradient-to-r from-[#FF7EA4] to-[#FFA2BD] px-4 py-2 rounded-xl flex justify-between mb-6 cursor-pointer"
              onClick={handleFlip}
            >
              <p className="text-[#f0f0f0] font-poppins font-bold text-xl">
                Katalog Produk
              </p>
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.25 13H15.5C15.1458 13 14.8492 13.12 14.61 13.36C14.3708 13.6 14.2508 13.8967 14.25 14.25C14.2492 14.6033 14.3692 14.9004 14.61 15.1413C14.8508 15.3821 15.1475 15.5017 15.5 15.5H19.25C19.6042 15.5 19.9013 15.38 20.1413 15.14C20.3813 14.9 20.5008 14.6033 20.5 14.25V10.5C20.5 10.1458 20.38 9.84917 20.14 9.61C19.9 9.37083 19.6033 9.25083 19.25 9.25C18.8967 9.24917 18.6 9.36917 18.36 9.61C18.12 9.85083 18 10.1475 18 10.5V11.1875C17.3333 10.3958 16.5367 9.77083 15.61 9.3125C14.6833 8.85417 13.6675 8.625 12.5625 8.625C10.8333 8.625 9.33834 9.14083 8.0775 10.1725C6.81667 11.2042 6.01 12.5008 5.6575 14.0625C5.57417 14.4375 5.64709 14.7708 5.87625 15.0625C6.10542 15.3542 6.39667 15.5 6.75 15.5C7.10333 15.5 7.41083 15.37 7.6725 15.11C7.93417 14.85 8.11625 14.5425 8.21875 14.1875C8.51042 13.2917 9.05209 12.5575 9.84375 11.985C10.6354 11.4125 11.5417 11.1258 12.5625 11.125C13.3125 11.125 14.0104 11.2971 14.6563 11.6413C15.3021 11.9854 15.8333 12.4383 16.25 13ZM13 25.5C11.2708 25.5 9.64584 25.1717 8.125 24.515C6.60417 23.8583 5.28125 22.9679 4.15625 21.8438C3.03125 20.7196 2.14084 19.3967 1.485 17.875C0.829168 16.3533 0.500835 14.7283 0.500002 13C0.499168 11.2717 0.827502 9.64667 1.485 8.125C2.1425 6.60333 3.03292 5.28042 4.15625 4.15625C5.27958 3.03208 6.6025 2.14167 8.125 1.485C9.6475 0.828333 11.2725 0.5 13 0.5C14.7275 0.5 16.3525 0.828333 17.875 1.485C19.3975 2.14167 20.7204 3.03208 21.8438 4.15625C22.9671 5.28042 23.8579 6.60333 24.5163 8.125C25.1746 9.64667 25.5025 11.2717 25.5 13C25.4975 14.7283 25.1692 16.3533 24.515 17.875C23.8608 19.3967 22.9704 20.7196 21.8438 21.8438C20.7171 22.9679 19.3942 23.8587 17.875 24.5162C16.3558 25.1737 14.7308 25.5017 13 25.5Z"
                  fill="#F0F0F0"
                />
              </svg>
            </div>
            <hr className="text-[#f0f0f0] mb-[50px] mt-[35px]" />
            <div className="flex gap-4 mb-[25px]">
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.38461 4.81C10.1321 2.6225 13.1546 2.55625 14.0409 4.61125L14.1159 4.81125L15.1246 7.76125C15.3558 8.43779 15.7294 9.05689 16.2201 9.57678C16.7109 10.0967 17.3075 10.5053 17.9696 10.775L18.2409 10.8762L21.1909 11.8838C23.3784 12.6313 23.4446 15.6537 21.3909 16.54L21.1909 16.615L18.2409 17.6238C17.5641 17.8548 16.9447 18.2283 16.4246 18.7191C15.9045 19.2099 15.4957 19.8065 15.2259 20.4688L15.1246 20.7388L14.1171 23.69C13.3696 25.8775 10.3471 25.9438 9.46211 23.89L9.38461 23.69L8.37711 20.74C8.14609 20.0632 7.77258 19.4439 7.28179 18.9238C6.791 18.4037 6.19435 17.9949 5.53211 17.725L5.26211 17.6238L2.31211 16.6162C0.123363 15.8687 0.057113 12.8462 2.11211 11.9612L2.31211 11.8838L5.26211 10.8762C5.93865 10.6451 6.55775 10.2715 7.07764 9.78071C7.59753 9.28993 8.00613 8.69336 8.27586 8.03125L8.37711 7.76125L9.38461 4.81ZM21.7509 0.5C21.9847 0.5 22.2139 0.565598 22.4123 0.689339C22.6107 0.813081 22.7705 0.990003 22.8734 1.2L22.9334 1.34625L23.3709 2.62875L24.6546 3.06625C24.889 3.14587 25.0944 3.29327 25.2449 3.48977C25.3954 3.68627 25.4842 3.92302 25.5 4.17003C25.5158 4.41703 25.4579 4.66316 25.3336 4.87723C25.2094 5.0913 25.0244 5.26367 24.8021 5.3725L24.6546 5.4325L23.3721 5.87L22.9346 7.15375C22.8549 7.38804 22.7073 7.59337 22.5108 7.74374C22.3142 7.89411 22.0774 7.98274 21.8304 7.9984C21.5834 8.01407 21.3373 7.95606 21.1233 7.83172C20.9093 7.70739 20.7371 7.52233 20.6284 7.3L20.5684 7.15375L20.1309 5.87125L18.8471 5.43375C18.6128 5.35413 18.4073 5.20673 18.2568 5.01023C18.1063 4.81373 18.0176 4.57698 18.0018 4.32997C17.986 4.08297 18.0439 3.83684 18.1681 3.62277C18.2923 3.4087 18.4773 3.23633 18.6996 3.1275L18.8471 3.0675L20.1296 2.63L20.5671 1.34625C20.6514 1.09928 20.8109 0.884886 21.0232 0.733124C21.2354 0.581361 21.4899 0.499843 21.7509 0.5Z"
                  fill="url(#paint0_linear_2793_3393)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_2793_3393"
                    x1="25.5025"
                    y1="14.237"
                    x2="0.619141"
                    y2="14.237"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FFA2BD" />
                    <stop offset="1" stopColor="#FF7EA4" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="text-[#f0f0f0] font-poppins font-bold text-xl">
                Kenapa Cocok?
              </p>
            </div>
            <p className="text-[#f0f0f0] text-start text-lg font-poppins">
              {product.compatibility_reason}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardDesktop;
