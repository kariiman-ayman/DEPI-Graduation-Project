import { useQuery } from "@tanstack/react-query";
import { getAllPayments } from "../api/payments";

export const useAllPayments = () => {
  return useQuery({
    queryKey: ["admin-payments"],
    queryFn: getAllPayments,
  });
};
