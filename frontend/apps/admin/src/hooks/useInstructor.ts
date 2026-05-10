import { getInstructors } from "../api/instructor";
import { useQuery } from "@tanstack/react-query";

export const useInstructors = () => {
  return useQuery({
    queryKey: ["instructors"],
    queryFn: getInstructors,
  });
};
