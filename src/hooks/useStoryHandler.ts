import { useState } from "react";
import { useGenerateStory } from "./useAnalysisData";
import { useToast } from "./useToast";

export const useStoryHandler = () => {
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [storyError, setStoryError] = useState<string | null>(null);
  const { mutateAsync: generateStory } = useGenerateStory();
  const { showToast } = useToast();

  const handleDownloadStory = async (finalResultId: string | null) => {
    if (!finalResultId) return;
    setIsGeneratingStory(true);

    try {
      setStoryError(null);
      console.log("Starting story generation for result ID:", finalResultId);

      const result = await generateStory(finalResultId);
      console.log("Story generation result:", result);

      // Check if result exists and has data
      if (result && result.data) {
        console.log("Story data received, size:", result.data.byteLength);

        const imageData = result.data;
        const file = new File([imageData], `story-tiebymin-${Date.now()}.png`, {
          type: "image/png",
        });

        console.log("File created:", file.name, file.size, "bytes");

        // Check if Web Share API is available and can share files
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "Tie By Min Story",
              text: "Coba AI Fashion Analysis aku!",
            });
            console.log("Story shared successfully");
            showToast("Story berhasil dibagikan!", "success");
          } catch (shareError) {
            console.log("Share failed, falling back to download:", shareError);
            // Fallback to download
            downloadFile(file);
            showToast("Story berhasil diunduh!", "success");
          }
        } else {
          console.log("Web Share API not available, downloading directly");
          // Direct download
          downloadFile(file);
          showToast("Story berhasil diunduh!", "success");
        }
      } else {
        console.error("No story data received in result:", result);
        throw new Error("No story data received from server");
      }
    } catch (error) {
      console.error("Story generation error:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error("Error details:", {
        message: err?.message,
        stack: err?.stack,
        response: err?.response,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
      });

      setStoryError("Gagal membuat story");
      showToast(
        `Gagal membuat story: ${err?.message || "Unknown error"}`,
        "error"
      );
    } finally {
      setIsGeneratingStory(false);
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
    console.log("Story downloaded successfully");
  };

  return {
    isGeneratingStory,
    storyError,
    handleDownloadStory,
  };
};