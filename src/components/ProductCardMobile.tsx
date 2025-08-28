"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Star, ThumbsUp } from "lucide-react";
import { Button } from "./ui/button";

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

interface ProductCardMobileProps {
  product: Product;
  topProductScores: Map<string, number>;
  sortedProducts: Product[];
  isAnimating: boolean;
}

const ProductCardMobile: React.FC<ProductCardMobileProps> = ({
  product,
  topProductScores,
  sortedProducts,
  isAnimating,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={product.id}
        initial={{ opacity: 0, x: 300, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -300, scale: 0.9 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 35,
          duration: 0.4,
        }}
        className={`bg-white border rounded-2xl overflow-hidden flex flex-col transition-shadow duration-300 h-fit sm:h-[620px] w-full flex-shrink-0 mx-auto cursor-grab active:cursor-grabbing select-none border-[#323232]`}
      >
        <div className="relative p-2">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-44 sm:h-72 object-cover rounded-xl"
          />
          <span className="absolute bottom-4 left-4 bg-[#323232] bg-opacity-70 text-white px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2">
            {topProductScores.has(product.id)
              ? `${topProductScores.get(product.id)}% Match`
              : `${product.total_compatibility_score * 10}% Match`}
          </span>
          <span className="absolute bottom-4 right-4 bg-white text-[#323232] px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            {product.average_rating}
          </span>
        </div>
        <div className="p-3 sm:p-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-2">
            {sortedProducts.findIndex((p) => p.id === product.id) < 3 && (
              <div className="flex items-center gap-1 text-pink-500 flex-shrink-0">
                <ThumbsUp className="w-4 h-4" />
                <span className="font-semibold text-xs">Rekomendasi</span>
              </div>
            )}
          </div>

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
          <div className="flex flex-col border rounded-xl p-2 sm:p-4">
            <p className="text-xs sm:text-sm">Kenapa Cocok</p>
          </div>

          <Button
            onClick={() => window.open(product.product_link, "_blank")}
            className="shadow-md flex justify-between mt-3 bg-[#ED80A7] w-full px-4 sm:px-7 py-3 sm:py-5 font-bold rounded-lg text-white items-center gap-2 sm:gap-3 text-sm sm:text-base hover:bg-pink-500 transition-colors"
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductCardMobile;
