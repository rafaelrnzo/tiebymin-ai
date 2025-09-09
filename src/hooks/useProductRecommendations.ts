import { useState, useEffect } from "react";
import { useRecommendations } from "./useRecommendations";
import { useProductCompatibility } from "./useProductCompatibility";
import { Product } from "@/types";

export const useProductRecommendations = (
  resultId: string | null,
  bodyShapeId?: string,
  faceShapeId?: string
) => {
  const [recommendationFilter, setRecommendationFilter] = useState<"hijab" | "clothes">("hijab");

  // Function to generate consistent score based on product ID
  const generateConsistentScore = (productId: string): number => {
    const storageKey = `product_score_${productId}`;
    const storedScore = localStorage.getItem(storageKey);

    if (storedScore) {
      return parseInt(storedScore, 10);
    }

    // Generate score between 80-95 based on product ID hash
    let hash = 0;
    for (let i = 0; i < productId.length; i++) {
      const char = productId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Map hash to 80-95 range
    const score = 80 + Math.abs(hash) % 16;
    localStorage.setItem(storageKey, score.toString());
    return score;
  };

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
    total_compatibility_score: generateConsistentScore(product.id),
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