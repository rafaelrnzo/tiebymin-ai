"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string, dontShowAgain: boolean) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleStarClick = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    onSubmit(rating, feedback, dontShowAgain);
    onClose();
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("feedbackDismissed", "true");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#FFC6C6]">
        <DialogHeader>
          <DialogTitle>Beri Kami Masukan</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <p className="text-center text-lg font-medium mb-2">
              Seberapa puas Anda dengan hasilnya?
            </p>
            <div className="flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer ${
                    star <= rating ? "text-yellow-400" : "text-black"
                  }`}
                  fill={star <= rating ? "currentColor" : "none"}
                  onClick={() => handleStarClick(star)}
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-lg font-medium mb-2">
              Apa saran Anda untuk kami?
            </p>
            <Textarea
              value={feedback}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFeedback(e.target.value)
              }
              placeholder="Tuliskan masukan Anda di sini..."
              rows={4}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dontShowAgain"
              checked={dontShowAgain}
              onCheckedChange={(checked) =>
                setDontShowAgain(checked as boolean)
              }
            />
            <label
              htmlFor="dontShowAgain"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Jangan tampilkan lagi
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>Kirim</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
