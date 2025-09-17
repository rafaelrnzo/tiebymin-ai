import { useState, useEffect } from "react";
import { useRecommendations } from "./useRecommendations";
import { useProductCompatibility } from "./useProductCompatibility";
import { Product } from "@/types";
import { generateDeterministicScore } from "@/lib/utils";

export const useProductRecommendations = (
  resultId: string | null,
  bodyShapeId?: string,
  faceShapeId?: string
) => {
  const [recommendationFilter, setRecommendationFilter] = useState<"hijab" | "clothes">("hijab");

  const { data: recommendationsData, isLoading: isLoadingRecommendations } = useRecommendations(resultId);

  const { data: compatibilityData, isLoading: isLoadingCompatibility } = useProductCompatibility(
    resultId,
    recommendationFilter,
    bodyShapeId,
    faceShapeId
  );

  const handleFilterChange = (filter: "hijab" | "clothes") => {
    setRecommendationFilter(filter);
  };

  const baseFilteredProducts = recommendationsData
    ? recommendationFilter === "hijab"
      ? recommendationsData.hijab
      : recommendationsData.clothes
    : [];

  const filteredProducts = baseFilteredProducts.map(product => ({
    ...product,
    compatibility_reason: compatibilityData?.[product.id]?.compatibility_reason || product.compatibility_reason || product.score_breakdown?.reasons?.join(". ") || '',
    total_compatibility_score: generateDeterministicScore(
      product.id,
      resultId || '',
      bodyShapeId,
      faceShapeId,
      recommendationFilter
    ),
  }));

  const sortedProducts = [...filteredProducts].sort(
    (a: Product, b: Product) => {
      const aScore = isNaN(a.total_compatibility_score) ? 0 : a.total_compatibility_score;
      const bScore = isNaN(b.total_compatibility_score) ? 0 : b.total_compatibility_score;
      return bScore - aScore;
    }
  );

  return {
    recommendationFilter,
    handleFilterChange,
    filteredProducts,
    sortedProducts,
    isLoadingRecommendations,
    isLoadingCompatibility,
  };
};