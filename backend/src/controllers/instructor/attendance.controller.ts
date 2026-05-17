import type { Response } from "express";
import { db } from "../../config/firebase";
import type { AuthRequest } from "../../types/request.types";

// ---------------------------------------------------------------------------
// GET /instructor/attendance?courseId=xxx&date=YYYY-MM-DD
// ---------------------------------------------------------------------------

export const getAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const instructorId = req.user?.uid;
    const { courseId, date } = req.query as {
      courseId?: string;
      date?: string;
    };

    if (!courseId) {
      return res
        .status(400)
        .json({ message: "courseId query param is required" });
    }

    const selectedDate = date ?? new Date().toISOString().split("T")[0];

    // Verify course belongs to this instructor
    const courseDoc = await db.collection("courses").doc(courseId).get();
    if (!courseDoc.exists)
      return res.status(404).json({ message: "Course not found" });
    if (courseDoc.data()?.instructorId !== instructorId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch enrollments (single-field query) and all attendance for this course in parallel
    const [enrollmentsSnap, attendanceSnap] = await Promise.all([
      db.collection("enrollments").where("courseId", "==", courseId).get(),
      db.collection("attendance").where("courseId", "==", courseId).get(),
    ]);

    const studentIds = enrollmentsSnap.docs
      .filter((d) => !d.data().status || d.data().status === "active")
      .map((d) => d.data().studentId as string);

    if (studentIds.length === 0) {
      return res.json({ students: [], sessionDates: [], selectedDate });
    }

    // Fetch student user docs
    const userDocs = await Promise.all(
      studentIds.map((id) => db.collection("users").doc(id).get()),
    );
    const userMap = new Map(userDocs.map((d) => [d.id, d.data()]));

    const allAttendance = attendanceSnap.docs.map((d) => ({
      id: d.id,
      studentId: d.data().studentId as string,
      date: d.data().date as string,
      status: d.data().status as "present" | "absent",
    }));

    // Derive last 8 distinct session dates
    const sessionDates = [...new Set(allAttendance.map((a) => a.date))]
      .sort()
      .slice(-8);

    const students = studentIds.map((studentId) => {
      const user = userMap.get(studentId);
      const records = allAttendance.filter((a) => a.studentId === studentId);
      const todayRecord = records.find((a) => a.date === selectedDate);
      const presentCount = records.filter((a) => a.status === "present").length;
      const total = records.length;

      return {
        studentId,
        name: user?.name ?? "Unknown",
        email: user?.email ?? "",
        todayStatus: todayRecord?.status ?? null,
        attendanceRate:
          total > 0 ? +((presentCount / total) * 100).toFixed(1) : 0,
        present: presentCount,
        total,
        lastSessions: sessionDates.map((d) => ({
          date: d,
          status: records.find((a) => a.date === d)?.status ?? null,
        })),
      };
    });

    return res.json({ students, sessionDates, selectedDate });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// POST /instructor/attendance
// Body: { courseId, date, records: [{studentId, status}] }
// ---------------------------------------------------------------------------

export const saveAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const instructorId = req.user?.uid;
    const { courseId, date, records } = req.body as {
      courseId: string;
      date: string;
      records: { studentId: string; status: "present" | "absent" }[];
    };

    if (!courseId || !date || !Array.isArray(records) || records.length === 0) {
      return res
        .status(400)
        .json({ message: "courseId, date, and records are required" });
    }

    // Verify course belongs to this instructor
    const courseDoc = await db.collection("courses").doc(courseId).get();
    if (!courseDoc.exists)
      return res.status(404).json({ message: "Course not found" });
    if (courseDoc.data()?.instructorId !== instructorId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Load all existing attendance for this course (single-field query), filter by date in memory
    const existingSnap = await db
      .collection("attendance")
      .where("courseId", "==", courseId)
      .get();
    const existingForDate = existingSnap.docs.filter(
      (d) => d.data().date === date,
    );
    const existingMap = new Map(
      existingForDate.map((d) => [d.data().studentId as string, d.ref]),
    );

    const now = new Date();

    await Promise.all(
      records.map(({ studentId, status }) => {
        const payload = {
          courseId,
          studentId,
          date,
          status,
          instructorId,
          updatedAt: now,
        };
        if (existingMap.has(studentId)) {
          return existingMap.get(studentId)!.update(payload);
        }
        return db.collection("attendance").add({ ...payload, createdAt: now });
      }),
    );

    return res.json({ success: true, saved: records.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
