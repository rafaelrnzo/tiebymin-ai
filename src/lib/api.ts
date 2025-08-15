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
