import Image from "next/image";

interface BrandLogoProps {
  width?: number;
  height?: number;
}

export default function BrandLogo({
  width = 320,
  height = 180,
}: BrandLogoProps) {
  return (
    <div className="mb-8 w-full sm:w-[320px] h-auto sm:h-[200px] flex justify-center">
      <Image
        src="/tie-by-min-logo.png"
        alt="tiebyminlogo"
        width={width}
        height={height}
        className="w-auto h-auto max-w-full object-contain aspect-auto"
        priority
      />
    </div>
  );
}
