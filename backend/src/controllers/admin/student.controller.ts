import type { Request, Response, NextFunction } from "express";
import { db } from "../../config/firebase";

export const getStudentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const usersSnap = await db
      .collection("users")
      .where("role", "==", "student")
      .get();
    const students = usersSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));

    const results = await Promise.all(
      students.map(async (student) => {
        const [enrollmentsSnap, gradesSnap, paymentsSnap] = await Promise.all([
          db
            .collection("enrollments")
            .where("studentId", "==", student.id)
            .get(),
          db.collection("grades").where("studentId", "==", student.id).get(),
          db.collection("payments").where("studentId", "==", student.id).get(),
        ]);

        const enrolledCourses = enrollmentsSnap.docs.filter(
          (d) => d.data().status === "active",
        ).length;

        const gradePoints = gradesSnap.docs
          .map((d) => (d.data() as any).gradePoints)
          .filter((g: any) => g != null);
        const averageGrade =
          gradePoints.length > 0
            ? Math.round(
                (gradePoints.reduce((a: number, b: number) => a + b, 0) /
                  gradePoints.length) *
                  100,
              ) / 100
            : ((student.initialGpa as number | undefined) ?? null);

        const totalPaid = paymentsSnap.docs
          .filter((d) => d.data().status === "paid")
          .reduce((sum, d) => sum + ((d.data() as any).amount || 0), 0);

        return {
          id: student.id,
          name: student.name || null,
          email: student.email,
          academicYear: (student.academicYear as number | undefined) ?? null,
          createdAt: student.createdAt?.toDate?.()?.toISOString() ?? null,
          enrolledCourses,
          averageGrade,
          totalPaid,
        };
      }),
    );

    res.json({ students: results });
  } catch (err) {
    next(err);
  }
};

