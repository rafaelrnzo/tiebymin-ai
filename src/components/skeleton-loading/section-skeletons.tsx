// TipsSection Skeleton
export const TipsSectionSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] lg:gap-[50px]">
      {/* Face tips card */}
      <div className="border-[1px] p-[20px] w-full border-[#323232] rounded-2xl h-full">
        <div className="flex flex-row items-center gap-[10px] lg:flex-col lg:items-start">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="mt-2 space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Body tips card */}
      <div className="border-[1px] p-[20px] w-full border-[#323232] rounded-2xl h-full">
        <div className="flex flex-row items-center gap-[10px] lg:flex-col lg:items-start">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="mt-2 space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Color tips card */}
      <div className="border-[1px] p-[20px] w-full border-[#323232] rounded-2xl h-full">
        <div className="flex flex-row items-center gap-[10px] lg:flex-col lg:items-start">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="mt-2 space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Recap card */}
      <div className="bg-[#FFC6C6] p-[20px] rounded-2xl shadow-md flex flex-col gap-[10px]">
        <div className="flex flex-row lg:flex-col xl:flex-col items-center lg:items-start gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

// ShapeSection Skeleton
export const ShapeSectionSkeleton = () => {
  return (
    <div className="flex flex-col lg:h-full h-fit">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] lg:gap-[50px]">
        {/* Shape description card */}
        <div className="border rounded-2xl px-5 pt-2.5 pb-5">
          <div className="h-12 w-32 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Characteristics card */}
        <div className="bg-[#FFC6C6] px-5 pb-5 rounded-2xl shadow-md">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mt-5 mb-4" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="w-full mt-[50px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-x-12 gap-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i}>
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3.5 w-full bg-gray-200 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ColorToneSection Skeleton
export const ColorToneSectionSkeleton = () => {
  return (
    <div className="font-sans max-w-6xl w-full mx-auto space-y-[50px]">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-[20px] lg:gap-[50px]">
        {/* Color description card */}
        <div className="lg:col-span-2 px-[25px] rounded-2xl border-[1px] border-[#323232]">
          <div className="h-12 w-40 bg-gray-200 rounded animate-pulse mt-2.5 mb-4" />
          <div className="space-y-2 pb-4">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Color guide card */}
        <div className="lg:col-span-4 px-[25px] pb-5 rounded-2xl border-[1px] border-[#323232] h-full">
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mt-[25px] mb-4" />

          {/* Mobile layout skeleton */}
          <div className="mt-4 lg:hidden space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-gray-200"
              >
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop layout skeleton */}
          <div className="hidden lg:block space-y-10">
            <div className="mt-4 grid grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
                  <div className="grid grid-cols-3 grid-rows-2 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <div
                        key={j}
                        className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 border border-[#323232] rounded-2xl p-3 mb-10">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex">
                    <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse" />
                    <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse -ml-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info cards skeleton */}
      <div className="bg-[#FFC6C6] rounded-2xl shadow-md p-[15px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="space-y-1">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CelebrityMatchSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
      {/* Mobile image first */}
      <div className="w-full md:hidden">
        <div className="w-full aspect-[4/5] sm:aspect-[3/4] max-w-sm mx-auto bg-gray-200 rounded-2xl animate-pulse" />
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-row gap-[20px] lg:gap-[50px]">
        <div className="flex flex-col gap-[20px] lg:gap-[50px] w-full md:w-1/2">
          {/* Celebrity info card */}
          <div className="border-[1px] border-neutral-600 rounded-2xl p-4 sm:p-6">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Match reason card */}
          <div className="bg-[#FFC6C6] rounded-2xl p-4 sm:p-6">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Celebrity image */}
        <div className="w-full md:w-1/2 min-h-[300px] sm:min-h-[400px] bg-gray-200 rounded-2xl animate-pulse" />
      </div>

      {/* Mobile content */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="border-[1px] border-neutral-600 rounded-2xl p-4 sm:p-6">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-1" />
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="bg-[#FFC6C6] rounded-2xl p-4 sm:p-6">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const BodySectionSkeleton = () => {
  return (
    <div className="flex flex-col tablet:flex-col lg:flex-row xl:flex-row w-full gap-5 lg:gap-[50px]">
      {/* Body shape card */}
      <div className="flex flex-col flex-1 px-[20px] pt-[10px] rounded-2xl border">
        <div className="h-12 w-32 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="flex justify-center my-4 sm:my-6 flex-shrink-0">
          <div className="h-[180px] sm:h-[220px] lg:h-[245px] w-[150px] bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* BMI and characteristics */}
      <div className="flex-2 space-y-4 lg:space-y-6">
        <div className="flex flex-col gap-4 lg:gap-12">
          {/* BMI card */}
          <div className="border border-[#323232] w-full max-w-full rounded-2xl p-4">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mt-3 mb-4" />
            <hr className="my-[25px]" />

            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col flex-1">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="space-y-1">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Characteristics card */}
          <div className="bg-[#FFC6C6] shadow-md rounded-2xl p-4 lg:p-6 w-full max-w-full">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
