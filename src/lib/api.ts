import url from "@/lib/url";
import axios from "axios";

export function secureUrl(endpoint: string): string {
  let fullUrl = endpoint.startsWith("http") ? endpoint : `${url}${endpoint}`;
  if (process.env.NODE_ENV === "production" && fullUrl.startsWith("http://")) {
    fullUrl = fullUrl.replace("http://", "https://");
  }
  return fullUrl;
}

export const submitFeedback = async (data: {
  user_id: string;
  analysis_result_id: string;
  feedback_type: string;
  feedback_comment: string;
  user_rating: number;
}) => {
  const response = await axios.post(secureUrl("/analysis-feedback/"), data);
  return response.data;
};

export const sendEmail = async (data: {
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
};
