import type { Response } from "express";
import { db } from "@/config/firebase";
import type { AuthRequest } from "@/types/request.types";

// ---------------------------------------------------------------------------
// Grade computation helpers
// ---------------------------------------------------------------------------

function computeTotal(
  midterm: number,
  assignments: number,
  project: number,
  final: number
): number {
  return +(midterm * 0.3 + assignments * 0.2 + project * 0.25 + final * 0.25).toFixed(2);
}

function toLetterGrade(total: number): { letter: string; points: number } {
  if (total >= 95) return { letter: "A+", points: 4.0 };
  if (total >= 90) return { letter: "A",  points: 4.0 };
  if (total >= 87) return { letter: "A-", points: 3.7 };
  if (total >= 83) return { letter: "B+", points: 3.3 };
  if (total >= 80) return { letter: "B",  points: 3.0 };
  if (total >= 77) return { letter: "B-", points: 2.7 };
  if (total >= 73) return { letter: "C+", points: 2.3 };
  if (total >= 70) return { letter: "C",  points: 2.0 };
  if (total >= 67) return { letter: "C-", points: 1.7 };
  if (total >= 60) return { letter: "D",  points: 1.0 };
  return { letter: "F", points: 0.0 };
}

// ---------------------------------------------------------------------------
// GET /instructor/grades?courseId=<id>
// ---------------------------------------------------------------------------

export const getCourseGrades = async (req: AuthRequest, res: Response) => {
  try {
    const instructorId = req.user?.uid;
    const { courseId } = req.query as { courseId?: string };

    if (!courseId) {
      return res.status(400).json({ message: "courseId query param is required" });
    }

    // Verify course exists and belongs to this instructor
    const courseDoc = await db.collection("courses").doc(courseId).get();
    if (!courseDoc.exists) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (courseDoc.data()?.instructorId !== instructorId) {
      return res.status(403).json({ message: "Access denied: you do not own this course" });
    }

    // Fetch enrollments and grades for this course (single-field queries — no index needed)
    const [enrollmentsSnap, gradesSnap] = await Promise.all([
      db.collection("enrollments").where("courseId", "==", courseId).get(),
      db.collection("grades").where("courseId", "==", courseId).get(),
    ]);

    // Build grade lookup map
    const gradeMap = new Map<string, FirebaseFirestore.DocumentData>();
    gradesSnap.docs.forEach((d) => gradeMap.set(d.data().studentId as string, d.data()));

    // Collect unique student IDs from enrollments
    const studentIds = enrollmentsSnap.docs.map((d) => d.data().studentId as string);

    // Fetch user docs for all enrolled students in parallel
    const userDocs = await Promise.all(
      studentIds.map((id) => db.collection("users").doc(id).get())
    );
    const userMap = new Map(userDocs.map((d) => [d.id, d.data()]));

    // Build response
    const result = studentIds.map((studentId) => {
      const user = userMap.get(studentId);
      const grade = gradeMap.get(studentId);

      return {
        studentId,
        studentName:  user?.name  ?? "Unknown",
        studentEmail: user?.email ?? "Unknown",
        midterm:      grade ? (grade.midterm     as number) : null,
        assignments:  grade ? (grade.assignments as number) : null,
        project:      grade ? (grade.project     as number) : null,
        final:        grade ? (grade.final       as number) : null,
        total:        grade ? (grade.total       as number) : null,
        letterGrade:  grade ? (grade.letterGrade as string) : null,
        gradePoints:  grade ? (grade.gradePoints as number) : null,
        hasGrade:     !!grade,
      };
    });

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// POST /instructor/grades
// Body: { studentId, courseId, midterm, assignments, project, final }
// ---------------------------------------------------------------------------

export const upsertGrade = async (req: AuthRequest, res: Response) => {
  try {
    const instructorId = req.user?.uid;
    const { studentId, courseId, midterm, assignments, project, final } = req.body as {
      studentId:   string;
      courseId:    string;
      midterm:     number;
      assignments: number;
      project:     number;
      final:       number;
    };

    // Validate scores
    const scores = { midterm, assignments, project, final };
    for (const [key, val] of Object.entries(scores)) {
      if (typeof val !== "number" || val < 0 || val > 100) {
        return res.status(400).json({ message: `${key} must be a number between 0 and 100` });
      }
    }

    if (!studentId || !courseId) {
      return res.status(400).json({ message: "studentId and courseId are required" });
    }

    // Verify course exists and belongs to this instructor
    const courseDoc = await db.collection("courses").doc(courseId).get();
    if (!courseDoc.exists) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (courseDoc.data()?.instructorId !== instructorId) {
      return res.status(403).json({ message: "Access denied: you do not own this course" });
    }

    const credits: number = courseDoc.data()?.credits ?? 0;

    // Compute derived values
    const total = computeTotal(midterm, assignments, project, final);
    const { letter: letterGrade, points: gradePoints } = toLetterGrade(total);

    // Find existing grade doc (two single-field constraints on the same field path — safe)
    const existingSnap = await db
      .collection("grades")
      .where("studentId", "==", studentId)
      .where("courseId", "==", courseId)
      .limit(1)
      .get();

    const now = new Date();
    const gradePayload = {
      studentId,
      courseId,
      instructorId,
      midterm,
      assignments,
      project,
      final,
      total,
      letterGrade,
      gradePoints,
      credits,
      updatedAt: now,
    };

    let savedGrade: Record<string, unknown>;

    if (existingSnap.empty) {
      const docRef = await db.collection("grades").add({ ...gradePayload, createdAt: now });
      savedGrade = { id: docRef.id, ...gradePayload, createdAt: now };
    } else {
      const docRef = existingSnap.docs[0].ref;
      await docRef.update(gradePayload);
      savedGrade = { id: docRef.id, ...gradePayload, createdAt: existingSnap.docs[0].data().createdAt };
    }

    return res.json(savedGrade);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
