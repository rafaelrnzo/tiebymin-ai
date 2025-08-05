import Image from 'next/image';

interface BrandLogoProps {
    width?: number;
    height?: number;
}

export default function BrandLogo({ width = 320, height = 180 }: BrandLogoProps) {
    return (
        <div className="mb-8 w-full flex justify-center">
            <Image
                src="/tie-by-min-logo.png"
                alt="tiebyminlogo"
                width={width}
                height={height}
                className="w-48 h-auto lg:w-[480px] lg:h-[280px]"
                priority
            />
        </div>
    );
} 