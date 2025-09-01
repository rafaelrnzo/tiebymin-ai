import { useState, useEffect, useCallback } from "react";

export const useImageHandling = (userPhotoUrl: string | null) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
    setRetryCount(0);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);

    // Auto retry up to 3 times with increasing delay
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setImageError(false);
        setImageLoading(true);
      }, Math.pow(2, retryCount) * 1000); // 1s, 2s, 4s delays
    }
  }, [retryCount]);

  const checkImageAvailability = useCallback(async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  // Reset image state when userPhotoUrl changes
  useEffect(() => {
    if (userPhotoUrl) {
      setImageError(false);
      setImageLoading(true);
      setRetryCount(0);
    }
  }, [userPhotoUrl]);

  // Periodic check for image availability
  useEffect(() => {
    if (!userPhotoUrl || !imageLoading) return;

    const checkImage = async () => {
      const isAvailable = await checkImageAvailability(userPhotoUrl);
      if (isAvailable && imageLoading) {
        setImageLoading(false);
        setImageError(false);
      }
    };

    // Check immediately and then every 2 seconds for up to 30 seconds
    checkImage();
    const interval = setInterval(checkImage, 2000);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (imageLoading) {
        setImageLoading(false);
        setImageError(true);
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [userPhotoUrl, imageLoading, checkImageAvailability]);

  const retryImage = useCallback(() => {
    setImageError(false);
    setImageLoading(true);
    setRetryCount(0);
  }, []);

  return {
    imageError,
    imageLoading,
    retryCount,
    handleImageLoad,
    handleImageError,
    retryImage,
  };
};