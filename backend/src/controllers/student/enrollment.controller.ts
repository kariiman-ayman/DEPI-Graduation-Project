import type { Response } from "express";
import type { AuthRequest } from "../../types/request.types";
import { enrollStudent } from "../../services/enrollment.service";
import { db } from "../../config/firebase";

export const enroll = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.uid;
    const { courseId } = req.body;
    const enrollmentId = await enrollStudent(studentId!, courseId);
    res.json({ message: "Enrollment successful", enrollmentId });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getEnrolledCourses = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid;

    const enrollmentsSnap = await db
      .collection("enrollments")
      .where("studentId", "==", uid)
      .where("status", "==", "active")
      .get();

    if (enrollmentsSnap.empty) return res.json([]);

    const results = await Promise.all(
      enrollmentsSnap.docs.map(async (doc) => {
        const enrollment = doc.data();
        const courseId = enrollment.courseId as string;

        const [courseDoc, gradeSnap] = await Promise.all([
          db.collection("courses").doc(courseId).get(),
          db
            .collection("grades")
            .where("studentId", "==", uid)
            .where("courseId", "==", courseId)
            .limit(1)
            .get(),
        ]);

        if (!courseDoc.exists) return null;
        const course = courseDoc.data()!;

        const [instructorDoc, departmentDoc] = await Promise.all([
          db
            .collection("users")
            .doc(course.instructorId as string)
            .get(),
          db
            .collection("departments")
            .doc(course.departmentId as string)
            .get(),
        ]);

        const gradeData = gradeSnap.empty ? null : gradeSnap.docs[0].data();

        return {
          enrollmentId: doc.id,
          courseId,
          title: course.title as string,
          credits: course.credits as number,
          lectureTime: course.lectureTime,
          instructor: instructorDoc.exists
            ? {
                id: instructorDoc.id,
                name: instructorDoc.data()!.name,
                email: instructorDoc.data()!.email,
              }
            : null,
          department: departmentDoc.exists
            ? {
                id: departmentDoc.id,
                code: departmentDoc.data()!.code,
                name: departmentDoc.data()!.name,
              }
            : null,
          grade: gradeData
            ? {
                letterGrade:
                  (gradeData.letterGrade as string | undefined) ?? null,
                gradePoints:
                  (gradeData.gradePoints as number | undefined) ?? null,
                total: (gradeData.total as number | undefined) ?? null,
              }
            : null,
          enrolledAt:
            enrollment.enrolledAt?.toDate?.()?.toISOString?.() ?? null,
        };
      }),
    );

    return res.json(results.filter(Boolean));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
