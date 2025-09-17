import { secureUrl } from "@/lib/api";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("userToken");

      const response = await axios.get(secureUrl("/v1/products/"), {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        }
      });

      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};