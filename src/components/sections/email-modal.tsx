"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useSendEmail,
  useDownloadPdf,
  useGenerateStory,
} from "@/hooks/useAnalysisData";
import { useSearchParams } from "next/navigation";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailModal({ isOpen, onClose }: EmailModalProps) {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result_id");

  const [email, setEmail] = useState("");
  const { mutate: sendEmail, isPending: isSending } = useSendEmail();
  const { refetch: downloadPdf, isFetching: isDownloadingPdf } =
    useDownloadPdf();
  const { refetch: generateStory, isFetching: isGeneratingStory } =
    useGenerateStory();

  const handleSendEmail = async () => {
    if (email && resultId) {
      try {
        const [pdfResult, pngResult] = await Promise.all([
          downloadPdf(),
          generateStory(),
        ]);

        if (pdfResult.data && pngResult.data) {
          sendEmail(
            { email, pdf: pdfResult.data, png: pngResult.data },
            {
              onSuccess: () => {
                console.log("Email sent successfully");
                onClose();
              },
              onError: (error: Error) => {
                console.error("Error sending email:", error);
              },
            }
          );
        } else {
          console.error("Failed to generate PDF or PNG.");
        }
      } catch (error) {
        console.error("Error generating files or sending email:", error);
      }
    }
  };

  const isLoading = isSending || isDownloadingPdf || isGeneratingStory;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Share via Email</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="email"
            placeholder="Enter recipient's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSendEmail} disabled={isLoading || !email}>
            {isLoading
              ? isDownloadingPdf
                ? "Generating PDF..."
                : isGeneratingStory
                ? "Generating Story..."
                : "Sending..."
              : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
