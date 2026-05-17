import { getInstructors } from "../api/instructor.js";
import { useQuery } from "@tanstack/react-query";

export const useInstructors = () => {
  return useQuery({
    queryKey: ["instructors"],
    queryFn: getInstructors,
  });
};
