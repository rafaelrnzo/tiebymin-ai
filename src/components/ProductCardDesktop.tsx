"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ThumbsUp, Search } from "lucide-react";
import { Button } from "./ui/button";

// Add CSS for flip animation
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

// Inject styles into head
if (typeof document !== "undefined") {
  const existingStyle = document.getElementById("product-flip-styles");
  if (!existingStyle) {
    const style = document.createElement("style");
    style.id = "product-flip-styles";
    style.textContent = flipStyles;
    document.head.appendChild(style);
  }
}

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

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="product-flip-container h-[650px] w-full">
      <div className={`product-flip-inner ${isFlipped ? "flipped" : ""}`}>
        <div className="product-flip-front border rounded-2xl overflow-hidden flex flex-col transition-shadow duration-300 w-full border-[#323232]">
          <div className="relative p-2 px-4">
            <div
              className="flex justify-between bg-[#323232] rounded-xl mt-2 mb-4 px-4 py-2 cursor-pointer hover:bg-[#2a2a2a] transition-colors"
              onClick={handleFlip}
            >
              <p className="text-[#f0f0f0] font-poppins font-bold text-xl">
                Kenapa cocok untuk kamu?
              </p>
              <Search className="text-[#f0f0f0]" />
            </div>
            <Image
              src={product.images[0]}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-72 object-cover rounded-xl"
            />
            <span className="absolute bottom-4 left-6 bg-[#323232] bg-opacity-70 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
              {topProductScores.has(product.id)
                ? `${topProductScores.get(product.id)}% Match`
                : `${product.total_compatibility_score * 10}% Match`}
            </span>
            <span className="absolute bottom-4 right-6 bg-white text-[#323232] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              {product.average_rating}
            </span>
          </div>
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-gray-800 text-lg text-left truncate">
                {product.name.split(" ").slice(0, 3).join(" ")}...
              </h3>
              {sortedProducts.findIndex((p) => p.id === product.id) < 3 && (
                <div className="flex items-center gap-1 text-pink-500 flex-shrink-0">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="font-semibold text-xs">Rekomendasi</span>
                </div>
              )}
            </div>

            <div className="flex items-baseline my-2">
              <span className="text-gray-800 font-extrabold text-2xl">
                {`Rp${product.current_price.toLocaleString("id-ID")}`}
              </span>
              {product.original_price > 0 && (
                <span className="text-gray-400 text-sm ml-2 line-through">
                  {`Rp${product.original_price.toLocaleString("id-ID")}`}
                </span>
              )}
            </div>
            <div className="flex items-start justify-between gap-4 my-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs sm:text-sm text-gray-600">
                  Rekomendasi Warna
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.color_recommendations?.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Ukuran</span>
                <span className="text-xs sm:text-sm font-medium text-right">
                  {product.size_range}
                </span>
              </div>
            </div>

            <Button
              onClick={() => window.open(product.product_link, "_blank")}
              className="shadow-md flex justify-between mt-auto bg-[#ED80A7] w-full px-7 py-5 font-bold rounded-lg text-white items-center gap-3 text-base hover:bg-pink-500 transition-colors"
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
          </div>
        </div>

        {/* Back of card */}
        <div className="product-flip-back bg-[url('/card-bg.png')] bg-[#323232] rounded-2xl overflow-hidden flex flex-col">
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
              Produk ini sangat cocok untuk kamu karena analisis AI kami
              menunjukkan kesesuaian tinggi dengan bentuk wajah, warna kulit,
              dan preferensi fashion kamu. Rekomendasi ini didasarkan pada data
              analisis mendalam untuk memberikan hasil yang paling akurat dan
              personal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardDesktop;
