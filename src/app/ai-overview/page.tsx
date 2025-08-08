"use client";

import { useState } from "react";
import { Navbar } from "@/components/component-landing/navbar";
import Image from "next/image";

import ShapeSection from "./sections/ShapeSection";
import ColorToneSection from "./sections/ColorToneSection";
import BodySection from "./sections/BodySection";
import CelebrityMatchSection from "./sections/CelebrityMatchSection";
import TipsSection from "./sections/TipsSection";

const analysisTabs = [
  { id: 'shape', text: 'Shape', icon: '/overview-ai/icons/ri_shape-fill.svg' },
  { id: 'color', text: 'Color Tone', icon: '/overview-ai/icons/mdi_color.svg' },
  { id: 'body', text: 'Body', icon: '/overview-ai/icons/healthicons_body.svg' },
  { id: 'celebrity', text: 'Celebrity Match', icon: '/overview-ai/icons/material-symbols_crown-rounded.svg' },
  { id: 'tips', text: 'Tips & Trick', icon: '/overview-ai/icons/ic_baseline-tips-and-updates.svg' },
];

const hijabProducts = [
  {
      id: 1,
      image: "/overview-ai/model-hijab.png",
      match: "67% Match",
      matchIcon: "/overview-ai/icons/ai-generate.svg",
      matchAlt: "Heart",
      star: 4.6,
      starIcon: "/overview-ai/icons/material-symbols_star-rounded.svg",
      title: "Hijab Segi Empat Premium",
      price: "Rp49.000",
      oldPrice: "Rp99.000",
      heartIcon: "/overview-ai/icons/mdi_heart.svg",
      heartAlt: "Heart",
      reviews: 432,
      colorRecommendations: [
          { color: "bg-purple-600", border: "border-2 border-gray-300" },
          { color: "bg-blue-900" },
          { color: "bg-gray-800" },
      ],
      size: "XS-XXL",
      reason: "Perfect untuk bentuk wajah kotak dengan warna cool undertone",
  },
  {
      id: 2,
      image: "/overview-ai/model-hijab.png",
      match: "67% Match",
      matchIcon: "/overview-ai/icons/ai-generate.svg",
      matchAlt: "Heart",
      star: 4.6,
      starIcon: "/overview-ai/icons/material-symbols_star-rounded.svg",
      title: "Hijab Segi Empat Premium",
      price: "Rp49.000",
      oldPrice: "Rp99.000",
      heartIcon: "/overview-ai/icons/mdi_heart.svg",
      heartAlt: "Heart",
      reviews: 432,
      colorRecommendations: [
          { color: "bg-blue-900", border: "border-2 border-gray-300" },
          { color: "bg-purple-600" },
          { color: "bg-gray-800" },
      ],
      size: "XS-XXL",
      reason: "Perfect untuk bentuk wajah kotak dengan warna cool undertone",
  },
  {
      id: 3,
      image: "/overview-ai/model-hijab.png",
      match: "67% Match",
      matchIcon: "/overview-ai/icons/ai-generate.svg",
      matchAlt: "Heart",
      star: 4.6,
      starIcon: "/overview-ai/icons/material-symbols_star-rounded.svg",
      title: "Hijab Segi Empat Premium",
      price: "Rp49.000",
      oldPrice: "Rp99.000",
      heartIcon: "/overview-ai/icons/mdi_heart.svg",
      heartAlt: "Heart",
      reviews: 432,
      colorRecommendations: [
          { color: "bg-teal-600", border: "border-2 border-gray-300" },
          { color: "bg-blue-900" },
          { color: "bg-gray-800" },
      ],
      size: "XS-XXL",
      reason: "Perfect untuk bentuk wajah kotak dengan warna cool undertone",
  },
];

