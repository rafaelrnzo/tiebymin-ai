"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TriangleAlert } from "lucide-react";

// Mendefinisikan tipe props untuk komponen ErrorModal
interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  onLogout?: () => void;
}

export function ErrorModal({
  isOpen,
  onClose,
  errorMessage,
  onLogout,
}: ErrorModalProps) {
  // Function to convert technical error messages to user-friendly ones
  const getUserFriendlyMessage = (message: string): string => {
    // Check for common technical error patterns
    if (/^\d+$/.test(message)) {
      // Pure number (like "404")
      const statusCode = parseInt(message);
      switch (statusCode) {
        case 400:
          return "Permintaan tidak valid. Mohon periksa data yang Anda masukkan.";
        case 401:
          return "Sesi Anda telah berakhir. Silakan login kembali.";
        case 403:
          return "Anda tidak memiliki akses untuk fitur ini.";
        case 404:
          return "Data yang Anda cari tidak ditemukan.";
        case 422:
          return "Data yang dikirim tidak valid. Mohon periksa dan coba lagi.";
        case 500:
          return "Server sedang mengalami masalah. Silakan coba lagi nanti.";
        case 502:
        case 503:
        case 504:
          return "Layanan sedang tidak tersedia. Silakan coba lagi dalam beberapa saat.";
        default:
          return "Terjadi kesalahan saat memproses permintaan Anda.";
      }
    }

    // Check for HTTP status patterns like "404 Not Found"
    if (/^\d{3}\s/.test(message)) {
      const statusCode = parseInt(message.split(" ")[0]);
      return getUserFriendlyMessage(statusCode.toString());
    }

    // Check for network errors
    if (message.includes("Network Error") || message.includes("ECONNREFUSED")) {
      return "Koneksi internet bermasalah. Mohon periksa koneksi Anda dan coba lagi.";
    }

    // Check for timeout errors
    if (message.includes("timeout") || message.includes("Timeout")) {
      return "Permintaan memakan waktu terlalu lama. Silakan coba lagi.";
    }

    // If message is already user-friendly or empty, return as is
    if (!message || message.length === 0) {
      return "Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.";
    }

    // Return the original message if it's already user-friendly
    return message;
  };

  const friendlyMessage = getUserFriendlyMessage(errorMessage);

  // Check if this is an order-related error that should trigger logout
  const isOrderError =
    errorMessage.includes("Order tidak ditemukan") ||
    errorMessage.includes("tidak valid") ||
    errorMessage.includes("Order");

  const handleButtonClick = () => {
    if (isOrderError && onLogout) {
      onLogout();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[350px] lg:max-w-[650px] bg-[#f0f0f0] rounded-2xl p-8 px-6 sm:px-8">
        <DialogTitle className="sr-only">Error Notification</DialogTitle>
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="flex justify-center">
            <TriangleAlert
              className="w-16 h-16 text-[#f0f0f0] fill-[#EF789B]"
              strokeWidth={1.5}
            />
          </div>

          <div className="text-center font-poppins">
            <p className="text-lg font-medium text-gray-800">
              {friendlyMessage}
            </p>
          </div>

          <div className="w-full pt-4">
            <Button
              onClick={handleButtonClick}
              className="w-full bg-[#323232] text-[#f0f0f0] py-6 rounded-xl text-md font-semibold hover:bg-gray-700 transition-colors"
            >
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
