import { secureUrl } from "@/lib/api";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface RecommendationsResponse {
  hijab: Product[];
  clothes: Product[];
}

const fetchRecommendations = async (
  analysisResultId: string | null
): Promise<RecommendationsResponse> => {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("userToken");

  if (!analysisResultId) {
    throw new Error("Analysis Result ID is required");
  }
  const response = await axios.get(
    secureUrl(`/v1/recommendations/${analysisResultId}`),{
      headers:{
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      }
    }
  );
  return response.data;
};

export const useRecommendations = (analysisResultId: string | null) => {
  return useQuery<RecommendationsResponse, Error>({
    queryKey: ["recommendations", analysisResultId],
    queryFn: () => fetchRecommendations(analysisResultId),
    enabled: !!analysisResultId, // Only run the query if analysisResultId is not null
  });
};