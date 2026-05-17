import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCourseGrades, upsertGrade } from "../api/grades.js";

export const useCourseGrades = (courseId: string) => {
  return useQuery({
    queryKey: ["grades", courseId],
    queryFn: () => getCourseGrades(courseId),
    enabled: courseId !== "",
  });
};

export const useUpsertGrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertGrade,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["grades"],
      });
    },
  });
};
