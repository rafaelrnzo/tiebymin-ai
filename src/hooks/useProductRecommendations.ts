import { useState, useEffect } from "react";
import { useRecommendations } from "./useRecommendations";
import { useProductCompatibility } from "./useProductCompatibility";

interface Product {
  id: string;
  name: string;
  images: string[];
  current_price: number;
  original_price: number;
  total_compatibility_score: number;
  average_rating: number;
  color_recommendations?: string[];
  size_range: string;
  product_link: string;
}

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

  // Debug logging
  console.log("useProductRecommendations - Compatibility Data:", compatibilityData);
  console.log("useProductRecommendations - Is Loading Compatibility:", isLoadingCompatibility);
  console.log("useProductRecommendations - Body Shape ID:", bodyShapeId);
  console.log("useProductRecommendations - Face Shape ID:", faceShapeId);
  console.log("useProductRecommendations - Filter:", recommendationFilter);

  const handleFilterChange = (filter: "hijab" | "clothes") => {
    setRecommendationFilter(filter);
  };

  const filteredProducts = recommendationsData
    ? recommendationFilter === "hijab"
      ? recommendationsData.hijab
      : recommendationsData.clothes
    : [];

  const sortedProducts = [...filteredProducts].sort(
    (a: Product, b: Product) => b.total_compatibility_score - a.total_compatibility_score
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
    compatibilityData,
    isLoadingRecommendations,
    isLoadingCompatibility,
  };
};