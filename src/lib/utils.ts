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

export const sendEmail = async (to: string, data: EmailData) => {
  try {
    const subject = "Your Tiebymin Analysis Results";
    const html = createAnalysisEmailTemplate(data);
    await axios.post("/api/send-mail", { to, subject, html });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};