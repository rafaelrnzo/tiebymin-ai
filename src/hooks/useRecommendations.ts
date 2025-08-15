import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { secureUrl } from "@/lib/api";
import { Product } from "@/types";

interface RecommendationsResponse {
  hijab: Product[];
  clothes: Product[];
}

const fetchRecommendations = async (
  analysisResultId: string | null
): Promise<RecommendationsResponse> => {
  if (!analysisResultId) {
    throw new Error("Analysis Result ID is required");
  }
  const response = await axios.get(
    secureUrl(`/v1/recommendations/${analysisResultId}`)
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