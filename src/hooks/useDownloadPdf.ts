import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useDownloadPdf() {
  return useMutation({
    mutationFn: async (data: {
      resultId: string;
      firstName?: string;
      optimize?: boolean;
      quality?: "low" | "medium" | "high";
    }) => {
      const firstName = data.firstName || localStorage.getItem("firstName") || "User";
      const token = localStorage.getItem("accessToken") || localStorage.getItem("userToken");

      try {
        // Detect connection quality untuk optimasi
        const connection = (navigator as { connection?: { effectiveType: string; downlink: number } }).connection;
        const isSlowConnection = connection ?
          (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g' || connection.downlink < 1) :
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // Prepare request data with optimization parameters
        const requestData: {
          resultId: string;
          firstName: string;
          optimize?: boolean;
          quality?: string;
        } = {
          resultId: data.resultId,
          firstName
        };

        // Add optimization parameters if provided
        if (data.optimize !== undefined) {
          requestData.optimize = data.optimize;
        }
        if (data.quality) {
          requestData.quality = data.quality;
        }

        const response = await axios.post("/api/generate-pdf", requestData, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            // CRITICAL: Headers yang mencegah compression issues
            "Accept": "application/pdf",
            "Accept-Encoding": "identity", // NO compression
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            // Tambahkan hint untuk connection speed
            ...(isSlowConnection && { "X-Connection-Speed": "slow" })
          },
          responseType: "blob", // Essential untuk PDF
          timeout: isSlowConnection ? 90000 : 60000, // Dynamic timeout
          // Axios config untuk mencegah corruption
          validateStatus: function (status) {
            return status >= 200 && status < 300;
          },
          transformResponse: [], // KOSONGKAN transform response
          maxContentLength: 50 * 1024 * 1024, // 50MB limit
          maxBodyLength: 50 * 1024 * 1024,
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
          throw new Error("Empty PDF response received");
        }

        // Additional blob validation
        if (response.data.size < 1000) {
          throw new Error("PDF response too small, possible corruption");
        }

        // Log untuk debugging
        console.log('PDF download success:', {
          size: response.data.size,
          type: response.data.type,
          contentType: response.headers['content-type']
        });

        return {
          data: response.data,
          filename: `hasil-analisa-lengkap-${Date.now()}.pdf`
        };

      } catch (error) {
        console.error('PDF download error:', error);

        if (axios.isAxiosError(error)) {
          // Handle specific axios errors
          if (error.code === 'ECONNABORTED') {
            throw new Error("Download timeout. Silakan coba lagi.");
          }

          if (error.code === 'ERR_NETWORK') {
            throw new Error("Koneksi bermasalah. Periksa internet Anda dan coba lagi.");
          }

          if (error.code === 'ERR_CONTENT_DECODING_FAILED') {
            throw new Error("Server response error. Silakan refresh halaman dan coba lagi.");
          }

          // Handle server errors
          if (error.response?.status === 500) {
            let errorMessage = "Server error saat membuat PDF";
            
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
        throw new Error(`Download gagal: ${errorMessage}`);
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
      console.error('Final PDF download error:', error);
    },
    
    // Success callback
    onSuccess: (data) => {
      console.log('PDF download completed:', {
        size: data.data.size,
        filename: data.filename
      });
    }
  });
}