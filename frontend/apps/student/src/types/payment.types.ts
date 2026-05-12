export type PaymentStatus = "pending" | "paid" | "overdue";
export type PaymentMethod = "bank_transfer" | "online" | "cash";

export interface Payment {
  id: string;
  courseId: string;
  courseName: string;
  amount: number;
  description: string;
  status: PaymentStatus;
  dueDate: string;
  method: PaymentMethod | null;
  paidAt: string | null;
  transactionId: string | null;
}

export interface PaymentsResponse {
  payments: Payment[];
  totalFee: number;
  totalPaid: number;
  totalOutstanding: number;
}

export interface PayInstallmentDTO {
  paymentId: string;
  method: PaymentMethod;
}

export interface PayInstallmentResult {
  success: boolean;
  transactionId: string;
  paidAt: string;
}
