// hooks/useAllTips.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { secureUrl } from "@/lib/api";
import { AllTips, AnalysisData } from "@/types";

interface UseAllTipsProps {
  analysisData: AnalysisData;
  enabled?: boolean;
}

export const useAllTips = ({
  analysisData,
  enabled = true,
}: UseAllTipsProps) => {
  const {
    face_shape_id,
    color_analysis_id,
    body_shape_id,
    bmi_category_id,
  } = analysisData || {};

  const fetchAllTips = async (): Promise<AllTips> => {
    if (
      !face_shape_id ||
      !color_analysis_id ||
      !body_shape_id ||
      !bmi_category_id
    ) {
      throw new Error("Data ID tidak lengkap untuk merangkum semua tips.");
    }
        const token = localStorage.getItem("accessToken") || localStorage.getItem("userToken");

    const [faceRes, colorRes, bodyRes, bmiRes] = await Promise.all([
      axios.get(secureUrl(`/v1/face-shapes/${face_shape_id}`), {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }),
      axios.get(secureUrl(`/v1/color-analysis/${color_analysis_id}`), {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }),
      axios.get(secureUrl(`/v1/body-shapes/${body_shape_id}`), {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }),
      axios.get(secureUrl(`/v1/bmi-categories/${bmi_category_id}`), {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }),
    ]);
    return {
      faceTip: faceRes.data.tips_bentuk_wajah || faceRes.data.tips_face_shape || "Tips bentuk wajah tidak tersedia",
      bodyTip: bodyRes.data.tips_body_shape || "Tips bentuk tubuh tidak tersedia",
      colorTip: colorRes.data.color_tips_summary || colorRes.data.tips_warna_kulit_pakaian || "Tips warna kulit tidak tersedia",
      bmiTip: bmiRes.data.tips_fashion || "Tips fashion tidak tersedia",
      makeupTip: colorRes.data.make_up_tips || "Tips makeup tidak tersedia",
    };
  };

  return useQuery({
    queryKey: [
      "allTips",
      face_shape_id,
      color_analysis_id,
      body_shape_id,
      bmi_category_id,
    ],
    queryFn: fetchAllTips,
    enabled:
      enabled &&
      !!(
        face_shape_id &&
        color_analysis_id &&
        body_shape_id &&
        bmi_category_id
      ),
    staleTime: 5 * 60 * 1000, // 5 menit
    retry: 2,
    retryDelay: 1000,
  });
};