export const getStudentDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const userDoc = await db
      .collection("users")
      .doc(id as string)
      .get();
    if (!userDoc.exists || (userDoc.data() as any).role !== "student") {
      res.status(404).json({ message: "Student not found" });
      return;
    }
    const student = { id: userDoc.id, ...(userDoc.data() as any) };

    const [enrollmentsSnap, gradesSnap, paymentsSnap, attendanceSnap] =
      await Promise.all([
        db.collection("enrollments").where("studentId", "==", id).get(),
        db.collection("grades").where("studentId", "==", id).get(),
        db.collection("payments").where("studentId", "==", id).get(),
        db.collection("attendance").where("studentId", "==", id).get(),
      ]);

    const enrollments = enrollmentsSnap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));
    const gradesMap = new Map(
      gradesSnap.docs.map((d) => [
        d.data().courseId,
        { id: d.id, ...(d.data() as any) },
      ]),
    );
    const paymentsMap = new Map(
      paymentsSnap.docs.map((d) => [
        d.data().courseId,
        { id: d.id, ...(d.data() as any) },
      ]),
    );
    const attendanceRecords = attendanceSnap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));

    const courseIds = [
      ...new Set(enrollments.map((e: any) => e.courseId as string)),
    ];
    const courseSnaps =
      courseIds.length > 0
        ? await Promise.all(
            courseIds.map((cid) => db.collection("courses").doc(cid).get()),
          )
        : [];
    const coursesMap = new Map(
      courseSnaps
        .filter((s) => s.exists)
        .map((s) => [s.id, { id: s.id, ...(s.data() as any) }]),
    );

    const instructorIds = [
      ...new Set(
        Array.from(coursesMap.values())
          .map((c: any) => c.instructorId)
          .filter(Boolean),
      ),
    ];
    const instructorSnaps =
      instructorIds.length > 0
        ? await Promise.all(
            instructorIds.map((iid) =>
              db
                .collection("users")
                .doc(iid as string)
                .get(),
            ),
          )
        : [];
    const instructorsMap = new Map(
      instructorSnaps
        .filter((s) => s.exists)
        .map((s) => [
          s.id,
          (s.data() as any)?.name || (s.data() as any)?.email,
        ]),
    );

    const today = new Date().toISOString().split("T")[0]!;

    const courses = enrollments.map((enrollment: any) => {
      const course = coursesMap.get(enrollment.courseId) as any;
      const grade = (gradesMap.get(enrollment.courseId) as any) || null;
      const payment = (paymentsMap.get(enrollment.courseId) as any) || null;
      const courseAttendance = attendanceRecords.filter(
        (a: any) => a.courseId === enrollment.courseId,
      );
      const presentCount = courseAttendance.filter(
        (a: any) => a.status === "present",
      ).length;
      const attendanceRate =
        courseAttendance.length > 0
          ? Math.round((presentCount / courseAttendance.length) * 100)
          : 0;

      const paymentStatus = payment
        ? payment.status === "paid"
          ? "paid"
          : payment.dueDate < today
            ? "overdue"
            : "pending"
        : null;

      return {
        courseId: enrollment.courseId,
        enrollmentStatus: enrollment.status,
        title: course?.title || "Unknown Course",
        instructor: course
          ? instructorsMap.get(course.instructorId) || "—"
          : "—",
        credits: course?.credits || 0,
        lectureTime: course?.lectureTime || null,
        grade: grade
          ? {
              total: grade.total,
              letterGrade: grade.letterGrade,
              gradePoints: grade.gradePoints,
              midterm: grade.midterm,
              assignments: grade.assignments,
              project: grade.project,
              final: grade.final,
            }
          : null,
        payment: payment
          ? {
              id: payment.id,
              amount: payment.amount,
              status: paymentStatus,
              dueDate: payment.dueDate,
              paidAt: payment.paidAt?.toDate?.()?.toISOString() ?? null,
              transactionId: payment.transactionId,
              method: payment.method,
            }
          : null,
        attendance: {
          present: presentCount,
          total: courseAttendance.length,
          rate: attendanceRate,
        },
      };
    });

    const payments = paymentsSnap.docs.map((d) => {
      const data = d.data() as any;
      const course = coursesMap.get(data.courseId) as any;
      const effectiveStatus =
        data.status === "paid"
          ? "paid"
          : data.dueDate < today
            ? "overdue"
            : "pending";
      return {
        id: d.id,
        courseId: data.courseId,
        courseTitle: course?.title || "Unknown Course",
        amount: data.amount,
        description: data.description,
        status: effectiveStatus,
        dueDate: data.dueDate,
        paidAt: data.paidAt?.toDate?.()?.toISOString() ?? null,
        transactionId: data.transactionId,
        method: data.method,
      };
    });

    const attendanceTotal = attendanceRecords.length;
    const attendancePresent = attendanceRecords.filter(
      (a: any) => a.status === "present",
    ).length;
    const attendanceRate =
      attendanceTotal > 0
        ? Math.round((attendancePresent / attendanceTotal) * 100)
        : 0;

    const gradePoints = Array.from(gradesMap.values())
      .map((g: any) => g.gradePoints)
      .filter((g: any) => g != null);
    const averageGrade =
      gradePoints.length > 0
        ? Math.round(
            (gradePoints.reduce((a: number, b: number) => a + b, 0) /
              gradePoints.length) *
              100,
          ) / 100
        : ((student.initialGpa as number | undefined) ?? null);

    const totalPaid = paymentsSnap.docs
      .filter((d) => d.data().status === "paid")
      .reduce((sum, d) => sum + ((d.data() as any).amount || 0), 0);
    const totalDue = paymentsSnap.docs
      .filter((d) => d.data().status !== "paid")
      .reduce((sum, d) => sum + ((d.data() as any).amount || 0), 0);

    res.json({
      id: student.id,
      name: student.name || null,
      email: student.email,
      academicYear: (student.academicYear as number | undefined) ?? null,
      createdAt: student.createdAt?.toDate?.()?.toISOString() ?? null,
      stats: {
        enrolledCourses: enrollments.filter((e: any) => e.status === "active")
          .length,
        attendanceRate,
        averageGrade,
        totalPaid,
        totalDue,
      },
      courses,
      payments,
    });
  } catch (err) {
    next(err);
  }
};
