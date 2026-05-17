import type { Response } from "express";
import { db } from "../../config/firebase.js";
import type { AuthRequest } from "../../types/request.types.js";

// ---------------------------------------------------------------------------
// GET /student/attendance
// ---------------------------------------------------------------------------

export const getMyAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.uid;

    // Get active enrollments (single-field query, filter status in memory)
    const enrollmentsSnap = await db
      .collection("enrollments")
      .where("studentId", "==", studentId)
      .get();

    const courseIds = enrollmentsSnap.docs
      .filter((d) => !d.data().status || d.data().status === "active")
      .map((d) => d.data().courseId as string);

    if (courseIds.length === 0) {
      return res.json({
        courses: [],
        calendar: [],
        overall: { present: 0, total: 0, percentage: 0 },
      });
    }

    // Fetch course docs and all attendance records for this student in parallel
    const [courseDocs, attendanceSnap] = await Promise.all([
      Promise.all(
        courseIds.map((id) => db.collection("courses").doc(id).get()),
      ),
      db.collection("attendance").where("studentId", "==", studentId).get(),
    ]);

    const courseMap = new Map(courseDocs.map((d) => [d.id, d.data()]));

    const myAttendance = attendanceSnap.docs.map((d) => ({
      courseId: d.data().courseId as string,
      date: d.data().date as string,
      status: d.data().status as "present" | "absent",
    }));

    let totalPresent = 0;
    let totalClasses = 0;

    const courses = courseIds.map((courseId) => {
      const course = courseMap.get(courseId);
      const records = myAttendance.filter((a) => a.courseId === courseId);
      const present = records.filter((a) => a.status === "present").length;
      const total = records.length;
      totalPresent += present;
      totalClasses += total;

      return {
        courseId,
        courseName: course?.title ?? "Unknown",
        present,
        total,
        percentage: total > 0 ? +((present / total) * 100).toFixed(1) : 0,
        records: records.map((r) => ({ date: r.date, status: r.status })),
      };
    });

    // Calendar records for the current month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const calendar = myAttendance
      .filter((a) => a.date.startsWith(currentMonth))
      .map((a) => ({ date: a.date, status: a.status }));

    return res.json({
      courses,
      calendar,
      overall: {
        present: totalPresent,
        total: totalClasses,
        percentage:
          totalClasses > 0
            ? +((totalPresent / totalClasses) * 100).toFixed(1)
            : 0,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
