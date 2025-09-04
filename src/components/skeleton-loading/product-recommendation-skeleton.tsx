import { UserData } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "../pdf-components/footer-pdf";
import { PageHeader } from "../pdf-components/header-pdf";

// Komponen Skeleton untuk satu produk
export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-row items-center h-[180px] shadow-lg">
      {/* Card Gambar Skeleton */}
      <div className="w-1/2 h-full relative overflow-hidden rounded-l-lg">
        <Skeleton className="w-full h-full" />
        {/* Image placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {/* Match percentage skeleton */}
        <div className="absolute bottom-3 left-3">
          <Skeleton className="w-12 h-6 rounded-full" />
        </div>
      </div>

      {/* Card Deskripsi Skeleton */}
      <div className="w-1/2 p-6 flex flex-col justify-center h-full rounded-r-lg">
        {/* Product name skeleton */}
        <div className="mb-2">
          <Skeleton className="h-8 w-3/4 mb-1" />
          <Skeleton className="h-8 w-1/2" />
        </div>
        {/* Compatibility reason skeleton */}
        <Skeleton className="h-6 w-2/3" />
      </div>
    </div>
  );
};

// Komponen utama skeleton untuk loading state
export const ProductRecommendationSkeleton = ({
  userData,
}: {
  userData: UserData;
}) => {
  return (
    <div className="bg-[#F0F0F0] w-full h-full px-10 flex flex-col">
      <PageHeader name={userData.name} />

      <main className="flex-grow flex flex-col py-6">
        {/* Title skeleton */}
        <Skeleton className="h-12 w-96 mb-4" />

        <hr className="border-[#323232] my-10" />

        {/* Products skeleton */}
        <div className="flex-grow">
          <div className="flex flex-col gap-8">
            {[1, 2, 3].map((index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>

      <Footer page="07" />
    </div>
  );
};
