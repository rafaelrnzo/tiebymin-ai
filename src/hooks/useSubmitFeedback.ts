import { useMutation } from "@tanstack/react-query";
import { submitFeedback } from "@/lib/api";

export const useSubmitFeedback = () => {
  return useMutation({
    mutationFn: submitFeedback,
  });
};
