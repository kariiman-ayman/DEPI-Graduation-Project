import type { Response } from "express";
import { db } from "../../config/firebase";
import type { AuthRequest } from "../../types/request.types";

// ---------------------------------------------------------------------------
// GET /student/grades
// Returns all grades for the authenticated student, plus a computed GPA.
// ---------------------------------------------------------------------------

export const getMyGrades = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.uid as string;

    // 1. Get all enrollments for this student (single-field query — safe)
    const enrollmentsSnap = await db
      .collection("enrollments")
      .where("studentId", "==", studentId)
      .get();

    if (enrollmentsSnap.empty) {
      return res.json({
        grades: [],
        gpa: 0,
        totalCredits: 0,
        gradedCredits: 0,
      });
    }

    const courseIds = enrollmentsSnap.docs.map(
      (d) => d.data().courseId as string,
    );

    // 2. Fetch all course docs and all grades for this student in parallel
    const [courseDocs, gradesSnap] = await Promise.all([
      Promise.all(
        courseIds.map((id) => db.collection("courses").doc(id).get()),
      ),
      db.collection("grades").where("studentId", "==", studentId).get(),
    ]);

    const courseMap = new Map(courseDocs.map((d) => [d.id, d.data()]));

    // 3. Build grade lookup map
    const gradeMap = new Map<string, FirebaseFirestore.DocumentData>();
    gradesSnap.docs.forEach((d) =>
      gradeMap.set(d.data().courseId as string, d.data()),
    );

    // 4. Collect unique departmentIds so we can resolve them in one pass
    const departmentIds = [
      ...new Set(
        courseDocs
          .map((d) => d.data()?.departmentId as string | undefined)
          .filter((id): id is string => !!id),
      ),
    ];

    const departmentDocs = await Promise.all(
      departmentIds.map((id) => db.collection("departments").doc(id).get()),
    );
    const departmentMap = new Map(departmentDocs.map((d) => [d.id, d.data()]));

    // 5. Build the response array
    const grades = courseIds.map((courseId) => {
      const course = courseMap.get(courseId);
      const grade = gradeMap.get(courseId);
      const dept = departmentMap.get(course?.departmentId ?? "");

      return {
        courseId,
        courseName: course?.title ?? "Unknown Course",
        departmentId: course?.departmentId ?? null,
        departmentCode: dept?.code ?? null,
        credits: course?.credits ?? 0,
        midterm: grade ? (grade.midterm as number) : null,
        assignments: grade ? (grade.assignments as number) : null,
        project: grade ? (grade.project as number) : null,
        final: grade ? (grade.final as number) : null,
        total: grade ? (grade.total as number) : null,
        letterGrade: grade ? (grade.letterGrade as string) : null,
        gradePoints: grade ? (grade.gradePoints as number) : null,
        hasGrade: !!grade,
      };
    });

    // 6. Compute GPA from graded courses only
    const gradedCourses = grades.filter((g) => g.hasGrade);
    const gradedCredits = gradedCourses.reduce((sum, g) => sum + g.credits, 0);
    const weightedPoints = gradedCourses.reduce(
      (sum, g) => sum + (g.gradePoints ?? 0) * g.credits,
      0,
    );
    const gpa =
      gradedCredits > 0 ? +(weightedPoints / gradedCredits).toFixed(2) : 0;

    const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);

    return res.json({ grades, gpa, totalCredits, gradedCredits });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
