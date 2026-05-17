import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCourseAttendance, saveAttendance } from "../api/attendance";
import type { SaveAttendanceDTO } from "../types/attendance.types";

export const useCourseAttendance = (courseId: string, date: string) => {
  return useQuery({
    queryKey: ["attendance", courseId, date],
    queryFn: () => getCourseAttendance(courseId, date),
    enabled: courseId !== "",
  });
};

export const useSaveAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: SaveAttendanceDTO) => saveAttendance(dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", variables.courseId],
      });
    },
  });
};
