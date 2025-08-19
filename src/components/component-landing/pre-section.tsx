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
  <div className="flex items-center gap-4">
    {colors.map((color, index) => (
      <div
        key={index}
        className="h-[50px] w-[50px] rounded-full border border-gray-200"
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
  <div className="bg-white rounded-xl p-4 flex flex-col gap-3 w-full">
    <Image
      width={200}
      height={100}
      src={imageUrl}
      alt={title}
      className="w-full h-[100px] object-cover rounded-lg"
    />
    <div className="flex items-center gap-4">
      <h4 className="font-semibold text-[#323232] text-xl">{title}</h4>
      <ShoppingCart className="h-4 w-4 fill-[#323232]" />
    </div>
    <p className="text-xl text-[#323232]">{description}</p>
  </div>
);

const FaceShapeCard = () => (
  <div className="bg-white rounded-xl p-6 flex flex-col gap-[25px] border">
    <div className="flex items-center gap-4 font-semibold text-gray-700">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 7V4.5C2 3.83696 2.26339 3.20107 2.73223 2.73223C3.20107 2.26339 3.83696 2 4.5 2H7M2 17V19.5C2 20.163 2.26339 20.7989 2.73223 21.2678C3.20107 21.7366 3.83696 22 4.5 22H7M17 2H19.5C20.163 2 20.7989 2.26339 21.2678 2.73223C21.7366 3.20107 22 3.83696 22 4.5V7M17 22H19.5C20.163 22 20.7989 21.7366 21.2678 21.2678C21.7366 20.7989 22 20.163 22 19.5V17M8.25 9.5H8.2625M15.75 9.5H15.7625M8.875 15.75C9.28235 16.1657 9.76856 16.496 10.3052 16.7215C10.8418 16.947 11.418 17.0631 12 17.0631C12.582 17.0631 13.1582 16.947 13.6948 16.7215C14.2314 16.496 14.7177 16.1657 15.125 15.75"
          stroke="black"
          stroke-width="3.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <h3 className="font-handlee italic mt-1.5 text-xl">Bentuk Wajah</h3>
    </div>
    <hr />
    <div>
      <p className="font-poppins text-xl">
        Bentuk wajah kotak itu kayak proporsi sempurna gitu, lho! Kamu punya
        garis rahang yang tegas dan dahi nggak terlalu lebar atau sempit. Ini
        bikin hampir semua gaya hijab cocok banget buat kamu!
      </p>
    </div>
    <div>
      <h4 className="font-bold text-[#323232] text-xl">Fakta Unik:</h4>
      <p className="font-poppins text-xl">
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
    <div className="bg-white rounded-xl p-6 flex flex-col gap-[25px] border">
      <div className="flex items-center gap-4 font-semibold text-gray-700">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.875 12C18.3777 12 17.9008 11.8025 17.5492 11.4508C17.1975 11.0992 17 10.6223 17 10.125C17 9.62772 17.1975 9.15081 17.5492 8.79917C17.9008 8.44754 18.3777 8.25 18.875 8.25C19.3723 8.25 19.8492 8.44754 20.2008 8.79917C20.5525 9.15081 20.75 9.62772 20.75 10.125C20.75 10.6223 20.5525 11.0992 20.2008 11.4508C19.8492 11.8025 19.3723 12 18.875 12ZM15.125 7C14.6277 7 14.1508 6.80246 13.7992 6.45083C13.4475 6.09919 13.25 5.62228 13.25 5.125C13.25 4.62772 13.4475 4.15081 13.7992 3.79917C14.1508 3.44754 14.6277 3.25 15.125 3.25C15.6223 3.25 16.0992 3.44754 16.4508 3.79917C16.8025 4.15081 17 4.62772 17 5.125C17 5.62228 16.8025 6.09919 16.4508 6.45083C16.0992 6.80246 15.6223 7 15.125 7ZM8.875 7C8.37772 7 7.90081 6.80246 7.54917 6.45083C7.19754 6.09919 7 5.62228 7 5.125C7 4.62772 7.19754 4.15081 7.54917 3.79917C7.90081 3.44754 8.37772 3.25 8.875 3.25C9.37228 3.25 9.84919 3.44754 10.2008 3.79917C10.5525 4.15081 10.75 4.62772 10.75 5.125C10.75 5.62228 10.5525 6.09919 10.2008 6.45083C9.84919 6.80246 9.37228 7 8.875 7ZM5.125 12C4.62772 12 4.15081 11.8025 3.79917 11.4508C3.44754 11.0992 3.25 10.6223 3.25 10.125C3.25 9.62772 3.44754 9.15081 3.79917 8.79917C4.15081 8.44754 4.62772 8.25 5.125 8.25C5.62228 8.25 6.09919 8.44754 6.45083 8.79917C6.80246 9.15081 7 9.62772 7 10.125C7 10.6223 6.80246 11.0992 6.45083 11.4508C6.09919 11.8025 5.62228 12 5.125 12ZM12 0.75C9.01631 0.75 6.15483 1.93526 4.04505 4.04505C1.93526 6.15483 0.75 9.01631 0.75 12C0.75 14.9837 1.93526 17.8452 4.04505 19.955C6.15483 22.0647 9.01631 23.25 12 23.25C12.4973 23.25 12.9742 23.0525 13.3258 22.7008C13.6775 22.3492 13.875 21.8723 13.875 21.375C13.875 20.8875 13.6875 20.45 13.3875 20.125C13.1 19.7875 12.9125 19.35 12.9125 18.875C12.9125 18.3777 13.11 17.9008 13.4617 17.5492C13.8133 17.1975 14.2902 17 14.7875 17H17C18.6576 17 20.2473 16.3415 21.4194 15.1694C22.5915 13.9973 23.25 12.4076 23.25 10.75C23.25 5.225 18.2125 0.75 12 0.75Z"
            fill="black"
          />
        </svg>
        <h3 className="font-handlee italic mt-1.5 text-xl">Tona Warna</h3>
      </div>
      <hr />
      <h2 className="text-3xl font-bold text-[#323232] font-oswald">
        Deep Winter
      </h2>
      <h4 className="text-[#323232] mb-2 text-xl">Best Color</h4>
      <ColorSwatches colors={bestColors} />
      <h4 className="text-[#323232] mb-2 text-xl">Color Combination</h4>
      <ColorSwatches colors={combinationColors} />
    </div>
  );
};

const BodyShapeCard = () => (
  <div className="bg-white rounded-xl p-6 flex flex-col gap-[25px] border">
    <div className="flex items-center gap-4 font-semibold text-gray-700">
      <svg
        width="18"
        height="26"
        viewBox="0 0 18 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.00002 6.125C9.74594 6.125 10.4613 5.82868 10.9888 5.30124C11.5162 4.77379 11.8125 4.05842 11.8125 3.3125C11.8125 2.56658 11.5162 1.85121 10.9888 1.32376C10.4613 0.796316 9.74594 0.5 9.00002 0.5C8.2541 0.5 7.53873 0.796316 7.01129 1.32376C6.48384 1.85121 6.18752 2.56658 6.18752 3.3125C6.18752 4.05842 6.48384 4.77379 7.01129 5.30124C7.53873 5.82868 8.2541 6.125 9.00002 6.125ZM17.7 7.65C17.7928 7.96826 17.7554 8.31036 17.596 8.60104C17.4366 8.89172 17.1683 9.10717 16.85 9.2C15.365 9.6325 14.0238 9.95875 12.75 10.1756V24.25C12.7504 24.572 12.6265 24.8817 12.4042 25.1146C12.1819 25.3474 11.8783 25.4856 11.5566 25.5002C11.235 25.5147 10.9201 25.4047 10.6777 25.1928C10.4352 24.981 10.2838 24.6838 10.255 24.3631L9.63002 17.4881C9.62665 17.4505 9.62498 17.4128 9.62502 17.375H8.37502C8.37507 17.4128 8.3734 17.4505 8.37002 17.4881L7.74502 24.3631C7.71626 24.6838 7.56486 24.981 7.32238 25.1928C7.0799 25.4047 6.76504 25.5147 6.4434 25.5002C6.12177 25.4856 5.81816 25.3474 5.59584 25.1146C5.37353 24.8817 5.24965 24.572 5.25002 24.25V10.1525C3.9794 9.93375 2.64315 9.61438 1.16565 9.20438C1.00595 9.16185 0.856271 9.08808 0.725269 8.98733C0.594267 8.88658 0.484544 8.76085 0.402447 8.61742C0.320351 8.47399 0.26751 8.31571 0.246984 8.15172C0.226457 7.98774 0.238653 7.82132 0.282863 7.66208C0.327073 7.50284 0.402421 7.35394 0.504548 7.22401C0.606675 7.09408 0.733553 6.98569 0.877841 6.90511C1.02213 6.82454 1.18096 6.77337 1.34516 6.75458C1.50935 6.73578 1.67563 6.74974 1.8344 6.79562C4.7144 7.59438 6.87815 7.99062 9.00565 8C11.1281 8.00938 13.2869 7.63438 16.15 6.8C16.4683 6.70717 16.8104 6.74458 17.1011 6.90398C17.3917 7.06339 17.6072 7.33174 17.7 7.65Z"
          fill="black"
        />
      </svg>
      <h3 className="font-handlee italic mt-1.5">Bentuk Tubuh</h3>
    </div>
    <hr />
    <div className="flex gap-4">
      <Image
        width={200}
        height={100}
        src="/body-select/hourglass.png"
        alt="Hourglass shape"
        className="h-[160px] object-contain"
      />
      <div>
        <h3 className="text-xl font-bold font-poppins">Hour Glass</h3>
        <p className="text-xl font-poppins">
          Bentuk tubuhmu memiliki proporsi seimbang antara bagian atas dan
          bawah, dengan pinggang yang terlihat ramping.
        </p>
      </div>
    </div>
    <h4 className="font-bold font-poppins text-[#323232] mb-2 text-xl">
      BMI Index
    </h4>
    <div className="w-full bg-gray-200 rounded-full h-5">
      <div
        className="bg-pink-400 h-5 rounded-lg"
        style={{ width: "45%" }}
      ></div>
    </div>
  </div>
);

const CelebrityCard = () => (
  <div className="bg-white rounded-xl p-6 flex flex-col gap-[25px] border">
    <div className="flex items-center gap-4 font-semibold text-gray-700">
      <Crown className="h-5 w-5 fill-[#323232]" />
      <h3 className="font-handlee italic mt-2 text-xl">Selebriti serupa</h3>
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
      <div className="flex items-center bg-[#323232] w-fit absolute bottom-2 left-3 px-4 pt-1 pb-2 rounded-full gap-4">
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
      <h4 className="font-semibold text-[#323232] text-xl font-poppins">
        Kenapa Cocok?
      </h4>
      <p className="text-xl text-[#323232] font-poppins">
        Kamu dan Davina Karamoy memiliki bentuk badan hourglass dan tone deep
        winter
      </p>
    </div>
  </div>
);

const RecommendationContainer = () => {
  const products: ProductCardProps[] = [
    {
      imageUrl: "/new-hijab-9.png",
      title: "Premium Pasmina",
      description:
        "Hijab dengan neutral color gelap cocok untuk skin tone kamu",
    },
    {
      imageUrl: "/new-hijab-10.png",
      title: "Premium Bergo",
      description: "Produk ini memiliki neutral color yang kamu butuhkan",
    },
  ];

  return (
    <div className="lg:col-span-2 flex flex-col gap-4 bg-[#323232] rounded-xl p-6">
      <div className="flex gap-4 mt-4">
        <Handbag className="text-white" />
        <p className="text-2xl font-handlee text-white italic">
          Rekomendasi Produk
        </p>
      </div>
      <hr className="text-white" />
      <div className="flex gap-6 ">
        <div className="bg-[#FFC6C6] w-[900px] rounded-xl p-6 flex flex-col font-poppins">
          <h3 className="text-xl font-bold text-start">Rekomendasi Produk</h3>
          <p className="text-xl">
            Merekomendasikan produk berdasarkan hasil analisa yang telah di
            lakukan AI dengan mencocokan warna dan bentuk wajah
          </p>
          <Sparkles className="text-center self-center fill-[#323232]" />
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
    <div className="mt-[60px] p-4 sm:p-6 lg:p-8 lg:px-[200px]">
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
        <hr className="my-[60px]" />
      </div>
    </div>
  );
};

export default AnalysisDashboard;
