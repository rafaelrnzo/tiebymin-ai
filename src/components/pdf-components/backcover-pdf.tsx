import Image from "next/image";

export const BackCover = () => (
  <div className="w-full h-full bg-[#333333] flex items-center justify-center p-10">
    <Image
      src="/tie-by-min-logo-light.png"
      alt="Logo Tie By Min Putih"
      width={250}
      height={80}
      priority
      className="object-contain"
    />
  </div>
);
