import { useQuery } from "@tanstack/react-query";
import { getMyGrades } from "../api/grades";

export const useMyGrades = () => {
  return useQuery({
    queryKey: ["grades"],
    queryFn: getMyGrades,
  });
};
