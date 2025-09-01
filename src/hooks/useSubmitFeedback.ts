import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { secureUrl } from "@/lib/api";

export const useSubmitFeedback = () => {
  return useMutation({
    mutationFn: async (data: {
      user_id: string;
      analysis_result_id: string;
      feedback_type: string;
      feedback_comment: string;
      user_rating: number;
    }) => {
      const response = await axios.post(secureUrl("/analysis-feedback/"), data);
      return response.data;
    },
  });
};
