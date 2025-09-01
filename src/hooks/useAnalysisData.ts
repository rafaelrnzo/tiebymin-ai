import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { secureUrl } from "@/lib/api";
import { BodyType } from "@/types";
import { defaultUserData } from "@/lib/mock-data";
import { useRouter } from "next/navigation";


async function fetchData(endpoint: string, onUnauthorized?: () => void) {
  const fullUrl = secureUrl(endpoint);
  console.log(`🔄 Fetching: ${fullUrl}`); // Debug log
      const token = localStorage.getItem("accessToken") || localStorage.getItem("userToken");

  try {
    const response = await axios.get(fullUrl, {
      headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
    });

    console.log(`📡 Response status: ${response.status} for ${endpoint}`); // Debug log

    if (response.status >= 200 && response.status < 300) {
      console.log(`✅ Success fetching ${endpoint}:`, response.data); // Debug log
      return response.data;
    } else {
      console.error(
        `❌ HTTP Error ${response.status} for ${endpoint}:`,
        response.data
      );
      if (response.status === 401) {
        console.log("🚪 Unauthorized access, redirecting to login");
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          // Fallback: redirect to login if no callback provided
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
      }
      if (response.status === 404) {
        throw new Error(
          "Kami tidak dapat menemukan data yang Anda cari. Mohon periksa ID dan coba lagi."
        );
      }
      throw new Error(
        "Kami mengalami masalah saat mengambil data. Mohon coba lagi dalam beberapa saat."
      );
    }
  } catch (error: unknown) {
    console.error(`💥 Fetch error for ${endpoint}:`, error);
    // Handle axios error responses
    const axiosError = error as { response?: { status?: number } };
    if (axiosError.response?.status === 401) {
      console.log("🚪 Unauthorized access (catch), redirecting to login");
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
      throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
    }
    throw error;
  }
}

// Hook untuk fetching analysis data dengan debugging yang lebih baik
export function useAnalysisData(
  resultId: string | null,
  options?: { onError?: (error: Error) => void }
) {
  console.log("🚀 useAnalysisData called with resultId:", resultId); // Debug log

  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

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
          fetchData(`/v1/user-analysis-results/${resultId}`, handleUnauthorized),
          fetchData(`/v1/user-photos/analysis/${resultId}`, handleUnauthorized),
        ]);

        console.log("📋 Analysis data received:", analysisData);
        console.log("🖼️ Photos data received:", photosData);

        if (analysisData?.user_id && typeof window !== "undefined") {
          localStorage.setItem("userId", analysisData.user_id);
        }

        // Validasi data yang diperlukan
        if (!analysisData) {
          throw new Error("Data analisis kosong atau tidak terdefinisi");
        }

        // Fetch additional data berdasarkan IDs dari analysis result
        console.log("🔄 Fetching additional data...");
        const additionalDataPromises = [
          analysisData.face_shape_id
            ? fetchData(`/v1/face-shapes/${analysisData.face_shape_id}`, handleUnauthorized)
            : Promise.resolve(null),
          analysisData.color_analysis_id
            ? fetchData(`/v1/color-analysis/${analysisData.color_analysis_id}`, handleUnauthorized)
            : Promise.resolve(null),
          analysisData.body_shape_id
            ? fetchData(`/v1/body-shapes/${analysisData.body_shape_id}`, handleUnauthorized)
            : Promise.resolve(null),
          analysisData.bmi_category_id
            ? fetchData(`/v1/bmi-categories/${analysisData.bmi_category_id}`, handleUnauthorized)
            : Promise.resolve(null),
          analysisData.celebrity_id
            ? fetchData(`/v1/celebrities/${analysisData.celebrity_id}`, handleUnauthorized)
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
            karakteristik:
              faceShapeData?.karakteristik ||
              defaultUserData.faceShapeAnalysis.karakteristik,
          },
          bodyShapeAnalysis: {
            description:
              bodyShapeData?.description ||
              defaultUserData.bodyShapeAnalysis.description,
            karakteristik:
              bodyShapeData?.karakteristik ||
              defaultUserData.bodyShapeAnalysis.karakteristik,
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
              karakteristik: colorToneData?.karakteristik
                ? [colorToneData.karakteristik]
                : defaultUserData.colorToneAnalysis.tips.karakteristik,
            },
          },
          conclusionTips: {
            face:
              faceShapeData?.karakteristik ||
              defaultUserData.conclusionTips.face,
            body:
              bodyShapeData?.karakteristik ||
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
  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return useQuery({
    queryKey: ["faceShape", faceShapeId],
    queryFn: async () => {
      if (!faceShapeId) {
        throw new Error("ID Bentuk Wajah diperlukan");
      }
      return fetchData(`/v1/face-shapes/${faceShapeId}`, handleUnauthorized);
    },
    enabled: !!faceShapeId,
    retry: 2,
  });
}

