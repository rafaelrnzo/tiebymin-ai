import Image from 'next/image'
import React from 'react'

const BODY_TYPES = [
  {
    id: "diamond",
    name: "Diamond",
    img: "/body-select/diamond.png",
    desc: "Diamond body type memiliki bahu yang lebih sempit dari pinggul, dengan pinggang yang kurang tegas.",
  },
  {
    id: "pear",
    name: "Pear",
    img: "/body-select/pear.png",
    desc: "Pear body type memiliki pinggul yang lebih lebar dari bahu, dengan pinggang yang jelas. Bagian atas tubuh biasanya lebih kecil.",
  },
  {
    id: "hourglass",
    name: "Hourglass",
    img: "/body-select/hourglass.png",
    desc: "Hourglass body type memiliki bahu dan pinggul yang seimbang dengan pinggang yang tegas.",
  },
  {
    id: "triangle",
    name: "Triangle",
    img: "/body-select/triangle.png",
    desc: "Triangle body type memiliki bahu yang lebih lebar dari pinggul.",
  },
  {
    id: "square",
    name: "Square",
    img: "/body-select/square.png",
    desc: "Square body type memiliki bahu, pinggang, dan pinggul yang hampir sama lebar.",
  },
  {
    id: "oval",
    name: "Oval",
    img: "/body-select/oval.png",
    desc: "Oval body type memiliki bagian tengah tubuh yang lebih lebar dari bahu dan pinggul.",
  },
];

// Sementara default ke pear, nanti bisa diganti dinamis
const DEFAULT_BODY_TYPE_ID = "pear";

const BodySection = ({ bodyTypeId = DEFAULT_BODY_TYPE_ID }) => {
  // Cari body type yang sesuai, fallback ke pear
  const selectedBodyType = BODY_TYPES.find(bt => bt.id === bodyTypeId) || BODY_TYPES[1];

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      <div className="border-[1px] border-neutral-600 rounded-2xl p-4 sm:p-6">
        <h3 className="font-bold text-5xl font-oswald">{selectedBodyType.name}</h3>
        <div className="flex justify-center my-6">
          <Image
            src={selectedBodyType.img}
            alt={`${selectedBodyType.name} body type`}
            width={100}
            height={220}
            className="w-[100px] h-[220px] object-contain"
            priority
          />
        </div>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-4">
          {selectedBodyType.desc}
        </p>
        {/* Preview gambar-gambar body type lain */}
        <div className="flex gap-2 justify-center mt-6">
          {BODY_TYPES.map((bt) => (
            <button
              key={bt.id}
              type="button"
              className={`rounded-lg p-1 border transition-all ${
                bt.id === selectedBodyType.id
                  ? "border-[#EF789B] bg-[#FCE9EC]"
                  : "border-transparent hover:border-gray-300"
              }`}
              // Nanti bisa diaktifkan: onClick={() => setBodyTypeId(bt.id)}
              tabIndex={-1}
              aria-label={bt.name}
            >
              <Image
                src={bt.img}
                alt={bt.name}
                width={36}
                height={80}
                className="w-9 h-16 object-contain"
                style={{ opacity: bt.id === selectedBodyType.id ? 1 : 0.5 }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="border-[1px] border-neutral-600 rounded-2xl p-4 sm:p-6 space-y-8 flex flex-col items-center">
        <h3 className="font-bold text-5xl text-center font-oswald">BMI Analyst</h3>
        <hr className="w-full" />
        <div className="p-6 rounded-full border border-[#323232] w-fit bg-transparent flex items-center justify-center">
          <p className="text-3xl font-bold">22.4</p>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-center">
          BMI kamu berada di kisaran normal. Jaga pola makan dan aktivitas fisik untuk kesehatan optimal.
        </p>
      </div>
    </div>
  )
}

export default BodySection