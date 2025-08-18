"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
}

export function ErrorModal({ isOpen, onClose, errorMessage }: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#F8B4C4]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-white">
            Oops! Something went wrong.
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center text-white">
          <p>{errorMessage}</p>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={onClose}
            className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
