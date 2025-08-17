import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createAnalysisEmailTemplate } from "./email-template";
import axios from "axios";
import { UserData, AllTips } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface EmailData {
  userData: UserData;
  tips: AllTips;
}

export const sendEmail = async (to: string, data: EmailData, resultId?: string) => {
  try {
    const subject = "Your Tiebymin Analysis Results";
    
    let pdfUrl, storyUrl;
    
    if (resultId) {
      const baseUrl = "https://tiebymin-ai.vercel.app";
      
      pdfUrl = `${baseUrl}/api/generate-pdf?resultId=${resultId}&firstName=${encodeURIComponent(data.userData.name)}`;
      
      storyUrl = `${baseUrl}/api/generate-story?result_id=${resultId}`;
      
      console.log("Created download URLs:", { pdfUrl, storyUrl });
    }
    
    const html = createAnalysisEmailTemplate(data, pdfUrl, storyUrl);
    
    await axios.post("/api/send-mail", { to, subject, html });
    console.log("Email sent successfully with download links");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};