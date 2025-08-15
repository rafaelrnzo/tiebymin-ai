import url from "@/lib/url";

export function secureUrl(endpoint: string): string {
  let fullUrl = endpoint.startsWith("http") ? endpoint : `${url}${endpoint}`;
  if (process.env.NODE_ENV === "production" && fullUrl.startsWith("http://")) {
    fullUrl = fullUrl.replace("http://", "https://");
  }
  return fullUrl;
}

export const postFeedback = async ({
  resultId,
  rating,
  feedback,
}: {
  resultId: string;
  rating: number;
  feedback: string;
}) => {
  const response = await fetch(secureUrl("/feedback"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ result_id: resultId, rating, feedback }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to submit feedback");
  }

  return response.json();
};