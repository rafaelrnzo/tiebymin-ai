import {
  Crown,
  Handbag,
  Palette,
  PersonStanding,
  ShoppingCart,
  Sparkles,
  Square,
} from "lucide-react";
import Image from "next/image";
import React from "react";

interface ColorSwatchProps {
  colors: string[];
}

interface ProductCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

const ColorSwatches: React.FC<ColorSwatchProps> = ({ colors }) => (
  <div className="flex items-center gap-2">
    {colors.map((color, index) => (
      <div
        key={index}
        className="h-8 w-8 rounded-full border border-gray-200"
        style={{ backgroundColor: color }}
      />
    ))}
  </div>
);

const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  title,
  description,
}) => (
  <div className="bg-white rounded-xl p-4 flex flex-col gap-3">
    <Image
      width={200}
      height={100}
      src={imageUrl}
      alt={title}
      className="w-full h-[100px] object-cover rounded-lg"
    />
    <div className="flex items-center gap-2">
      <h4 className="font-semibold text-gray-800">{title}</h4>
      <ShoppingCart className="h-4 w-4 fill-black" />
    </div>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

const FaceShapeCard = () => (
  <div className="bg-white rounded-xl p-6 flex flex-col gap-4 border">
    <div className="flex items-center gap-2 font-semibold text-gray-700">
      <Square className="h-5 w-5" />
      <h3 className="font-handlee italic mt-1.5">Bentuk Wajah</h3>
    </div>
    <hr />
    <div>
      <p className="font-poppins">
        Bentuk wajah kotak itu kayak proporsi sempurna gitu, lho! Kamu punya
        garis rahang yang tegas dan dahi nggak terlalu lebar atau sempit.
      </p>
      Ini bikin hampir semua gaya hijab cocok banget buat kamu!
    </div>
    <div>
      <h4 className="font-bold text-gray-800">Fakta Unik:</h4>
      <p className="font-poppins">
        Hanya 5%-8% yang memiliki bentuk wajah ini.
      </p>
    </div>
  </div>
);

const ColorToneCard = () => {
  const bestColors = ["#A1B3D1", "#334D6E", "#8E3B46", "#4A444B", "#21295C"];
  const combinationColors = [
    "#FADCD9",
    "#F9F1F0",
    "#F6E4E3",
    "#F8E6E2",
    "#F7EDE1",
  ];

  return (
    <div className="bg-white rounded-xl p-6 flex flex-col gap-5 border">
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <Palette className="h-5 w-5" />
        <h3 className="font-handlee italic mt-1.5">Tona Warna</h3>
      </div>
      <hr />
      <h2 className="text-3xl font-bold text-gray-800 font-oswald">
        Deep Winter
      </h2>
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Best Color</h4>
        <ColorSwatches colors={bestColors} />
      </div>
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Color Combination</h4>
        <ColorSwatches colors={combinationColors} />
      </div>
    </div>
  );
};

const BodyShapeCard = () => (
  <div className="bg-white rounded-xl p-6 flex flex-col gap-4 border">
    <div className="flex items-center gap-2 font-semibold text-gray-700">
      <PersonStanding className="h-5 w-5" />
      <h3 className="font-handlee italic mt-1.5">Bentuk Tubuh</h3>
    </div>
    <hr />
    <div className="flex gap-4">
      <Image
        width={200}
        height={100}
        src="/body-select/hourglass.png"
        alt="Hourglass shape"
        className="h-[100px] object-contain"
      />
      <div>
        <h3 className="text-lg font-bold font-poppins">Hour Glass</h3>
        <p className="text-sm font-poppins">
          Bentuk tubuhmu memiliki proporsi seimbang antara bagian atas dan
          bawah, dengan pinggang yang terlihat ramping.
        </p>
      </div>
    </div>
    <div>
      <h4 className="font-semibold text-gray-800 mb-2">BMI Index</h4>
      <div className="w-full bg-gray-200 rounded-full h-5">
        <div
          className="bg-pink-400 h-5 rounded-lg"
          style={{ width: "45%" }}
        ></div>
      </div>
      <p className="text-xs text-right text-gray-500 mt-1">Ideal</p>
    </div>
  </div>
);

const CelebrityCard = () => (
  <div className="bg-white rounded-xl p-6 flex flex-col gap-4 border">
    <div className="flex items-center gap-2 font-semibold text-gray-700">
      <Crown className="h-5 w-5 fill-black" />
      <h3 className="font-handlee italic mt-2">Selebriti serupa</h3>
    </div>
    <hr />
    <div className="relative">
      <Image
        width={200}
        height={100}
        src="/damoy.png"
        alt="Davina Karamoy"
        className="w-full h-[130px] object-cover rounded-lg"
      />
      <div className="flex items-center bg-[#323232] w-fit absolute bottom-2 left-3 px-4 pt-1 pb-2 rounded-full gap-2">
        <Image
          width={23}
          height={23}
          src="/person-sparkle.png"
          alt="Davina Karamoy"
          className="object-cover rounded-lg"
        />
        <div className="text-[#FF7EA4] text-sm font-bold mt-1">88% Match</div>
      </div>
    </div>
    <div>
      <h4 className="font-semibold text-gray-800">Kenapa Cocok?</h4>
      <p className="text-sm text-gray-500">
        Kamu dan Davina Karamoy sama-sama memiliki bentuk badan hourglass dan
        tona deep winter perbedaan hanya di bentuk wajah.
      </p>
    </div>
  </div>
);

const RecommendationContainer = () => {
  const products: ProductCardProps[] = [
    {
      imageUrl: "/hijab-9.png",
      title: "Premium Pasmina",
      description:
        "Hijab dengan neutral color gelap cocok untuk skin tone kamu",
    },
    {
      imageUrl: "/hijab-10.png",
      title: "Premium Bergo",
      description: "Produk ini memiliki neutral color yang kamu butuhkan",
    },
  ];

  return (
    <div className="lg:col-span-2 flex flex-col gap-6 border bg-[#323232] rounded-xl p-4">
      <div className="flex gap-4 mt-4">
        <Handbag className="text-white" />
        <p className="text-2xl font-handlee text-white italic">
          Rekomendasi Produk
        </p>
      </div>
      <hr className="text-white" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <div className="bg-[#FFC6C6] rounded-xl p-6 flex gap-4">
          <div>
            <h3 className="text-lg font-bold">Rekomendasi Produk</h3>
            <p className="text-sm">
              Merekomendasikan produk berdasarkan hasil analisa yang telah di
              lakukan AI dengan mencocokan warna dan bentuk wajah.
            </p>
            <Sparkles className="text-center self-center mt-10 fill-black" />
          </div>
        </div>
        {products.map((product) => (
          <ProductCard key={product.title} {...product} />
        ))}
      </div>
    </div>
  );
};

const AnalysisDashboard: React.FC = () => {
  return (
    <div className="mt-10 p-4 sm:p-6 lg:p-8 lg:px-[200px]">
      <div className="flex flex-col gap-6 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <FaceShapeCard />
          <ColorToneCard />
          <BodyShapeCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-2">
          <CelebrityCard />
          <RecommendationContainer />
        </div>
        <hr className="mt-10" />
      </div>
    </div>
  );
};

export default AnalysisDashboard;
