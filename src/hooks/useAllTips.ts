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

    const [faceRes, colorRes, bodyRes, bmiRes] = await Promise.all([
      axios.get(secureUrl(`/v1/face-shapes/${face_shape_id}`)),
      axios.get(secureUrl(`/v1/color-analysis/${color_analysis_id}`)),
      axios.get(secureUrl(`/v1/body-shapes/${body_shape_id}`)),
      axios.get(secureUrl(`/v1/bmi-categories/${bmi_category_id}`)),
    ]);

    return {
      faceTip: faceRes.data.tips_bentuk_wajah,
      bodyTip: bodyRes.data.body_tips_summary,
      colorTip: colorRes.data.color_tips_summary,
      bmiTip: bmiRes.data.tips_fashion,
      makeupTip: colorRes.data.make_up_tips,
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
