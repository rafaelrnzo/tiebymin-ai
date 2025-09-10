import { secureUrl } from "@/lib/api";
import { defaultUserData } from "@/lib/mock-data";
import { BodyType } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PhotoData {
  analysis_result_id: string;
  photo_type: string;
  file_path: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  is_processed: boolean;
  analysis_metadata?: Record<string, unknown>;
  processed_at: string;
  id: string;
  uploaded_at: string;
}


async function fetchData(endpoint: string, onUnauthorized?: () => void) {
  const fullUrl = secureUrl(endpoint);
  const token = localStorage.getItem("accessToken") || localStorage.getItem("userToken");

  if (!token) {
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
    if (axiosError.response?.status === 404) {
      throw new Error("Data yang Anda cari tidak ditemukan. Pastikan ID yang benar.");
    } else if (axiosError.response?.status === 403 || axiosError.response?.status === 401) {
      throw new Error("Akses ditolak. Silakan login kembali.");
    } else if (axiosError.response?.status && axiosError.response.status >= 500) {
      throw new Error("Server sedang mengalami masalah. Silakan coba lagi nanti.");
    } else if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
      throw new Error("Permintaan timeout. Periksa koneksi internet Anda.");
    } else if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'ECONNREFUSED') {
      throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
    } else {
      throw new Error("Terjadi kesalahan saat mengambil data. Mohon coba lagi.");
    }
  }
}

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

      if (!resultId) {
        throw new Error("ID Hasil diperlukan");
      }

      try {
        const [analysisData, photosData] = await Promise.all([
          fetchData(`/v1/user-analysis-results/${resultId}`, handleUnauthorized),
          fetchData(`/v1/user-photos/analysis/${resultId}`, handleUnauthorized),
        ]);

        if (analysisData?.user_id && typeof window !== "undefined") {
          localStorage.setItem("userId", analysisData.user_id);
        }

        if (!analysisData) {
          throw new Error("Data analisis kosong atau tidak terdefinisi");
        }

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

        const decodeUrl = (url: string): string => {
          try {
            let decoded = decodeURIComponent(url);
            if (decoded.includes('%')) {
              decoded = decodeURIComponent(decoded);
            }

            const httpsMatches = decoded.match(/https:\/\/[^\/]+\/[^\/]+\/(.+)/);
            if (httpsMatches && httpsMatches[1]) {
              const baseUrl = 'https://sin1.contabostorage.com';
              const path = httpsMatches[1];
              decoded = `${baseUrl}/${path}`;
            }

            return decoded;
          } catch (error) {
            return url;
          }
        };

        let userPhotoUrl = null;

        if (Array.isArray(photosData) && photosData.length > 0) {
          const processedPhoto = photosData.find(
            (photo: { is_processed: boolean }) => photo.is_processed === true
          );

          if (processedPhoto && processedPhoto.file_path) {
            userPhotoUrl = decodeUrl(processedPhoto.file_path);
          } else {
            const originalPhoto = photosData.find(
              (photo: { photo_type: string }) =>
                photo.photo_type === "face_original"
            );
            if (originalPhoto && originalPhoto.file_path) {
              userPhotoUrl = decodeUrl(originalPhoto.file_path);
            } else {
              const firstPhotoWithPath = photosData.find(
                (photo: PhotoData) => photo.file_path
              );
              if (firstPhotoWithPath) {
                userPhotoUrl = decodeUrl(firstPhotoWithPath.file_path);
              }
            }
          }
        }

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
            category: bmiCategoryData?.kategori || defaultUserData.bmi.category,
            desc: bmiCategoryData?.tips_fashion || defaultUserData.bmi.desc,
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
              bodyShapeData?.penjelasan_body_shape,
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
              bodyShapeData?.penjelasan_body_shape ||
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
              } dengan ${bodyShapeData?.penjelasan_body_shape || 'karakteristik unik'}`,
              `Tone warna kamu adalah ${
                colorToneData?.name || defaultUserData.colorTone
              }`,
            ],
          },
        };


        const result = {
          userData: transformedData,
          userPhotoUrl,
          rawAnalysisData: analysisData,
        };

        return result;
      } catch (error: unknown) {
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
    staleTime: 5 * 60 * 1000,
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
      if (result.order_id) {
        localStorage.setItem("paymentOrderId", result.order_id);
      }
    },
  });
}

export function useOrderData(orderId: string | null, requireAuth: boolean = true) {
  return useQuery({
    queryKey: ["orderData", orderId, requireAuth],
    queryFn: async () => {
      if (!orderId) {
        throw new Error("Order ID diperlukan");
      }

      try {
        if (!requireAuth) {
          const fullUrl = secureUrl(`/v1/orders/${orderId}`);
          const response = await axios.get(fullUrl, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.status >= 200 && response.status < 300) {
            const orderData = response.data;

            if (!orderData) {
              throw new Error("Data order tidak ditemukan");
            }

            if (!orderData.analysis_result_id) {
              throw new Error("Data order tidak valid atau analysis_result_id tidak ditemukan");
            }

            return {
              orderData,
              analysisResultId: orderData.analysis_result_id
            };
          } else {
            throw new Error(`API request failed with status ${response.status}`);
          }
        } else {
          const handleUnauthorized = () => {
            if (typeof window !== "undefined") {
            }
          };

          const orderData = await fetchData(`/v1/orders/${orderId}`, handleUnauthorized);

          if (!orderData) {
            throw new Error("Data order tidak ditemukan");
          }

          if (!orderData.analysis_result_id) {
            throw new Error("Data order tidak valid atau analysis_result_id tidak ditemukan");
          }

          return {
            orderData,
            analysisResultId: orderData.analysis_result_id
          };
        }
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number; statusText?: string; data?: unknown }; message?: string };
        if (axiosError.response?.status === 404) {
          return null;
        }

        throw new Error(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data order. Mohon coba lagi."
        );
      }
    },
    enabled: !!orderId,
    retry: 1, // Reduce retries to avoid multiple redirects
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });
}

