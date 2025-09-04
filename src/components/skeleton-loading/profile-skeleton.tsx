import { Navbar } from "@/components/component-landing/navbar";
import { Card } from "@/components/ui/card";

const DashboardSkeleton = () => {
  return (
    <div className="bg-[#f0f0f0] min-h-screen w-full font-poppins text-[#323232]">
      <Navbar />
      <main className="container mx-auto px-4 pt-[100px] lg:pt-[190px]">
        {/* Profile and Welcome Section Skeleton */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] lg:gap-[50px] mb-[20px]">
          {/* Profile Card Skeleton */}
          <Card className="lg:col-span-1 rounded-2xl border flex flex-col items-center justify-center text-center p-6">
            {/* Profile Image Skeleton */}
            <div className="h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] md:h-[180px] md:w-[180px] lg:h-[204px] lg:w-[204px] bg-gray-200 rounded-full animate-pulse mb-4"></div>

            {/* Name Input Skeleton */}
            <div className="w-full h-10 bg-gray-200 rounded animate-pulse mb-4"></div>

            {/* Buttons Skeleton */}
            <div className="flex flex-row gap-4 items-center lg:flex-col w-full">
              <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </Card>

          {/* Welcome Section Skeleton */}
          <div className="w-full lg:col-span-2">
            <div className="flex flex-col w-full gap-[20px] lg:gap-[50px] h-full">
              {/* Welcome Title Skeleton */}
              <div className="hidden lg:block h-12 bg-gray-200 rounded animate-pulse"></div>

              {/* Welcome Description Skeleton */}
              <div className="hidden lg:block space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>

              {/* CTA Card Skeleton */}
              <div className="bg-gray-200 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-between gap-6 flex-1 animate-pulse">
                <div className="text-center md:text-left w-full">
                  <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="w-full md:w-48 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Test History Section Skeleton */}
        <section className="flex flex-col gap-[20px] lg:gap-[50px] mt-0 lg:mt-[50px]">
          {/* Section Title Skeleton */}
          <div className="h-10 bg-gray-200 rounded animate-pulse w-64"></div>

          {/* Section Description Skeleton */}
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>

          {/* Table Skeleton */}
          <div className="overflow-x-auto rounded-2xl">
            <div className="border-0">
              {/* Table Header Skeleton */}
              <div className="bg-gray-200 rounded-2xl p-4 mb-2 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-300 rounded w-20"></div>
                  <div className="h-6 bg-gray-300 rounded w-24"></div>
                  <div className="h-6 bg-gray-300 rounded w-20"></div>
                </div>
              </div>

              {/* Table Rows Skeleton */}
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex justify-between items-center p-4 border-b border-gray-200"
                >
                  <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pagination Skeleton */}
        <section className="mt-8 flex justify-center">
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardSkeleton;
