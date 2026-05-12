import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyPayments, payInstallment } from "../api/payments";
import type { PayInstallmentDTO } from "../types/payment.types";

export const useMyPayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: getMyPayments,
  });
};

export const usePayInstallment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: PayInstallmentDTO) => payInstallment(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};
