import React from "react";
import Image from "next/image";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: () => void;
  isProcessing?: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onProceedToPayment,
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed w-full inset-0 z-50 flex items-center justify-center bg-[#323232]/50 p-4">
      <div className="bg-[#f0f0f0] rounded-2xl p-8 shadow-2xl w-full max-w-xl">
        <div className="flex lg:flex-row flex-col items-center gap-6">
          {/* Lock Icon */}
          <div className="flex-shrink-0">
            <Image
              src="/lock.webp"
              alt="Lock Icon"
              width={186}
              height={186}
              className="max-w-[186px] h-auto mb-6"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h2 className="text-2xl text-[#323232] mb-3 font-oswald font-bold">
              Lihat Sekarang
            </h2>

            <p className="text-[#323232] text-sm mb-4 leading-relaxed font-poppins">
              Kamu nggak perlu terbang ke Korea untuk tahu bentuk wajah dan tone
              kulitmu. Semua jawabannya ada di sini
            </p>

            <div className="flex flex-col items-baseline mb-4">
              <p className="text-sm text-[#323232]/50 line-through mr-2 font-poppins">
                Rp 20,000
              </p>
              <p className="text-2xl text-[#323232] font-bold font-poppins">
                Rp 9,999
              </p>
            </div>

            <button
              onClick={onProceedToPayment}
              disabled={isProcessing}
              className="w-full py-3 mt-auto rounded-xl transition-colors font-oswald font-bold text-base text-white bg-[#EF789B] hover:bg-[#E666A0] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                "Bayar Sekarang"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
