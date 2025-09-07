import { secureUrl } from "@/lib/api";
import { defaultUserData } from "@/lib/mock-data";
import { BodyType } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";


async function fetchData(endpoint: string, onUnauthorized?: () => void) {
  const fullUrl = secureUrl(endpoint);
  const token = localStorage.getItem("accessToken") || localStorage.getItem("userToken");

  console.log("fetchData Debug:", {
    endpoint,
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    tokenPrefix: token ? token.substring(0, 20) + "..." : null
  });

  // Check if token exists
  if (!token) {
    console.error("No authentication token found for API call:", endpoint);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Token autentikasi tidak ditemukan. Silakan login kembali.");
  }

  try {
    const response = await axios.get(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      if (response.status === 401) {
        if (onUnauthorized) {
          onUnauthorized();
        } else {
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
      if (response.status === 422) {
        throw new Error(
          "Data yang dikirim tidak valid. Mohon periksa dan coba lagi."
        );
      }
      if (response.status === 429) {
        throw new Error("Terlalu banyak permintaan. Mohon tunggu sebentar dan coba lagi.");
      }
      if (response.status >= 500) {
        throw new Error("Server sedang mengalami masalah. Silakan coba lagi nanti.");
      }
      throw new Error("Terjadi kesalahan saat mengambil data. Mohon coba lagi.");
    }
  } catch (error: unknown) {
    // Handle axios error responses
    const axiosError = error as { response?: { status?: number; data?: { message?: string } }; code?: string; message?: string };
    if (axiosError.response?.status === 401) {
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
      throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
    }
    if (axiosError.response?.status === 422) {
      throw new Error(
        `Data tidak dapat diproses: ${axiosError.response.data?.message || "Format data tidak valid"}`
      );
    }
    if (axiosError.response?.status === 429) {
      throw new Error("Terlalu banyak permintaan. Mohon tunggu sebentar dan coba lagi.");
    }
    if (axiosError.response?.status && axiosError.response.status >= 500) {
      throw new Error("Server sedang mengalami masalah. Silakan coba lagi nanti.");
    }
    if (axiosError.code === 'ECONNABORTED' || (axiosError.message && axiosError.message.includes('timeout'))) {
      throw new Error("Permintaan memakan waktu terlalu lama. Silakan coba lagi.");
    }
    if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'ECONNREFUSED') {
      throw new Error("Koneksi internet bermasalah. Mohon periksa koneksi Anda.");
    }
    throw new Error("Terjadi kesalahan saat mengambil data. Mohon coba lagi.");
  }
}

// Hook untuk fetching analysis data dengan debugging yang lebih baik
export function useAnalysisData(
  resultId: string | null,
  options?: { onError?: (error: Error) => void }
) {

  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return useQuery({
    queryKey: ["analysisData", resultId],
    queryFn: async () => {
      console.log("useAnalysisData queryFn called with resultId:", resultId);

      if (!resultId) {
        throw new Error("ID Hasil diperlukan");
      }

      try {
        // Fetch analysis data dan photos secara parallel
        const [analysisData, photosData] = await Promise.all([
          fetchData(`/v1/user-analysis-results/${resultId}`, handleUnauthorized),
          fetchData(`/v1/user-photos/analysis/${resultId}`, handleUnauthorized),
        ]);

        if (analysisData?.user_id && typeof window !== "undefined") {
          localStorage.setItem("userId", analysisData.user_id);
        }

        // Validasi data yang diperlukan
        if (!analysisData) {
          throw new Error("Data analisis kosong atau tidak terdefinisi");
        }

        // Validasi ID yang diperlukan untuk fetch data tambahan
        if (!analysisData.face_shape_id && !analysisData.color_analysis_id &&
            !analysisData.body_shape_id && !analysisData.bmi_category_id) {
          console.warn("Tidak ada ID yang valid untuk mengambil data tambahan");
        }

        // Fetch additional data berdasarkan IDs dari analysis result
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

        // Find user photo
        let userPhotoUrl = null;
        console.log("useAnalysisData - photosData:", photosData);
        if (Array.isArray(photosData)) {
          const processedPhoto = photosData.find(
            (photo: { is_processed: boolean }) => photo.is_processed === true
          );

          if (processedPhoto) {
            userPhotoUrl = processedPhoto.file_path;
            console.log("useAnalysisData - Found processed photo:", userPhotoUrl);
          } else {
            const originalPhoto = photosData.find(
              (photo: { photo_type: string }) =>
                photo.photo_type === "face_original"
            );
            if (originalPhoto) {
              userPhotoUrl = originalPhoto.file_path;
              console.log("useAnalysisData - Found original photo:", userPhotoUrl);
            }
          }
        }
        console.log("useAnalysisData - Final userPhotoUrl:", userPhotoUrl);

        // Calculate BMI value dengan null checking dan validasi
        let bmiValue = 0;
        if (analysisData.analysis_details?.bmi?.bmi_value) {
          const rawValue = analysisData.analysis_details.bmi.bmi_value;
          if (typeof rawValue === "string") {
            const parsed = parseFloat(rawValue);
            if (!isNaN(parsed) && parsed > 0) {
              bmiValue = parsed;
            }
          } else if (typeof rawValue === "number" && !isNaN(rawValue) && rawValue > 0) {
            bmiValue = rawValue;
          }
        } else if (analysisData.analysis_details?.bmi?.bmi) {
          // Fallback: use bmi.bmi if bmi_value is not available
          const rawValue = analysisData.analysis_details.bmi.bmi;
          if (typeof rawValue === "string") {
            const parsed = parseFloat(rawValue);
            if (!isNaN(parsed) && parsed > 0) {
              bmiValue = parsed;
            }
          } else if (typeof rawValue === "number" && !isNaN(rawValue) && rawValue > 0) {
            bmiValue = rawValue;
          }
        }

        const transformedData = {
          name: analysisData.user_name || "User",
          faceShape: faceShapeData?.name || defaultUserData.faceShape,
          bodyShape: bodyShapeData?.name || defaultUserData.bodyShape,
          colorTone: colorToneData?.name || defaultUserData.colorTone,
          bmi: {
            value: bmiValue ,
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
              bodyShapeData?.description,
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
      const token = localStorage.getItem("accessToken") || localStorage.getItem("userToken");

      console.log("useDownloadPdf: Starting PDF download request", {
        resultId: data.resultId,
        firstName,
        hasToken: !!token
      });

      try {
        const response = await axios.post("/api/generate-pdf", {
          resultId: data.resultId,
          firstName
        }, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          responseType: "blob", // This is crucial for PDF downloads
          timeout: 120000, // 2 minute timeout
        });

        console.log("useDownloadPdf: Response received", {
          status: response.status,
          contentType: response.headers['content-type'],
          dataSize: response.data?.size || 'unknown'
        });

        // Verify we got a proper blob response
        if (!response.data || response.data.size === 0) {
          throw new Error("Empty PDF response received");
        }

        // Check if the response is actually a PDF
        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.includes('application/pdf')) {
          console.error("useDownloadPdf: Unexpected content type:", contentType);
          // Try to read the response as text to see if it's an error message
          const text = await response.data.text();
          console.error("useDownloadPdf: Response content:", text.substring(0, 500));
          throw new Error(`Unexpected response format: ${contentType}. Expected PDF.`);
        }

        return {
          data: response.data,
          filename: `hasil-analisa-lengkap-${Date.now()}.pdf`
        };
      } catch (error) {
        console.error("useDownloadPdf: Error occurred:", error);
        
        if (axios.isAxiosError(error)) {
          if (error.code === 'ECONNABORTED') {
            throw new Error("PDF generation timeout. Please try again.");
          }
          if (error.response?.status === 500) {
            // Try to extract error details from response
            try {
              const errorText = await error.response.data.text();
              const errorData = JSON.parse(errorText);
              throw new Error(`Server error: ${errorData.details || errorData.error || 'Unknown server error'}`);
            } catch (parseError) {
              throw new Error("Server error during PDF generation. Please try again.");
            }
          }
          if (error.response?.status === 401) {
            throw new Error("Sesi telah berakhir. Silakan login kembali.");
          } else if (error.response?.status === 404) {
            throw new Error("Data tidak ditemukan untuk membuat PDF. Periksa result ID.");
          } else if (error.response?.status === 500) {
            throw new Error("Server sedang mengalami masalah saat membuat PDF. Silakan coba lagi nanti.");
          }
        }
        
        throw error;
      }
    },
    onError: (error) => {
      console.error("useDownloadPdf: Mutation failed:", error);
    }
  });
}

// Ganti hook useGenerateStory yang ada dengan versi ini:

export function useGenerateStory() {
  return useMutation({
    mutationFn: async (resultId: string) => {
      console.log("useGenerateStory: Starting API call for", resultId);
      
      if (!resultId) {
        throw new Error("ID Hasil diperlukan");
      }

      // Get token from localStorage
      const token = localStorage.getItem("accessToken") || localStorage.getItem("userToken");
      console.log("useGenerateStory: Token available:", !!token);

      const url = `/api/generate-story?result_id=${resultId}`;
      console.log("useGenerateStory: Calling URL:", url);

      try {
        const response = await axios.post(url, {}, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          responseType: "blob", // Important: Keep this as blob for binary data
        });

        console.log("useGenerateStory: Response received");
        console.log("useGenerateStory: Response status:", response.status);
        console.log("useGenerateStory: Response headers:", response.headers);
        console.log("useGenerateStory: Blob size:", response.data.size);

        // Check if response is actually a blob with content
        if (!response.data || response.data.size === 0) {
          throw new Error("Received empty response from story generation");
        }

        // Convert blob to arrayBuffer for consistent handling
        const arrayBuffer = await response.data.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        console.log("useGenerateStory: ArrayBuffer created, size:", uint8Array.byteLength);

        // Return in the format expected by the frontend handler
        return {
          data: uint8Array,
          size: uint8Array.byteLength,
          type: response.headers['content-type'] || "image/png"
        };
      } catch (error) {
        console.error("useGenerateStory: API call failed:", error);
        
        // Handle axios errors specifically
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 500) {
            throw new Error("Server error saat membuat story. Silakan coba lagi.");
          } else if (error.response?.status === 404) {
            throw new Error("Data tidak ditemukan. Periksa result ID.");
          } else if (error.response?.status === 401) {
            throw new Error("Sesi telah berakhir. Silakan login kembali.");
          } else if (error.response?.status === 404) {
            throw new Error("Data tidak ditemukan. Periksa result ID dan coba lagi.");
          } else if (error.response?.status === 500) {
            throw new Error("Server sedang mengalami masalah. Silakan coba lagi nanti.");
          }
          throw new Error("Terjadi kesalahan saat membuat story. Silakan coba lagi.");
        }
        
        throw error;
      }
    },
    onError: (error) => {
      console.error("useGenerateStory: Mutation error:", error);
    },
    onSuccess: (data) => {
      console.log("useGenerateStory: Mutation success, data size:", data?.size);
    }
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
      try {
        const response = await axios.get(secureUrl(`/v1/body-shapes/`), {
          headers:{
            "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
          }
        });


        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
          throw new Error("Tidak ada data bentuk tubuh ditemukan");
        }

        return response.data;
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
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

export function useCreatePayment() {
  return useMutation({
    mutationFn: async (data: {
      user_id: string;
      tinggi_badan: number;
      berat_badan: number;
      umur: number;
      body_shape_id: string;
      amount: number;
      foto_wajah: Blob;
    }) => {
      const formData = new FormData();
      formData.append("user_id", data.user_id);
      formData.append("tinggi_badan", data.tinggi_badan.toString());
      formData.append("berat_badan", data.berat_badan.toString());
      formData.append("umur", data.umur.toString());
      formData.append("body_shape_id", data.body_shape_id);
      formData.append("amount", data.amount.toString());
      formData.append("foto_wajah", data.foto_wajah, "face-photo.png");

      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("userToken");

      const response = await axios.post(
        secureUrl("/v1/payments/create-for-user"),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: (result) => {
      console.log("Payment created successfully:", result);
      // Store the order ID for later use
      if (result.order_id) {
        localStorage.setItem("paymentOrderId", result.order_id);
      }
    },
    onError: (error) => {
      console.error("Payment creation error:", error);
    },
  });
}

export function useOrderData(orderId: string | null) {
  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return useQuery({
    queryKey: ["orderData", orderId],
    queryFn: async () => {
      console.log("useOrderData queryFn called with orderId:", orderId);

      if (!orderId) {
        throw new Error("Order ID diperlukan");
      }

      try {
        const orderData = await fetchData(`/v1/orders/${orderId}`, handleUnauthorized);
        console.log("useOrderData - Order data:", orderData);

        if (!orderData || !orderData.analysis_result_id) {
          throw new Error("Data order tidak valid atau analysis_result_id tidak ditemukan");
        }

        return {
          orderData,
          analysisResultId: orderData.analysis_result_id
        };
      } catch (error: unknown) {
        console.error("💥 Error fetching order data:", error);
        throw new Error(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data order. Mohon coba lagi."
        );
      }
    },
    enabled: !!orderId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
  });
}
