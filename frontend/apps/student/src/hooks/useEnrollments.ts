import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enroll } from "../api/enrollments.js";

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enroll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["enrolled-courses"] });
    },
  });
};
