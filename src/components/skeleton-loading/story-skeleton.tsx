import { Skeleton } from "@/components/ui/skeleton";

// Story Header Skeleton
export const StoryHeaderSkeleton = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="w-20 h-8" />
    </div>
  );
};

// User Photo Skeleton
export const UserPhotoSkeleton = () => {
  return <Skeleton className="w-[322px] h-[400px] rounded-lg" />;
};

// QR Section Skeleton
export const StoryQRSectionSkeleton = () => {
  return (
    <div className="flex-1 space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex gap-3 mt-6">
        <Skeleton className="w-24 h-10" />
        <Skeleton className="w-20 h-10" />
      </div>
    </div>
  );
};

// Face Shape Analysis Skeleton
export const StoryFaceShapeSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="flex gap-8">
        {/* Chart skeleton */}
        <div className="flex-1 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="flex-1 h-2" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>
        {/* Description skeleton */}
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Color Tone Analysis Skeleton
export const StoryColorToneSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <div className="grid grid-cols-2 gap-8">
        {/* Best colors */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-12 h-12 rounded" />
            ))}
          </div>
        </div>
        {/* Neutral colors */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-28" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-12 h-12 rounded" />
            ))}
          </div>
        </div>
      </div>
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
};

// Body Shape Analysis Skeleton
export const StoryBodyShapeSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-52" />
      <div className="flex gap-8">
        {/* Body shape info */}
        <div className="flex-1 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <Skeleton className="h-6 w-28" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        {/* BMI info */}
        <div className="flex-1 space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-6 w-36" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Story Poster Skeleton
export const StoryPosterSkeleton = () => {
  return (
    <div className="bg-[#f0f0f0] text-gray-800 w-[1080px] mx-auto p-8 font-sans">
      <div className="m-[100px]">
        <StoryHeaderSkeleton />
        <hr className="mb-10" />

        <div className="flex gap-5 mb-6">
          <UserPhotoSkeleton />
          <StoryQRSectionSkeleton />
        </div>

        <hr className="mt-10" />

        <StoryFaceShapeSkeleton />

        <hr className="mb-8" />

        <StoryColorToneSkeleton />

        <hr className="mb-14" />

        <StoryBodyShapeSkeleton />
      </div>
    </div>
  );
};

// Story Page Skeleton (for the entire page)
export const StoryPageSkeleton = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4 md:p-6">
      <StoryPosterSkeleton />
    </div>
  );
};

// Individual component skeletons for partial loading
export const StoryHeaderSkeletonInline = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="w-16 h-6" />
    </div>
  );
};

export const UserPhotoSkeletonInline = () => {
  return <Skeleton className="w-full h-[400px] rounded-lg" />;
};

export const StoryQRSectionSkeletonInline = () => {
  return (
    <div>
      <Skeleton className="h-6 w-40 mb-3" />
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="w-20 h-8" />
        <Skeleton className="w-16 h-8" />
      </div>
    </div>
  );
};
