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
  const [topProductScores, setTopProductScores] = useState<Map<string, number>>(new Map());

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
    compatibility_reason: compatibilityData?.[product.id]?.compatibility_reason || '',
    total_compatibility_score: compatibilityData?.[product.id]?.compatibility_score ?? product.total_compatibility_score,
  }));

  const sortedProducts = [...filteredProducts].sort(
    (a: Product, b: Product) => {
      const aScore = isNaN(a.total_compatibility_score) ? 0 : a.total_compatibility_score;
      const bScore = isNaN(b.total_compatibility_score) ? 0 : b.total_compatibility_score;
      return bScore - aScore;
    }
  );

  useEffect(() => {
    if (sortedProducts.length > 0) {
      const possibleScores = [90, 91, 92, 93, 94, 95];

      for (let i = possibleScores.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [possibleScores[i], possibleScores[j]] = [
          possibleScores[j],
          possibleScores[i],
        ];
      }

      const newScores = new Map<string, number>();
      const topThree = sortedProducts.slice(0, 3);

      topThree.forEach((product, index) => {
        if (possibleScores[index] !== undefined) {
          newScores.set(product.id, possibleScores[index]);
        }
      });

      setTopProductScores(newScores);
    }
  }, [recommendationsData]);

  return {
    recommendationFilter,
    handleFilterChange,
    filteredProducts,
    sortedProducts,
    topProductScores,
    isLoadingRecommendations,
    isLoadingCompatibility,
  };
};