import type { Request, Response, NextFunction } from "express";
import { db } from "@/config/firebase";

export const getDashboardController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [studentsSnap, instructorsSnap, coursesSnap, departmentsSnap, paymentsSnap] =
      await Promise.all([
        db.collection("users").where("role", "==", "student").get(),
        db.collection("users").where("role", "==", "instructor").get(),
        db.collection("courses").get(),
        db.collection("departments").get(),
        db.collection("payments").get(),
      ]);

    // ── Payment totals ──────────────────────────────────────────────────────
    const today = new Date().toISOString().split("T")[0];
    let totalCollected = 0;
    let totalOutstanding = 0;
    let totalOverdue = 0;

    paymentsSnap.docs.forEach((d) => {
      const p = d.data() as any;
      const amount: number = p.amount || 0;
      if (p.status === "paid") {
        totalCollected += amount;
      } else if ((p.dueDate as string) < today) {
        totalOverdue += amount;
      } else {
        totalOutstanding += amount;
      }
    });

    // ── Recent students (last 5 by createdAt) ──────────────────────────────
    const allStudents = studentsSnap.docs
      .map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          name: (data.name as string) || null,
          email: data.email as string,
          createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
        };
      })
      .sort((a, b) => {
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return b.createdAt.localeCompare(a.createdAt);
      });

    const recentStudents = allStudents.slice(0, 5);

    // ── Courses by department ───────────────────────────────────────────────
    const deptMap = new Map(
      departmentsSnap.docs.map((d) => [
        d.id,
        { name: (d.data() as any).name, code: (d.data() as any).code },
      ])
    );

    const deptCounts = new Map<string, number>();
    coursesSnap.docs.forEach((d) => {
      const deptId: string = (d.data() as any).departmentId || "__none__";
      deptCounts.set(deptId, (deptCounts.get(deptId) || 0) + 1);
    });

    const coursesByDepartment = Array.from(deptCounts.entries())
      .map(([deptId, courseCount]) => ({
        departmentId: deptId,
        departmentName: deptMap.get(deptId)?.name ?? "Unknown",
        departmentCode: deptMap.get(deptId)?.code ?? "—",
        courseCount,
      }))
      .sort((a, b) => b.courseCount - a.courseCount);

    res.json({
      stats: {
        totalStudents: studentsSnap.size,
        totalInstructors: instructorsSnap.size,
        totalCourses: coursesSnap.size,
        totalCollected,
        totalOutstanding,
        totalOverdue,
      },
      recentStudents,
      coursesByDepartment,
    });
  } catch (err) {
    next(err);
  }
};
