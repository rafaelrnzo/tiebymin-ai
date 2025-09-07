import { useState } from "react";
import { useCreatePayment } from "./useAnalysisData";
import { useToast } from "./useToast";

export const usePaymentHandler = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const { mutateAsync: createPayment } = useCreatePayment();
  const { showToast } = useToast();

  const handlePayment = async () => {
    try {
      setIsPaymentProcessing(true);

      // Get stored data
      if (typeof window === "undefined") return;

      const storedData = localStorage.getItem("tiebymin-analysis-data");
      const userId = localStorage.getItem("userId");
      const capturedImage = localStorage.getItem("capturedImage");
      const uploadedImage = localStorage.getItem("uploadedFaceImage");

      if (!storedData || !userId) {
        throw new Error(
          "Data analisis tidak ditemukan. Silakan mulai ulang proses analisis."
        );
      }

      const analysisData = JSON.parse(storedData);
      const { tinggi, berat, umur, body_shape_id } = analysisData;

      // Get image data
      let imageBlob: Blob | null = null;
      if (capturedImage) {
        // Convert base64 to blob
        const response = await fetch(capturedImage);
        imageBlob = await response.blob();
      } else if (uploadedImage) {
        // Convert base64 to blob
        const response = await fetch(uploadedImage);
        imageBlob = await response.blob();
      }

      if (!imageBlob) {
        throw new Error(
          "Foto wajah tidak ditemukan. Silakan ambil foto ulang."
        );
      }

      // Create payment
      const result = await createPayment({
        user_id: userId,
        tinggi_badan: parseFloat(tinggi),
        berat_badan: parseFloat(berat),
        umur: parseInt(umur),
        body_shape_id: body_shape_id,
        amount: 10000,
        foto_wajah: imageBlob,
      });

      if (result && result.redirect_url) {
        // Close payment modal
        setIsPaymentModalOpen(false);

        // Redirect to payment page
        window.location.href = result.redirect_url;
      } else {
        throw new Error("Pembayaran gagal diproses. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      const err = error as Error;
      throw new Error(
        err.message ||
          "Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi."
      );
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  return {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    isPaymentProcessing,
    handlePayment,
  };
};