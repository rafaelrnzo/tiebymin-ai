import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { createAnalysisEmailTemplate } from "@/lib/email-template";
import { UserData, AllTips } from "@/types";

interface EmailData {
  userData: UserData;
  tips: AllTips;
}

export const useSendEmail = () => {
  return useMutation({
    mutationFn: async ({ to, data, resultId }: { to: string; data: EmailData; resultId?: string }) => {
      const subject = "Your Tiebymin Analysis Results";

      let pdfUrl, storyUrl;

      if (resultId) {
        const baseUrl = "https://tiebymin-ai.vercel.app";

        pdfUrl = `${baseUrl}/api/generate-pdf?resultId=${resultId}&firstName=${encodeURIComponent(data.userData.name)}`;

        storyUrl = `${baseUrl}/api/generate-story?result_id=${resultId}`;

        console.log("Created download URLs:", { pdfUrl, storyUrl });
      }

      const html = createAnalysisEmailTemplate(data, pdfUrl, storyUrl);

      const response = await axios.post("/api/send-mail", { to, subject, html });
      console.log("Email sent successfully with download links");
      return response.data;
    },
    onError: (error) => {
      console.error("Error sending email:", error);
    },
  });
};

export const useSendEmailWithAttachments = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      pdf: Blob;
      png: Blob;
    }) => {
      const formData = new FormData();
      formData.append("to", data.email);
      formData.append("subject", "Your Tiebymin Analysis Result");
      formData.append(
        "html",
        "<p>Here are your analysis results, attached as a PDF and PNG.</p>"
      );
      formData.append("pdf", data.pdf, "analysis-result.pdf");
      formData.append("png", data.png, "story-result.png");

      const response = await axios.post("/api/send-mail", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });
};