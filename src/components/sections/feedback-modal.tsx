"use client";

import { useSubmitFeedback } from "@/hooks/useSubmitFeedback";
import { Send, Star } from "lucide-react";
import { useState } from "react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  analysisResultId: string;
}

function FeedbackModal({
  isOpen,
  onClose,
  userId,
  analysisResultId,
}: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { mutate: submitFeedback, isPending } = useSubmitFeedback();
  const handleStarClick = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    // Validate required fields
    if (rating === 0) {
      alert("Silakan pilih rating terlebih dahulu");
      return;
    }

    if (!userId) {
      alert("User ID tidak ditemukan. Silakan refresh halaman dan coba lagi.");
      console.error("User ID is missing:", { userId, analysisResultId });
      return;
    }

    const feedbackData = {
      user_id: userId,
      analysis_result_id: analysisResultId,
      feedback_type: "accurate",
      feedback_comment: feedback || "", // Allow empty feedback
      user_rating: rating,
    };

    console.log("Submitting feedback:", feedbackData); // Debug log

    submitFeedback(feedbackData, {
      onSuccess: () => {
        console.log("Feedback submitted successfully");
        localStorage.setItem("feedbackDismissed", "true");

        onClose();
      },
      onError: (error) => {
        console.error("Error submitting feedback:", error);
        alert("Terjadi kesalahan saat mengirim feedback. Silakan coba lagi.");
      },
    });
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#323232]/80" onClick={handleClose} />

      {/* Modal with mobile margins */}
      <div className="relative mx-4 sm:mx-0 w-full sm:max-w-[420px] bg-[#323232] text-[#f0f0f0] rounded-2xl border-0 p-6">
        <div className="flex justify-start items-start mb-4">
          <h2 className="text-2xl font-bold text-start">Beri kami masukan</h2>
          <button
            onClick={handleClose}
            className="ml-auto text-gray-400 hover:text-[#f0f0f0]"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-start text-sm mb-3">
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
                      : "text-gray-400 fill-gray-400"
                  }`}
                  onClick={() => handleStarClick(star)}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm mb-4">Apa saran anda untuk kami?</p>
            <textarea
              className="w-full bg-gray-100 text-gray-800 placeholder-gray-400 resize-none h-[150px] rounded-lg p-3 border-0"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tuliskan masukan anda disini..."
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={(e) => {
                const isChecked = (e.target as HTMLInputElement).checked;
                setDontShowAgain(isChecked);
                if (isChecked) {
                  localStorage.setItem("feedbackDismissed", "true");
                  onClose();
                }
              }}
              className="rounded"
            />
            <label htmlFor="dontShowAgain" className="text-xs cursor-pointer">
              Jangan tampilkan lagi
            </label>
          </div>

          <div className="flex gap-3 ">
            <button
              className="border border-gray-500 text-[#f0f0f0] hover:bg-gray-700 py-2 px-4 rounded-lg transition-colors"
              onClick={handleClose}
              disabled={isPending}
            >
              Batal
            </button>
            <button
              className=" bg-pink-400 hover:bg-pink-500 text-[#f0f0f0] flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                "Mengirim..."
              ) : (
                <>
                  <Send />
                  <span>Kirim</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackModal;
