import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLectures, uploadLecture } from "../api/lecture";

export const useLectures = (courseId?: string) =>
  useQuery({
    queryKey: ["lectures", courseId ?? "all"],
    queryFn: () => getLectures(courseId),
  });

export const useUploadLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadLecture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
    },
  });
};
