import { useQuery } from "@tanstack/react-query";
import { getMyAttendance } from "../api/attendance";

export const useMyAttendance = () => {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: getMyAttendance,
  });
};
