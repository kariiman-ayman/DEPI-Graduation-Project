import api from "_core/api";
import type {
  PaymentsResponse,
  PayInstallmentDTO,
  PayInstallmentResult,
} from "../types/payment.types";

export const getMyPayments = async (): Promise<PaymentsResponse> => {
  const res = await api.get("/student/payments");
  return res.data;
};

export const payInstallment = async ({
  paymentId,
  method,
}: PayInstallmentDTO): Promise<PayInstallmentResult> => {
  const res = await api.post(`/student/payments/${paymentId}/pay`, { method });
  return res.data;
};
