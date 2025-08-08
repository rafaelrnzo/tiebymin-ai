
"use client";
import { Navbar } from "@/components/component-landing/navbar";
import Image from "next/image";

// Ganti semua import Image dari next/image menjadi img bawaan HTML
// Karena next/image tidak support path public ("/icons/xxx.svg") di dev mode tanpa config khusus
// dan untuk SVG kecil lebih baik pakai <img> biasa

const hijabProducts = [
  {
    id: 1,
    image: "/rekomendasi-produk/hijab-navy.png",
    match: "88% Match",
    matchIcon: "/icons/ai-match.svg",
    star: 4.6,
    starIcon: "/icons/star.svg",
    title: "Hijab Segi Empat Premium",
    price: "Rp49,000",
    oldPrice: "Rp129,000",
    colorRecommendations: [
      { color: "bg-[#E0E0E0]", border: "border border-gray-300" },
      { color: "bg-[#E0E0E0]", border: "border border-gray-300" },
      { color: "bg-[#E0E0E0]", border: "border border-gray-300" },
      { color: "bg-[#E0E0E0]", border: "border border-gray-300" },
      { color: "bg-[#E0E0E0]", border: "border border-gray-300" },
    ],
    size: "XS-XXL",
    reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
  },
  {
    id: 2,
    image: "/rekomendasi-produk/hijab-navy.png",
    match: "88% Match",
    matchIcon: "/icons/ai-match.svg",
    star: 4.6,
    starIcon: "/icons/star.svg",
    title: "Hijab Segi Empat Premium",
    price: "Rp49,000",
    oldPrice: "Rp129,000",
    colorRecommendations: [
      { color: "bg-[#E0E0E0]", border: "border border-gray-300" },
      { color: "bg-[#E0E0E0]", border: "border border-gray-300" },
      { color: "bg-[#E0E0E0]", border: "border border-gray-300" },
      { color: "bg-[#E0E0E0]", border: "border border-gray-300" },
      { color: "bg-[#E0E0E0]", border: "border border-gray-300" },
    ],
    size: "XS-XXL",
    reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
  },
  {
    id: 3,
    image: "/rekomendasi-produk/hijab-navy.png",
    match: "88% Match",
    matchIcon: "/icons/ai-match.svg",
    star: 4.6,
    starIcon: "/icons/star.svg",
    title: "Hijab Segi Empat Premium",
    price: "Rp49,000",
    oldPrice: "Rp129,000",
    colorRecommendations: [
      { color: "bg-[#E0E0E0]", border: "border border-gray-300" },
      { color: "bg-[#E0E0E0]", border: "border border-gray-300" },
      { color: "bg-[#E0E0E0]", border: "border border-gray-300" },
      { color: "bg-[#E0E0E0]", border: "border border-gray-300" },
      { color: "bg-[#E0E0E0]", border: "border border-gray-300" },
    ],
    size: "XS-XXL",
    reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
  },
];

const analysisTabs = [
  { id: "shape", text: "Shape", icon: "/icons/shape.svg" },
  { id: "color", text: "Color Tone", icon: "/icons/color-tone.svg" },
  { id: "body", text: "Body", icon: "/icons/body.svg" },
  { id: "celebrity", text: "Celebrity Match", icon: "/icons/crown.svg", active: true },
  { id: "tips", text: "Tips & Trick", icon: "/icons/tips.svg" },
];

