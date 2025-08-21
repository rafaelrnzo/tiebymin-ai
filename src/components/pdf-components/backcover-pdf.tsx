import Image from "next/image";

export const BackCover = () => (
  <div className="flex items-center justify-center w-full h-screen">
    <div className="w-full px-10 flex justify-center items-center bg-[#333333] h-full">
      <Image
        src="/tie-by-min-logo-light.png"
        alt="Logo Tie By Min Putih"
        width={250}
        height={80}
        priority
        className="self-center"
      />
    </div>
  </div>
);
