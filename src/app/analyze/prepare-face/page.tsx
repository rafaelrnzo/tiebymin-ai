"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BODY_TYPES = [
  {
    id: "diamond",
    name: "Diamond",
    img: "/body-select/diamond.png",
    labelClass: "text-gray-500",
    info: {
      desc: "Diamond body type memiliki bahu yang lebih sempit dari pinggul, dengan pinggang yang kurang tegas.",
      characteristics: [
        "Bahu lebih sempit dari pinggul",
        "Pinggang kurang tegas",
        "Bagian bawah tubuh lebih lebar",
      ],
    },
  },
  {
    id: "pear",
    name: "Pear",
    img: "/body-select/pear.png",
    labelClass: "text-gray-500 font-semibold",
    info: {
      desc: "Pear body type memiliki pinggul yang lebih lebar dari bahu, dengan pinggang yang jelas.",
      characteristics: [
        "Pinggul lebih lebar dari bahu",
        "Pinggang jelas",
        "Bagian atas tubuh lebih kecil",
      ],
    },
  },
  {
    id: "hourglass",
    name: "Hourglass",
    img: "/body-select/hourglass.png",
    labelClass: "text-gray-500",
    info: {
      desc: "Hourglass body type memiliki bahu dan pinggul yang seimbang dengan pinggang yang tegas.",
      characteristics: [
        "Bahu dan pinggul seimbang",
        "Pinggang tegas",
        "Proporsi tubuh seimbang",
      ],
    },
  },
  {
    id: "triangle",
    name: "Triangle",
    img: "/body-select/triangle.png",
    labelClass: "text-gray-500",
    info: {
      desc: "Triangle body type memiliki bahu yang lebih lebar dari pinggul.",
      characteristics: [
        "Bahu lebih lebar dari pinggul",
        "Pinggang kurang tegas",
        "Bagian atas tubuh lebih dominan",
      ],
    },
  },
  {
    id: "square",
    name: "Square",
    img: "/body-select/square.png",
    labelClass: "text-gray-500",
    info: {
      desc: "Square body type memiliki bahu, pinggang, dan pinggul yang hampir sama lebar.",
      characteristics: [
        "Bahu, pinggang, dan pinggul hampir sama lebar",
        "Pinggang kurang tegas",
        "Proporsi tubuh lurus",
      ],
    },
  },
  {
    id: "oval",
    name: "Oval",
    img: "/body-select/oval.png",
    labelClass: "text-gray-500",
    info: {
      desc: "Oval body type memiliki bagian tengah tubuh yang lebih lebar dari bahu dan pinggul.",
      characteristics: [
        "Bagian tengah tubuh lebih lebar",
        "Bahu dan pinggul lebih sempit",
        "Pinggang tidak tegas",
      ],
    },
  },
];

