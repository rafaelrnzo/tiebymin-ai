import { Sparkles } from "lucide-react";
import Image from "next/image";

const products = [
  {
    imageSrc: "/hijab-1.png",
    matchPercentage: 87,
    name: "Fay Hijab Sporty",
    price: 35000,
    originalPrice: 129000,
    rating: 4.8,
    reviewCount: 1837,
    colors: ["#6B7280", "#374151"],
    sizes: "XS-XXL",
    reason: "Perfect untuk bentuk wajah kotak dengan warna cool undertone.",
    isBestMatch: true, // Ini akan menjadi kartu yang terpilih
  },
  {
    imageSrc: "/hijab-2.png",
    matchPercentage: 75,
    name: "Alana Bergo Jersey",
    price: 44900,
    originalPrice: 129000,
    rating: 5.0,
    reviewCount: 21955,
    colors: ["#F472B6", "#60A5FA"],
    sizes: "XS-XXL",
    reason:
      "Karena warna kulit kamu Cool Winter. Warna ini cocok banget pasti.",
    isBestMatch: false,
  },
  {
    imageSrc: "/hijab-3.png",
    matchPercentage: 72,
    name: "Tyana Bergo Oval Syari",
    price: 45000,
    originalPrice: 129000,
    rating: 4.6,
    reviewCount: 1442,
    colors: ["#374151", "#9CA3AF"],
    sizes: "XS-XXL",
    reason: "Cocok untuk membuat bentuk wajah kamu jadi lebih proposional.",
    isBestMatch: false,
  },
];

export const ThirdSection = () => {
  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center lg:flex-row lg:text-start justify-between mb-10">
          <div>
            <p className="text-[16px] text-[#EC7498] font-semibold">
              Apa Kata Orang Lain Tentang Tiebymin AI
            </p>
            <h2 className="font-serif text-[30px] lg:text-[46px] font-bold text-gray-900 mt-2">
              Apa Yang Membuat <br /> Analisis Kami Berbeda
            </h2>
          </div>
          <div className="flex items-center">
            <p className="text-gray-600 text-[16px] lg:text-[24px]">
              Tiebymin AI dibuat untuk merekomendasikan <br /> gaya berpakaian,
              yang menyesuaikan dengan data <br /> personal pengguna.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className={`
                rounded-4xl overflow-hidden transition-all duration-300 p-2
                ${
                  product.isBestMatch
                    ? "bg-[#FFE5ED] border-2 border-[#EF789B]"
                    : "bg-[#FFF6F8] border-2 border-transparent"
                }
              `}
            >
              <div className="relative m-4">
                <Image
                  src={product.imageSrc}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-auto object-cover rounded-xl"
                />
                <div className="absolute top-3 left-3 bg-[#EF789B] text-white text-xs font-bold px-3 py-2 rounded-full">
                  {product.matchPercentage}% Match
                </div>
              </div>

              {/* Detail Produk */}
              <div className="p-2 pt-4 flex flex-col">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#EF789B]" />
                  {product.name}
                </h3>

                <div className="flex justify-between items-center mt-4 text-xs">
                  <div>
                    <p className="font-semibold text-gray-500 text-[16px]">
                      Rekomendasi Warna:
                    </p>
                    <div className="flex space-x-1 mt-1">
                      {product.colors.map((color, i) => (
                        <div
                          key={i}
                          className="h-6 w-6 rounded-md"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 text-[16px]">
                      Ukuran Tersedia:
                    </p>
                    <p className="font-bold text-gray-800 text-[20px] text-end">
                      {product.sizes}
                    </p>
                  </div>
                </div>

                {/* Box "Kenapa Cocok" */}
                <div className="mt-4 bg-[#fccfdd] text-gray-700 p-3 rounded-lg text-sm border-l-8 border-l-[#EF789B]">
                  <strong className="font-bold text-[#EF789B]">
                    Kenapa cocok:
                  </strong>
                  <span className="text-[#EF789B]">{product.reason}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
