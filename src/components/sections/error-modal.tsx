"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TriangleAlert } from "lucide-react";

// Mendefinisikan tipe props untuk komponen ErrorModal
interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
}

export function ErrorModal({ isOpen, onClose, errorMessage }: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] bg-[#f0f0f0] rounded-2xl p-8 px-4 sm:px-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="flex justify-center">
            <TriangleAlert
              className="w-16 h-16 text-[#f0f0f0] fill-[#EF789B]"
              strokeWidth={1.5}
            />
          </div>

          <div className="text-center font-poppins">
            <p className="text-lg font-medium text-gray-800">{errorMessage}</p>
          </div>

          <div className="w-full pt-4">
            <Button
              onClick={onClose}
              className="w-full bg-[#323232] text-white py-6 rounded-xl text-md font-semibold hover:bg-gray-700 transition-colors"
            >
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
