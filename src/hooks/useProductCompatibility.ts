import { useQuery } from "@tanstack/react-query";
import { secureUrl } from "@/lib/api";
import axios from "axios";

interface CompatibilityData {
  product_id: string;
  body_shape_id?: string;
  face_shape_id?: string;
  compatibility_score: number;
  compatibility_reason: string;
  id: string;
  created_at: string;
}

interface ProductCompatibility {
  [productId: string]: {
    compatibility_score: number;
    compatibility_reason: string;
  };
}

export const useProductCompatibility = (
  resultId: string | null,
  filter: "hijab" | "clothes",
  bodyShapeId?: string,
  faceShapeId?: string
) => {
  return useQuery({
    queryKey: ["productCompatibility", resultId, filter, bodyShapeId, faceShapeId],
    queryFn: async (): Promise<ProductCompatibility> => {
      if (!resultId) return {};

      const userShapeId = filter === "clothes" ? bodyShapeId : faceShapeId;
      if (!userShapeId) return {};

      const endpoint = filter === "clothes"
        ? `${secureUrl("/v1/product-body-shape-compatibility/")}`
        : `${secureUrl("/v1/product-face-shape-compatibility/")}`;

      try {
        const token =
          localStorage.getItem("accessToken") ||
          localStorage.getItem("userToken");

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data: CompatibilityData[] = response.data;

        // Filter data berdasarkan body_shape_id atau face_shape_id user
        const filteredData = data.filter((item) => {
          if (filter === "clothes") {
            return item.body_shape_id === userShapeId;
          } else {
            return item.face_shape_id === userShapeId;
          }
        });

        console.log("useProductCompatibility - Debug Info:");
        console.log("Filter:", filter);
        console.log("User Shape ID:", userShapeId);
        console.log("Total data from API:", data.length);
        console.log("Filtered data:", filteredData.length);
        console.log("Filtered items:", filteredData);

        // Transform data into a map keyed by product_id
        const compatibilityMap: ProductCompatibility = {};
        filteredData.forEach((item) => {
          compatibilityMap[item.product_id] = {
            compatibility_score: item.compatibility_score,
            compatibility_reason: item.compatibility_reason,
          };
        });

        console.log("Final compatibility map:", compatibilityMap);

        return compatibilityMap;
      } catch (error) {
        console.error("Error fetching product compatibility:", error);
        return {};
      }
    },
    enabled: !!resultId && !!(filter === "clothes" ? bodyShapeId : faceShapeId),
  });
};