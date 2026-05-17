import type { Response } from "express";
import { db } from "../../config/firebase";
import type { AuthRequest } from "../../types/request.types";

const FEE_PER_CREDIT = 500; // $500 per credit hour

function generateTxId(): string {
  return `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

// ---------------------------------------------------------------------------
// GET /student/payments
// Auto-creates a payment record for any enrolled course that has none yet.
// ---------------------------------------------------------------------------

export const getMyPayments = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.uid;

    // Fetch enrollments (single-field query)
    const enrollmentsSnap = await db
      .collection("enrollments")
      .where("studentId", "==", studentId)
      .get();

    const enrollments = enrollmentsSnap.docs
      .filter((d) => !d.data().status || d.data().status === "active")
      .map((d) => ({
        courseId: d.data().courseId as string,
        enrolledAt: d.data().enrolledAt?.toDate?.() ?? new Date(),
      }));

    if (enrollments.length === 0) {
      return res.json({
        payments: [],
        totalFee: 0,
        totalPaid: 0,
        totalOutstanding: 0,
      });
    }

    const courseIds = enrollments.map((e) => e.courseId);

    // Fetch course docs and existing payment records in parallel
    const [courseDocs, paymentsSnap] = await Promise.all([
      Promise.all(
        courseIds.map((id) => db.collection("courses").doc(id).get()),
      ),
      db.collection("payments").where("studentId", "==", studentId).get(),
    ]);

    const courseMap = new Map(courseDocs.map((d) => [d.id, d.data()]));
    const existingPayments = new Map(
      paymentsSnap.docs.map((d) => [
        d.data().courseId as string,
        { id: d.id, ...d.data() },
      ]),
    );

    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    // Auto-create missing payment records
    const toCreate = enrollments.filter(
      (e) => !existingPayments.has(e.courseId),
    );

    if (toCreate.length > 0) {
      await Promise.all(
        toCreate.map((e) => {
          const course = courseMap.get(e.courseId);
          const credits: number = course?.credits ?? 3;
          const amount = credits * FEE_PER_CREDIT;
          const due = new Date(e.enrolledAt);
          due.setDate(due.getDate() + 30);
          const dueDate = due.toISOString().split("T")[0];

          return db.collection("payments").add({
            studentId,
            courseId: e.courseId,
            amount,
            description: `Tuition — ${course?.title ?? "Course"}`,
            status: "pending",
            dueDate,
            method: null,
            paidAt: null,
            transactionId: null,
            createdAt: now,
          });
        }),
      );

      // Re-fetch after creation
      const refreshed = await db
        .collection("payments")
        .where("studentId", "==", studentId)
        .get();
      refreshed.docs.forEach((d) => {
        existingPayments.set(d.data().courseId as string, {
          id: d.id,
          ...d.data(),
        });
      });
    }

    // Build response, computing effective status in memory
    let totalFee = 0;
    let totalPaid = 0;

    const payments = [...existingPayments.values()].map((p: any) => {
      const effectiveStatus =
        p.status === "paid"
          ? "paid"
          : p.dueDate < today
            ? "overdue"
            : "pending";

      totalFee += p.amount as number;
      if (effectiveStatus === "paid") totalPaid += p.amount as number;

      const course = courseMap.get(p.courseId);

      return {
        id: p.id,
        courseId: p.courseId,
        courseName: course?.title ?? "Unknown",
        amount: p.amount,
        description: p.description,
        status: effectiveStatus,
        dueDate: p.dueDate,
        method: p.method ?? null,
        paidAt: p.paidAt?.toDate?.()?.toISOString?.() ?? null,
        transactionId: p.transactionId ?? null,
      };
    });

    // Sort: overdue first, then pending, then paid
    const order = { overdue: 0, pending: 1, paid: 2 };
    payments.sort(
      (a, b) =>
        order[a.status as keyof typeof order] -
        order[b.status as keyof typeof order],
    );

    return res.json({
      payments,
      totalFee,
      totalPaid,
      totalOutstanding: totalFee - totalPaid,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// POST /student/payments/:paymentId/pay
// Body: { method: "bank_transfer" | "online" | "cash" }
// ---------------------------------------------------------------------------

export const payInstallment = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.uid;
    const { paymentId } = req.params;
    const { method } = req.body as {
      method: "bank_transfer" | "online" | "cash";
    };

    const validMethods = ["bank_transfer", "online", "cash"];
    if (!validMethods.includes(method)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const docRef = db.collection("payments").doc(paymentId);
    const doc = await docRef.get();

    if (!doc.exists)
      return res.status(404).json({ message: "Payment not found" });
    if (doc.data()?.studentId !== studentId)
      return res.status(403).json({ message: "Access denied" });
    if (doc.data()?.status === "paid")
      return res.status(400).json({ message: "Already paid" });

    const transactionId = generateTxId();
    const now = new Date();

    await docRef.update({
      status: "paid",
      method,
      paidAt: now,
      transactionId,
      updatedAt: now,
    });

    return res.json({
      success: true,
      transactionId,
      paidAt: now.toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
