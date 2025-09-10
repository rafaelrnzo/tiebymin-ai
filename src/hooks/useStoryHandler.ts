import { useState } from "react";
import { useToast } from "./useToast";
import { useGenerateStory } from "./useGenerateStory";

export const useStoryHandler = () => {
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const [storyError, setStoryError] = useState<string | null>(null);
  const { mutateAsync: generateStory } = useGenerateStory();
  const { showToast } = useToast();

  const handleDownloadStory = async (finalResultId: string | null) => {
    if (!finalResultId) return;
    setIsGeneratingStory(true);
    setStoryProgress(0);
    setStoryError(null);

    try {
      // Simulate progress for better UX - optimized updates
      let lastUpdate = Date.now();
      const progressInterval = setInterval(() => {
        const now = Date.now();
        // Only update if enough time has passed to prevent too frequent updates
        if (now - lastUpdate < 800) return;

        setStoryProgress((prev) => {
          if (prev >= 95) return prev; // Stop earlier to prevent over-shooting
          // More controlled progress increments
          const increment = Math.random() * 6 + 3; // 3-9 range for smoother progress
          const newProgress = Math.min(prev + increment, 95);
          lastUpdate = now;
          return newProgress;
        });
      }, 1000); // Even less frequent to reduce re-renders

      const result = await generateStory(finalResultId);

      clearInterval(progressInterval);
      // Small delay before setting to 100% for better UX
      setTimeout(() => setStoryProgress(100), 200);
      // Check if result exists and has data
      if (result && result.data) {

        const imageData = result.data;
        const file = new File([imageData], `story-tiebymin-${Date.now()}.png`, {
          type: "image/png",
        });


        // Check if Web Share API is available and can share files
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "Tie By Min Story",
              text: "Coba AI Fashion Analysis aku!",
            });
            showToast("Story berhasil dibagikan!", "success");
          } catch (shareError) {
            // Fallback to download
            downloadFile(file);
            showToast("Story berhasil diunduh!", "success");
          }
        } else {
          // Direct download
          downloadFile(file);
          showToast("Story berhasil diunduh!", "success");
        }
      } else {
        console.error("No story data received in result:", result);
        throw new Error("No story data received from server");
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;

      setStoryProgress(0);
      setStoryError("Gagal membuat story");
      showToast(
        `Gagal membuat story: ${err?.message || "Unknown error"}`,
        "error"
      );
    } finally {
      setIsGeneratingStory(false);
      // Clear progress after completion
      setTimeout(() => {
        setStoryProgress(0);
      }, 2000);
    }
  };

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link); // Add to DOM for better compatibility
    link.click();
    document.body.removeChild(link); // Clean up
    URL.revokeObjectURL(url);
  };

  return {
    isGeneratingStory,
    storyProgress,
    storyError,
    handleDownloadStory,
  };
};