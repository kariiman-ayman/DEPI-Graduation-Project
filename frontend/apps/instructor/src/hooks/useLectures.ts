import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadLecture } from "../api/lecture";

export const useUploadLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadLecture,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lectures"],
      });
    },
  });
};
