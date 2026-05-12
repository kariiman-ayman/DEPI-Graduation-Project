import api from "_core/api";

export type PaymentStatus = "pending" | "paid" | "overdue";

export interface AdminPayment {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseName: string;
  amount: number;
  description: string;
  status: PaymentStatus;
  dueDate: string;
  method: string | null;
  paidAt: string | null;
  transactionId: string | null;
}

export interface AdminPaymentsResponse {
  payments: AdminPayment[];
  totalCollected: number;
  totalOutstanding: number;
  totalOverdue: number;
  totalStudents: number;
}

export const getAllPayments = async (): Promise<AdminPaymentsResponse> => {
  const res = await api.get("/admin/payments");
  return res.data;
};
