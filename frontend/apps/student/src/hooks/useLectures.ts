import { useQuery } from "@tanstack/react-query";
import { getLectures } from "../api/lectures";

export const useLectures = () => {
  return useQuery({
    queryKey: ["lectures"],
    queryFn: getLectures,
  });
};
