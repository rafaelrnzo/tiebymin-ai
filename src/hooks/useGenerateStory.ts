import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useGenerateStory() {
  return useMutation({
    mutationFn: async (resultId: string) => {
      if (!resultId) {
        throw new Error("ID Hasil diperlukan");
      }

      const token = localStorage.getItem("accessToken") || localStorage.getItem("userToken");
      const url = `/api/generate-story?result_id=${resultId}`;

      // Detect connection quality for optimized timeouts
      const connection = (navigator as { connection?: { effectiveType: string; downlink: number } }).connection;
      const isSlowConnection = connection ?
        (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g' || connection.downlink < 1) :
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      try {
        const response = await axios.post(url, {}, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            // CRITICAL: Headers yang mencegah compression issues
            "Accept": "image/png",
            "Accept-Encoding": "identity", // NO compression
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            // Tambahkan hint untuk connection speed
            ...(isSlowConnection && { "X-Connection-Speed": "slow" })
          },
          responseType: "blob", // Essential untuk PNG
          timeout: isSlowConnection ? 60000 : 30000, // Dynamic timeout
          // Axios config untuk mencegah corruption
          validateStatus: function (status) {
            return status >= 200 && status < 300;
          },
          transformResponse: [], // KOSONGKAN transform response
          maxContentLength: 20 * 1024 * 1024, // 20MB limit for PNG
          maxBodyLength: 20 * 1024 * 1024,
          // Disable automatic decompression
          decompress: false,
        });

        // Strict validation
        if (!response.data) {
          throw new Error("No data received from server");
        }

        if (!(response.data instanceof Blob)) {
          throw new Error("Invalid response format - expected Blob");
        }

        if (response.data.size === 0) {
          throw new Error("Empty PNG response received");
        }

        // Additional blob validation
        if (response.data.size < 1000) {
          throw new Error("PNG response too small, possible corruption");
        }

        const arrayBuffer = await response.data.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Log untuk debugging
        console.log('Story generation success:', {
          size: uint8Array.byteLength,
          type: response.headers['content-type'],
          generationTime: response.headers['x-generation-time']
        });

        return {
          data: uint8Array,
          size: uint8Array.byteLength,
          type: response.headers['content-type'] || "image/png",
          generationTime: response.headers['x-generation-time']
        };
      } catch (error) {
        console.error('Story generation error:', error);

        if (axios.isAxiosError(error)) {
          // Handle specific axios errors
          if (error.code === 'ECONNABORTED') {
            throw new Error("Story generation timeout. Silakan coba lagi.");
          }

          if (error.code === 'ERR_NETWORK') {
            throw new Error("Koneksi bermasalah. Periksa internet Anda dan coba lagi.");
          }

          if (error.code === 'ERR_CONTENT_DECODING_FAILED') {
            throw new Error("Server response error. Silakan refresh halaman dan coba lagi.");
          }

          // Handle server errors
          if (error.response?.status === 500) {
            let errorMessage = "Server error saat membuat story";

            try {
              if (error.response.data instanceof Blob) {
                const errorText = await error.response.data.text();
                try {
                  const errorData = JSON.parse(errorText);
                  errorMessage = errorData.message || errorData.error || errorMessage;
                } catch {
                  errorMessage = `Server error: ${errorText.substring(0, 100)}`;
                }
              }
            } catch {
              // Fallback error message
            }

            throw new Error(errorMessage);
          }

          if (error.response?.status === 401) {
            throw new Error("Sesi berakhir. Silakan login kembali.");
          }

          if (error.response?.status === 404) {
            throw new Error("Data tidak ditemukan. Periksa result ID.");
          }

          // Network related errors
          if (!error.response && error.message) {
            if (error.message.includes('timeout')) {
              throw new Error("Timeout. Silakan coba lagi.");
            }
            if (error.message.includes('Network Error')) {
              throw new Error("Masalah jaringan. Periksa koneksi internet.");
            }
          }
        }

        // Generic error fallback
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Story generation gagal: ${errorMessage}`);
      }
    },

    // Retry strategy untuk network issues
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;

      const errorMessage = error instanceof Error ? error.message : String(error);
      // Retry untuk specific errors
      return errorMessage.includes('timeout') ||
             errorMessage.includes('jaringan') ||
             errorMessage.includes('Koneksi') ||
             errorMessage.includes('response error');
    },

    retryDelay: (attemptIndex) => {
      // Progressive retry delay: 1s, 2s, 4s
      return Math.min(1000 * Math.pow(2, attemptIndex), 4000);
    },

    // Global error handling
    onError: (error) => {
      console.error('Final story generation error:', error);
    },

    // Success callback
    onSuccess: (data) => {
      console.log('Story generation completed:', {
        size: data.size,
        type: data.type,
        generationTime: data.generationTime
      });
    }
  });
}