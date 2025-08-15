import { AnalysisData } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createAnalysisEmailTemplate } from "./email-template";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sendEmail = async (to: string, analysisData: AnalysisData) => {
  try {
    const subject = "Your Tiebymin Analysis Results";
    const html = createAnalysisEmailTemplate(analysisData);
    await axios.post("/api/send-mail", { to, subject, html });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};