export default function BeautyAnalysisPage() {
  const [activeTab, setActiveTab] = useState('shape');

  const renderContent = () => {
    switch (activeTab) {
      case 'shape':
        return <ShapeSection />;
      case 'color':
        return <ColorToneSection />;
      case 'body':
        return <BodySection />;
      case 'celebrity':
        return <CelebrityMatchSection />;
      case 'tips':
        return <TipsSection />;
      default:
        return <ShapeSection />; 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 bg-[url('/bg-pattern.png')] bg-repeat">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row justify-between w-full gap-8 mb-16">
          {/* Left Side - Analysis Result Card */}
          <div className="bg-[#2D2D2D] w-full lg:w-[35%] rounded-3xl p-6 sm:p-8 text-white flex flex-col">
            <div className="mb-6">
              <Image
                src="/overview-ai/person.png"
                alt="Analysis Result"
                width={300}
                height={200}
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
            <h2 className="text-3xl font-bold mb-4 font-handlee text-[#F8B4C4]">
              Hi Yasmin, Ini Dia<br />
              Hasil Analisa Kamu
            </h2>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.
            </p>
            <div className="mt-auto flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-sm text-[#2D2D2D] px-4 py-2 rounded-full flex items-center justify-center gap-1 not-last:transition hover:bg-gray-200">
                <Image src="/overview-ai/icons/material-symbols_share.svg" width={18} height={18} alt="Bagikan Hasil" />
                <span>Bagikan Hasil</span>
              </button>
              <button className="bg-[#F8B4C4] text-sm text-black px-4 py-2 rounded-full flex items-center justify-center gap-1 transition hover:bg-pink-300">
                <Image src="/overview-ai/icons/ic_round-download.svg" width={18} height={18} alt="Download Analisa" />
                <span>Download Analisa</span>
              </button>
            </div>
          </div>

          {/* Right Side - Dynamic Content Area */}
          <div className="w-full lg:w-[70%]">
            {/* Tab Navigation */}
            <div className="flex flex-wrap border-b border-gray-300">
              {analysisTabs.map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition-all -mb-px ${
                    activeTab === tab.id 
                    ? 'border-b-2 border-black text-black font-semibold' 
                    : 'text-gray-500 hover:text-black'
                  }`}
                >
                  <Image src={tab.icon || "/placeholder.svg"} width={20} height={20} alt={tab.text} className={`${activeTab !== tab.id && 'opacity-60'}`} />
                  <span>{tab.text}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Content Rendered Here */}
            <div className="mt-6">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Product Recommendations Section */}
        <section>
          <h1 className="text-4xl lg:text-5xl font-oswald font-bold text-[#333333] mb-10">
            Rekomendasi Produk
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {hijabProducts.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="relative p-2">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="w-full h-72 object-cover rounded-xl"
                  />
                  <span className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                    <Image src={product.matchIcon || "/placeholder.svg"} width={14} height={14} alt="Match" className="object-cover" />
                    {product.match}
                  </span>
                  <span className="absolute bottom-4 right-4 bg-white text-black px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <Image src={product.starIcon || "/placeholder.svg"} width={16} height={16} alt="Star"  className="object-cover" />
                    {product.star}
                  </span>
                </div>
                 <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-800 text-lg">{product.title}</h3>
                    <div className="flex items-baseline my-2">
                        <span className="text-gray-800 font-extrabold text-2xl">{product.price}</span>
                        <span className="text-gray-400 text-sm ml-2 line-through">{product.oldPrice}</span>
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
                    <div className="border border-gray-200 p-3 rounded-lg my-3">
                        <p className="text-sm">
                            <span className="text-gray-900 font-bold">Kenapa Cocok:</span>
                            <span className="text-gray-600"> {product.reason}</span>
                        </p>
                    </div>
                    <button className="mt-auto bg-[#ED80A7] w-full py-3 px-4 font-bold rounded-lg text-white flex items-center justify-center gap-3 text-base hover:bg-pink-500 transition-colors">
                        Beli Sekarang
                        <Image src="/overview-ai/icons/mynaui_cart-solid.svg" width={20} height={20} alt="Shopping Cart" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}