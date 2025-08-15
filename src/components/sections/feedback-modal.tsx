"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Send, Star } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useSubmitFeedback } from "@/hooks/useSubmitFeedback";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  analysisResultId: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  userId,
  analysisResultId,
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { mutate: submitFeedback, isPending } = useSubmitFeedback();

  const handleStarClick = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    submitFeedback(
      {
        user_id: userId,
        analysis_result_id: analysisResultId,
        feedback_type: "accurate",
        feedback_comment: feedback,
        user_rating: rating,
      },
      {
        onSuccess: () => {
          if (dontShowAgain) {
            localStorage.setItem("feedbackDismissed", "true");
          }
          onClose();
        },
        onError: (error) => {
          console.error("Error submitting feedback:", error);
        },
      }
    );
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("feedbackDismissed", "true");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] bg-[#1E1E1E] text-white rounded-2xl border-0">
        <DialogHeader className="flex justify-start items-start">
          <DialogTitle className="font-oswald text-2xl font-bold text-start">
            Beri kami masukan
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <p className="text-start text-sm mb-3 font-poppins">
            Seberapa puas anda dengan hasilnya?
          </p>
          <div className="mb-4">
            <div className="flex justify-center gap-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                    star <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : " fill-[#F0F0F0]"
                  }`}
                  fill={star <= rating ? "currentColor" : "none"}
                  onClick={() => handleStarClick(star)}
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm mb-4 font-poppins">
              Apa saran anda untuk kami?
            </p>
            <Textarea
              className="bg-[#F0F0F0] text-black placeholder-gray-400 resize-none h-[150px]"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tuliskan masukan anda disini..."
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <Checkbox
              id="dontShowAgain"
              checked={dontShowAgain}
              onCheckedChange={(checked) =>
                setDontShowAgain(checked as boolean)
              }
            />
            <label
              htmlFor="dontShowAgain"
              className="text-xs cursor-pointer font-poppins"
            >
              Jangan tampilkan lagi
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-gray-500 text-white hover:bg-gray-700"
              onClick={handleClose}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              className="bg-[#EF789B] hover:bg-pink-400 text-white flex items-center gap-2"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                "Mengirim..."
              ) : (
                <>
                  <Send /> Kirim
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
