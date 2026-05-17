import { useQuery } from "@tanstack/react-query";
import { getCourses } from "../api/course.js";

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
};