export default function BeautyAnalysisPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-10 md:py-18">
        <div className="flex flex-col lg:flex-row justify-between w-full gap-8 mb-12">
          {/* Left Side - Analysis Result */}
          <div className="bg-[#323232] w-full lg:w-[35%] rounded-3xl p-6 sm:p-8 text-white mb-8 lg:mb-0">
            <div className="mb-6">
              <Image
                src="/overview-ai/person.png"
                alt="Analysis Result"
                className="w-full h-40 sm:h-48 object-cover rounded-2xl mb-6"
                width={400}
                height={192}
                priority
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight font-handlee text-[#FFC6C6]">
              Hi Yasmin, Ini Dia<br />
              Hasil Analisa Kamu
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="bg-white text-[14px] text-[#323232] px-4 py-3 rounded-full text-sm flex items-center gap-2 transition-colors duration-200 hover:bg-gray-200 hover:text-[#323232] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FFC6C6]">
                <Image src="/overview-ai/icons/material-symbols_share.svg" width={16} height={16} alt="bagikan hasil" />
                <span>
                  Bagikan Hasil
                </span>
              </button>
              <button className="bg-[#FFC6C6] text-black px-4 py-3 rounded-full text-sm flex items-center gap-2 transition-colors duration-200 hover:bg-[#ffb3b3] hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FFC6C6]">
                <Image src="/overview-ai/icons/ic_round-download.svg" width={16} height={16} alt="Download Analisa" />
                <span>Download Analisa</span>
              </button>
            </div>
          </div>

          {/* Right Side - Celebrity Match */}
          <div className="w-full lg:w-[65%]">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {analysisTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 text-gray-500 text-sm flex items-center gap-2 ${
                    tab.active
                      ? "border-b-2 border-[#323232] text-[#323232] font-bold"
                      : "hover:text-[#323232]"
                  }`}
                >
                  <Image src={tab.icon} width={16} height={16} alt={tab.text} className={!tab.active ? "opacity-60" : ""} />
                  <span>{tab.text}</span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-6 w-full md:w-2/5">
                <div className="bg-white rounded-2xl p-4 sm:p-6">
                  <p className="font-handlee text-[#ED80A7] text-lg mb-1">Kamu mirip</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">Siren Sungkar</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mt-3 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
                <div className="bg-pink-200 rounded-2xl p-4 sm:p-6">
                  <h4 className="font-bold text-gray-800 text-md mb-2">Kenapa cocok?</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
              </div>
              <div className="relative w-full md:w-3/5">
                <Image
                  src="/dewisandra.png"
                  alt="Siren Sungkar"
                  width={500}
                  height={700}
                  className="w-full h-full object-cover rounded-2xl"
                  priority
                />
                <span className="absolute bottom-4 left-4 bg-[#323232] text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                  <Image src="/overview-ai/icons/ai-match.svg" width={16} height={16} alt="Match Icon" />
                  88% Match
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Recommendations */}
        <section>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-oswald font-bold text-[#333333] text-center lg:text-left">
            Rekomendasi Produk
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-8">
            {hijabProducts.map((product, idx) => (
              <div key={product.id} className="border-1 rounded-2xl overflow-hidden shadow-sm">
                <div className="relative p-2 sm:p-4 rounded-lg overflow-hidden">
                  <Image
                    src={product.image}
                    alt="Hijab Product"
                    className="w-full h-44 sm:h-64 object-cover rounded-md"
                    width={400}
                    height={256}
                  />
                  <span className="absolute bottom-5 sm:bottom-7 left-4 sm:left-6 bg-[#323232] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2">
                    <Image src={product.matchIcon} width={20} height={20} alt="Match" />
                    {product.match}
                  </span>
                  <span className="absolute bottom-5 sm:bottom-7 right-24 sm:right-32 text-[#323232] bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2">
                    <Image src={product.starIcon} width={20} height={20} alt="Star" />
                    {product.star}
                  </span>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center mb-2">
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg">{product.title}</h3>
                  </div>
                  <div className="flex items-center mb-3">
                    <span className="text-gray-800 font-extrabold text-xl sm:text-2xl">{product.price}</span>
                    <span className="text-gray-400 text-xs sm:text-sm ml-2 line-through">{product.oldPrice}</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                      <div className="flex flex-col items-start">
                        <p className="text-xs sm:text-sm text-gray-600 mr-2">Rekomendasi Warna:</p>
                        <div className="flex space-x-2 mt-2">
                          {product.colorRecommendations.map((color, i) => (
                            <div
                              key={i}
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${color.color} ${color.border ? color.border : ""}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-xs sm:text-sm text-gray-600 mr-1">Ukuran:</span>
                        <span className="text-xs sm:text-sm font-medium mt-2">{product.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-1 p-2 sm:p-3 rounded-lg">
                    <p className="text-xs sm:text-sm flex flex-col">
                      <span className="text-gray-900 font-bold">Kenapa Cocok:</span>
                      <span className="text-gray-600"> {product.reason}</span>
                    </p>
                  </div>
                  <div className="bg-pink-400 mt-4 py-2 sm:py-3 px-3 sm:px-4 font-bold rounded-2xl text-white flex items-center justify-between text-sm sm:text-base">
                    Beli Sekarang
                    <Image src="/overview-ai/icons/mynaui_cart-solid.svg" width={20} height={20} alt="Star" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ED80A7]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-gray-800"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-gray-800"></div>
          </div>
        </section>
      </main>
    </div>
  );
}