export function useColorToneData(colorAnalysisId: string | null) {
  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return useQuery({
    queryKey: ["colorTone", colorAnalysisId],
    queryFn: async () => {
      if (!colorAnalysisId) {
        throw new Error("ID Analisis Warna diperlukan");
      }
      return fetchData(`/v1/color-analysis/${colorAnalysisId}`, handleUnauthorized);
    },
    enabled: !!colorAnalysisId,
    retry: 2,
  });
}

export function useBodyShapeData(bodyShapeId: string | null) {
  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return useQuery({
    queryKey: ["bodyShape", bodyShapeId],
    queryFn: async () => {
      console.log(bodyShapeId)
      if (!bodyShapeId) {
        throw new Error("ID Bentuk Tubuh diperlukan");
      }
      return fetchData(`/v1/body-shapes/${bodyShapeId}`, handleUnauthorized);
    },
    enabled: !!bodyShapeId,
    retry: 2,
  });
}

export function useBmiCategoryData(bmiCategoryId: string | null) {
  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return useQuery({
    queryKey: ["bmiCategory", bmiCategoryId],
    queryFn: async () => {
      if (!bmiCategoryId) {
        throw new Error("ID Kategori BMI diperlukan");
      }
      return fetchData(`/v1/bmi-categories/${bmiCategoryId}`, handleUnauthorized);
    },
    enabled: !!bmiCategoryId,
    retry: 2,
  });
}

export function useCelebrityData(celebrityId: string | null) {
  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return useQuery({
    queryKey: ["celebrity", celebrityId],
    queryFn: async () => {
      if (!celebrityId) {
        return null;
      }
      return fetchData(`/v1/celebrities/${celebrityId}`, handleUnauthorized);
    },
    enabled: !!celebrityId,
    retry: 2,
  });
}

export function useDownloadPdf() {
  return useMutation({
    mutationFn: async (data: { resultId: string; firstName?: string }) => {
      const firstName = data.firstName || localStorage.getItem("firstName") || "User";

      const response = await axios.post("/api/generate-pdf", {
        resultId: data.resultId,
        firstName
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      });

      return response.data;
    },
  });
}

export function useGenerateStory() {
  return useMutation({
    mutationFn: async (resultId: string) => {
      if (!resultId) {
        throw new Error("ID Hasil diperlukan");
      }

      const response = await axios.post(
        `/api/generate-story?result_id=${resultId}`,
        {},
        {
          responseType: "blob",
        }
      );

      return response.data;
    },
  });
}

export const useBodyShapes = () => {
  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return useQuery({
    queryKey: ["bodyShapes"],
    queryFn: async (): Promise<BodyType[]> => {
        const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("userToken");
      console.log("🔄 Fetching body shapes...");
      try {
        const response = await axios.get(secureUrl(`/v1/body-shapes/`), {
          headers:{
            "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
          }
        });

        console.log("✅ Body shapes fetched:", response.data);

        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
          throw new Error("Tidak ada data bentuk tubuh ditemukan");
        }

        return response.data;
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          console.log("🚪 Unauthorized access in useBodyShapes, redirecting to login");
          handleUnauthorized();
          throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
        }
        throw error;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export function useSendEmail() {
  const sendEmailMutation = useMutation({
    mutationFn: async (data: { email: string; pdf: Blob; png: Blob }) => {
      const formData = new FormData();
      formData.append("to", data.email);
      formData.append("subject", "Your Tiebymin Analysis Result");
      formData.append(
        "html",
        "<p>Here are your analysis results, attached as a PDF and PNG.</p>"
      );
      formData.append("pdf", data.pdf, "analysis-result.pdf");
      formData.append("png", data.png, "story-result.png");

      const response = await axios.post("/api/send-mail", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });

  return sendEmailMutation;
}