export default function BodyTypeAnalyzer() {
  const [selectedTypeId, setSelectedTypeId] = useState("pear");
  const [showOverlay, setShowOverlay] = useState(false);
  const router = useRouter();

  const bodyImageWidth = 100;
  const bodyImageHeight = 220;
  const bodyImageClass = "w-[100px] h-[220px] object-contain";

  const topRow = BODY_TYPES.slice(0, 3);
  const bottomRow = BODY_TYPES.slice(3, 6);

  const selectedType = BODY_TYPES.find((type) => type.id === selectedTypeId);

  const handleShowOverlay = () => setShowOverlay(true);
  const handleCloseOverlay = () => setShowOverlay(false);

  const handleNext = () => {
    router.push("/analyze/take-face");
  };

  return (
    <div className="min-h-screen w-full bg-[url('/login-bg.png')] bg-pink-200 px-2 sm:px-4 md:px-8 lg:px-12 py-8 md:py-16 lg:py-24 flex flex-col items-center justify-center relative">
      {/* Overlay Scan Wajah */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{
            pointerEvents: "auto",
          }}
        >
          {/* Overlay background */}
          <div
            className="absolute inset-0 bg-white bg-opacity-90"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.6) 70%, rgba(255,255,255,0.0) 100%)",
              width: "100vw",
              height: "100vh",
              zIndex: 0,
              position: "fixed",
              left: 0,
              top: 0,
            }}
            onClick={handleCloseOverlay}
          />
          {/* Modal content */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto mt-32">
              <div className="flex justify-end">
                <button
                  onClick={handleCloseOverlay}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold mb-2"
                  aria-label="Tutup"
                >
                  ×
                </button>
              </div>
              <div className="flex flex-col items-center">
                <Image
                  src="/scan-face-illustration.png"
                  alt="Scan Wajah"
                  width={120}
                  height={120}
                  className="mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Scan Wajah Kamu</h2>
                <p className="text-gray-600 text-center mb-4">
                  Fitur scan wajah akan segera tersedia! <br />
                  Nantikan update dari kami.
                </p>
                <button
                  onClick={handleCloseOverlay}
                  className="bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl px-6 py-2 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-center justify-center">
          {/* Left Column - Controls */}
          <div className="space-y-8 w-full max-w-md mx-auto flex flex-col items-center">
            <div className="mb-8 flex justify-center w-full">
              <Image
                src="/tie-by-min-logo.png"
                alt="tiebyminlogo"
                width={250}
                height={80}
                priority
                className="mx-auto"
              />
            </div>
            {/* Analisa Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center justify-between w-full max-w-xs mx-auto">
              <span className="text-gray-700 font-medium">Analisa</span>
              <span className="text-gray-700 font-bold">03</span>
            </div>

            {/* Choose Body Type Card */}
            <div className="bg-[#EF789B] rounded-2xl p-6 text-white w-full max-w-xs mx-auto">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold">Pilih Bentuk Tubuh Kamu</h2>
                <div className="w-6 h-6 rounded flex items-center justify-center">
                  <Image src="/stars.png" alt="stars" width={20} height={20} />
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                Dengan mengetahui bentuk tubuhmu, kami bisa memberikan rekomendasi pakaian yang sesuai dengan proporsi tubuhmu
              </p>
            </div>

            {/* Scan Face Button */}
            <button
              className="w-full border-gray-600/60 border-1 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center justify-between hover:bg-white/80 transition-colors max-w-xs mx-auto"
              onClick={handleShowOverlay}
            >
              <span className="text-gray-700 font-medium">Scan Wajah Kamu</span>
              <div className="w-6 h-6 rounded flex items-center justify-center">
                <div className="w-6 h-6 rounded flex items-center justify-center">
                  <Image
                    src="/stars.png"
                    alt="stars"
                    width={20}
                    height={20}
                    style={{ filter: "brightness(0) saturate(100%)" }}
                  />
                </div>
              </div>
            </button>
          </div>

          {/* Center Column - Body Types */}
          <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto px-2 md:px-0">
            <div className="flex flex-col gap-8 md:gap-12 w-full">
              {/* Top Row */}
              <div className="flex flex-row gap-4 md:gap-8 lg:gap-12 justify-center w-full">
                {topRow.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedTypeId(type.id)}
                    className="focus:outline-none"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`mb-4 flex justify-center items-center transition-all ${
                          selectedTypeId === type.id
                            ? "rounded-2xl p-4 bg-white"
                            : ""
                        }`}
                        style={
                          selectedTypeId === type.id
                            ? {
                                background:
                                  "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.6) 70%, rgba(255,255,255,0.0) 100%)",
                              }
                            : undefined
                        }
                      >
                        <Image
                          src={type.img}
                          alt={`${type.name} body type`}
                          width={bodyImageWidth}
                          height={bodyImageHeight}
                          className={bodyImageClass}
                        />
                      </div>
                      <p
                        className={`${
                          selectedTypeId === type.id
                            ? "text-gray-800 font-bold"
                            : type.labelClass
                        } text-sm text-center`}
                      >
                        {type.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              {/* Bottom Row */}
              <div className="flex flex-row gap-4 md:gap-8 lg:gap-12 justify-center w-full">
                {bottomRow.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedTypeId(type.id)}
                    className="focus:outline-none"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`mb-4 flex justify-center items-center transition-all ${
                          selectedTypeId === type.id
                            ? "rounded-2xl p-4 bg-white"
                            : ""
                        }`}
                        style={
                          selectedTypeId === type.id
                            ? {
                                background:
                                  "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.6) 70%, rgba(255,255,255,0.0) 100%)",
                              }
                            : undefined
                        }
                      >
                        <Image
                          src={type.img}
                          alt={`${type.name} body type`}
                          width={bodyImageWidth}
                          height={bodyImageHeight}
                          className={bodyImageClass}
                        />
                      </div>
                      <p
                        className={`${
                          selectedTypeId === type.id
                            ? "text-gray-800 font-bold"
                            : type.labelClass
                        } text-sm text-center`}
                      >
                        {type.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Selected Body Type Information */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl py-8 px-4 sm:px-6 w-full max-w-xs md:max-w-sm mx-auto flex flex-col justify-between items-center">
            <div className="w-full">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 font-oswald text-left">
                {selectedType?.name}
              </h2>

              {/* Small body illustration */}
              <div className="flex justify-center mb-8">
                <Image
                  src={selectedType?.img || "/body-select/pear.png"}
                  alt={`${selectedType?.name} body type`}
                  width={60}
                  height={90}
                  className="w-15 h-22 object-contain"
                />
              </div>

              <p className="text-gray-600 text-sm mb-8 leading-relaxed text-left">
                {selectedType?.info?.desc ||
                  "Pilih bentuk tubuh untuk melihat detail karakteristik."}
              </p>

              <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-3 text-left">Karakteristik</h3>
                <ul className="space-y-2 text-sm text-gray-600 text-left">
                  {selectedType?.info?.characteristics?.map((char, idx) => (
                    <li className="flex items-start" key={idx}>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {char}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              className="w-full bg-[#323232] text-center text-white rounded-xl py-3 px-6 font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-4 mt-4"
              onClick={handleNext}
            >
              <span>Selanjutnya</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}