import { useQuery, useMutation } from "@tanstack/react-query";
import { secureUrl, sendEmail } from "@/lib/api";
import { BodyType } from "@/types";
import { defaultUserData } from "@/lib/mock-data";


async function fetchData(endpoint: string) {
  const fullUrl = secureUrl(endpoint);
  console.log(`🔄 Fetching: ${fullUrl}`); // Debug log

  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`📡 Response status: ${response.status} for ${endpoint}`); // Debug log

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ HTTP Error ${response.status} for ${endpoint}:`,
        errorText
      );
      if (response.status === 404) {
        throw new Error(
          "Kami tidak dapat menemukan data yang Anda cari. Mohon periksa ID dan coba lagi."
        );
      }
      throw new Error(
        "Kami mengalami masalah saat mengambil data. Mohon coba lagi dalam beberapa saat."
      );
    }

    const data = await response.json();
    console.log(`✅ Success fetching ${endpoint}:`, data); // Debug log
    return data;
  } catch (error) {
    console.error(`💥 Fetch error for ${endpoint}:`, error);
    throw error;
  }
}

// Hook untuk fetching analysis data dengan debugging yang lebih baik
export function useAnalysisData(
  resultId: string | null,
  options?: { onError?: (error: Error) => void }
) {
  console.log("🚀 useAnalysisData called with resultId:", resultId); // Debug log

  return useQuery({
    queryKey: ["analysisData", resultId],
    queryFn: async () => {
      if (!resultId) {
        console.warn("⚠️ Result ID is required but not provided");
        throw new Error("ID Hasil diperlukan");
      }

      console.log("📊 Starting analysis data fetch for resultId:", resultId);

      try {
        // Fetch analysis data dan photos secara parallel
        console.log("🔄 Fetching analysis data and photos...");
        const [analysisData, photosData] = await Promise.all([
          fetchData(`/v1/user-analysis-results/${resultId}`),
          fetchData(`/v1/user-photos/analysis-results/${resultId}/photos`),
        ]);

        console.log("📋 Analysis data received:", analysisData);
        console.log("🖼️ Photos data received:", photosData);

        // Validasi data yang diperlukan
        if (!analysisData) {
          throw new Error("Data analisis kosong atau tidak terdefinisi");
        }

        // Fetch additional data berdasarkan IDs dari analysis result
        console.log("🔄 Fetching additional data...");
        const additionalDataPromises = [
          analysisData.face_shape_id
            ? fetchData(`/v1/face-shapes/${analysisData.face_shape_id}`)
            : Promise.resolve(null),
          analysisData.color_analysis_id
            ? fetchData(`/v1/color-analysis/${analysisData.color_analysis_id}`)
            : Promise.resolve(null),
          analysisData.body_shape_id
            ? fetchData(`/v1/body-shapes/${analysisData.body_shape_id}`)
            : Promise.resolve(null),
          analysisData.bmi_category_id
            ? fetchData(`/v1/bmi-categories/${analysisData.bmi_category_id}`)
            : Promise.resolve(null),
          analysisData.celebrity_id
            ? fetchData(`/v1/celebrities/${analysisData.celebrity_id}`)
            : Promise.resolve(null),
        ];

        const [
          faceShapeData,
          colorToneData,
          bodyShapeData,
          bmiCategoryData,
          celebrityData,
        ] = await Promise.all(additionalDataPromises);

        console.log("📊 Additional data received:", {
          faceShapeData,
          colorToneData,
          bodyShapeData,
          bmiCategoryData,
          celebrityData,
        });

        // Find user photo
        let userPhotoUrl = null;
        if (Array.isArray(photosData)) {
          const processedPhoto = photosData.find(
            (photo: { is_processed: boolean }) => photo.is_processed === true
          );

          if (processedPhoto) {
            userPhotoUrl = processedPhoto.file_path;
          } else {
            const originalPhoto = photosData.find(
              (photo: { photo_type: string }) =>
                photo.photo_type === "face_original"
            );
            if (originalPhoto) userPhotoUrl = originalPhoto.file_path;
          }
        }

        // Calculate BMI value dengan null checking
        let bmiValue = 0;
        if (analysisData.analysis_details?.bmi?.value) {
          bmiValue =
            typeof analysisData.analysis_details.bmi.value === "string"
              ? parseFloat(analysisData.analysis_details.bmi.value)
              : Number(analysisData.analysis_details.bmi.value);
        }

        const transformedData = {
          name: analysisData.user_name || "User",
          faceShape: faceShapeData?.name || defaultUserData.faceShape,
          bodyShape: bodyShapeData?.name || defaultUserData.bodyShape,
          colorTone: colorToneData?.name || defaultUserData.colorTone,
          bmi: {
            value: bmiValue || defaultUserData.bmi.value,
            category: bmiCategoryData?.name || defaultUserData.bmi.category,
            desc: bmiCategoryData?.description || defaultUserData.bmi.desc,
          },
          celebrityMatch: {
            name: celebrityData?.name || defaultUserData.celebrityMatch.name,
            matchPercentage:
              celebrityData?.match_percentage ||
              defaultUserData.celebrityMatch.matchPercentage,
            imageUrl:
              celebrityData?.picture_url ||
              defaultUserData.celebrityMatch.imageUrl,
            reason: celebrityData?.similarity_text
              ? [celebrityData.similarity_text]
              : defaultUserData.celebrityMatch.reason,
            description: celebrityData?.description,
          },
          faceShapeAnalysis: {
            uniqueFact:
              faceShapeData?.description ||
              defaultUserData.faceShapeAnalysis.uniqueFact,
            characteristics:
              faceShapeData?.characteristics ||
              defaultUserData.faceShapeAnalysis.characteristics,
          },
          bodyShapeAnalysis: {
            description:
              bodyShapeData?.description ||
              defaultUserData.bodyShapeAnalysis.description,
            characteristics:
              bodyShapeData?.characteristics ||
              defaultUserData.bodyShapeAnalysis.characteristics,
            imageUrl: defaultUserData.bodyShapeAnalysis.imageUrl,
          },
          colorToneAnalysis: {
            description:
              colorToneData?.description,
            bestColors:
              colorToneData?.best_colors,
            neutralColors:
              colorToneData?.neutral_colors,
            worstColors:
              colorToneData?.worst_colors,
            combination:
              colorToneData?.combination_colors,
            tips: {
              makeup: colorToneData?.make_up_tips
                ? [colorToneData.make_up_tips]
                : defaultUserData.colorToneAnalysis.tips.makeup,
              outfit: colorToneData?.tips_warna_kulit_pakaian
                ? [colorToneData.tips_warna_kulit_pakaian]
                : defaultUserData.colorToneAnalysis.tips.outfit,
              personality: colorToneData?.personality
                ? [colorToneData.personality]
                : defaultUserData.colorToneAnalysis.tips.personality,
              characteristics: colorToneData?.karakteristik
                ? [colorToneData.karakteristik]
                : defaultUserData.colorToneAnalysis.tips.characteristics,
            },
          },
          conclusionTips: {
            face:
              faceShapeData?.characteristics ||
              defaultUserData.conclusionTips.face,
            body:
              bodyShapeData?.characteristics ||
              defaultUserData.conclusionTips.body,
            color:
              colorToneData?.best_colors?.map(
                (color: string) => `Gunakan warna ${color}`
              ) || defaultUserData.conclusionTips.color,
            quickRecap: [
              `Bentuk wajah kamu adalah ${
                faceShapeData?.name || defaultUserData.faceShape
              }`,
              `Bentuk tubuh kamu adalah ${
                bodyShapeData?.name || defaultUserData.bodyShape
              }`,
              `Tone warna kamu adalah ${
                colorToneData?.name || defaultUserData.colorTone
              }`,
            ],
          },
        };

        console.log("✅ Transformed data:", transformedData);

        return {
          userData: transformedData,
          userPhotoUrl,
          rawAnalysisData: analysisData, // Tambahkan ini
        };
      } catch (error: unknown) {
        console.error("💥 Error fetching analysis data:", error);
        if (options?.onError) {
          options.onError(error instanceof Error ? error : new Error(String(error)));
        }
        throw new Error(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data analisis. Mohon coba lagi."
        );
      }
    },
    enabled: !!resultId,
    retry: 3, // Retry 3 kali jika gagal
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 5 * 60 * 1000, // Data dianggap fresh selama 5 menit
  });
}

export function useFaceShapeData(faceShapeId: string | null) {
  return useQuery({
    queryKey: ["faceShape", faceShapeId],
    queryFn: async () => {
      if (!faceShapeId) {
        throw new Error("ID Bentuk Wajah diperlukan");
      }
      return fetchData(`/v1/face-shapes/${faceShapeId}`);
    },
    enabled: !!faceShapeId,
    retry: 2,
  });
}

export function useColorToneData(colorAnalysisId: string | null) {
  return useQuery({
    queryKey: ["colorTone", colorAnalysisId],
    queryFn: async () => {
      if (!colorAnalysisId) {
        throw new Error("ID Analisis Warna diperlukan");
      }
      return fetchData(`/v1/color-analysis/${colorAnalysisId}`);
    },
    enabled: !!colorAnalysisId,
    retry: 2,
  });
}

export function useBodyShapeData(bodyShapeId: string | null) {
  return useQuery({
    queryKey: ["bodyShape", bodyShapeId],
    queryFn: async () => {
      if (!bodyShapeId) {
        throw new Error("ID Bentuk Tubuh diperlukan");
      }
      return fetchData(`/v1/body-shapes/${bodyShapeId}`);
    },
    enabled: !!bodyShapeId,
    retry: 2,
  });
}

export function useBmiCategoryData(bmiCategoryId: string | null) {
  return useQuery({
    queryKey: ["bmiCategory", bmiCategoryId],
    queryFn: async () => {
      if (!bmiCategoryId) {
        throw new Error("ID Kategori BMI diperlukan");
      }
      return fetchData(`/v1/bmi-categories/${bmiCategoryId}`);
    },
    enabled: !!bmiCategoryId,
    retry: 2,
  });
}

export function useCelebrityData(celebrityId: string | null) {
  return useQuery({
    queryKey: ["celebrity", celebrityId],
    queryFn: async () => {
      if (!celebrityId) {
        return null;
      }
      return fetchData(`/v1/celebrities/${celebrityId}`);
    },
    enabled: !!celebrityId,
    retry: 2,
  });
}

export function useDownloadPdf() {
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const resultId = searchParams.get("result_id");

  return useQuery({
    queryKey: ["downloadPdf", resultId],
    queryFn: async () => {
      if (!resultId) {
        throw new Error("ID Hasil diperlukan");
      }

      const firstName = localStorage.getItem("firstName") || "User"; 


      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resultId, firstName }), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal membuat PDF");
      }

      return await response.blob();
    },
    enabled: false, // This query will not run automatically
  });
}

export function useGenerateStory() {
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const resultId = searchParams.get("result_id");

  return useQuery({
    queryKey: ["generateStory", resultId],
    queryFn: async () => {
      if (!resultId) {
        throw new Error("ID Hasil diperlukan");
      }

      const response = await fetch(
        `/api/generate-story?result_id=${resultId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Gagal membuat gambar cerita");
      }

      return await response.blob();
    },
    enabled: false, // This query will not run automatically
  });
}

export const useBodyShapes = () => {
  return useQuery({
    queryKey: ["bodyShapes"],
    queryFn: async (): Promise<BodyType[]> => {
      console.log("🔄 Fetching body shapes...");
      const response = await fetch(secureUrl(`/v1/body-shapes/`));

      if (!response.ok) {
        throw new Error(`Kesalahan HTTP! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Body shapes fetched:", data);

      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("Tidak ada data bentuk tubuh ditemukan");
      }

      return data;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export function useSendEmail() {
  return useMutation({
    mutationFn: (data: { email: string; pdf: Blob; png: Blob }) =>
      sendEmail(data),
  });
}
