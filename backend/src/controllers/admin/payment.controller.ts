import type { Response } from "express";
import { db } from "../../config/firebase";
import type { AuthRequest } from "../../types/request.types";

// ---------------------------------------------------------------------------
// GET /admin/payments
// Returns all payment records across all students, enriched with names.
// ---------------------------------------------------------------------------

export const getAllPayments = async (_req: AuthRequest, res: Response) => {
  try {
    const paymentsSnap = await db.collection("payments").get();

    if (paymentsSnap.empty) {
      return res.json({
        payments: [],
        totalCollected: 0,
        totalOutstanding: 0,
        totalOverdue: 0,
        totalStudents: 0,
      });
    }

    const today = new Date().toISOString().split("T")[0];
    const rawPayments = paymentsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as any[];

    // Collect unique student and course IDs
    const studentIds = [
      ...new Set(rawPayments.map((p) => p.studentId as string)),
    ];
    const courseIds = [
      ...new Set(rawPayments.map((p) => p.courseId as string)),
    ];

    // Fetch users and courses in parallel
    const [userDocs, courseDocs] = await Promise.all([
      Promise.all(studentIds.map((id) => db.collection("users").doc(id).get())),
      Promise.all(
        courseIds.map((id) => db.collection("courses").doc(id).get()),
      ),
    ]);

    const userMap = new Map(userDocs.map((d) => [d.id, d.data()]));
    const courseMap = new Map(courseDocs.map((d) => [d.id, d.data()]));

    let totalCollected = 0;
    let totalOutstanding = 0;
    let totalOverdue = 0;

    const payments = rawPayments.map((p) => {
      const effectiveStatus: string =
        p.status === "paid"
          ? "paid"
          : (p.dueDate as string) < today
            ? "overdue"
            : "pending";

      const amount = p.amount as number;
      if (effectiveStatus === "paid") totalCollected += amount;
      else if (effectiveStatus === "overdue") totalOverdue += amount;
      else totalOutstanding += amount;

      return {
        id: p.id,
        studentId: p.studentId,
        studentName: userMap.get(p.studentId)?.name ?? "Unknown",
        studentEmail: userMap.get(p.studentId)?.email ?? "",
        courseId: p.courseId,
        courseName: courseMap.get(p.courseId)?.title ?? "Unknown",
        amount,
        description: p.description,
        status: effectiveStatus,
        dueDate: p.dueDate,
        method: p.method ?? null,
        paidAt: p.paidAt?.toDate?.()?.toISOString?.() ?? null,
        transactionId: p.transactionId ?? null,
      };
    });

    // Sort: overdue → pending → paid, then by dueDate
    const order: Record<string, number> = { overdue: 0, pending: 1, paid: 2 };
    payments.sort((a, b) => {
      const statusDiff = order[a.status] - order[b.status];
      if (statusDiff !== 0) return statusDiff;
      return a.dueDate.localeCompare(b.dueDate);
    });

    return res.json({
      payments,
      totalCollected,
      totalOutstanding,
      totalOverdue,
      totalStudents: studentIds.length,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
