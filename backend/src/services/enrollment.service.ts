import { db } from "@/config/firebase";

export const enrollStudent = async (studentId: string, courseId: string) => {
  // 1. check if course exists
  const courseDoc = await db.collection("courses").doc(courseId).get();

  if (!courseDoc.exists) {
    throw new Error("Course not found");
  }

  // 2. prevent duplicate enrollment
  const existingEnrollment = await db
    .collection("enrollments")
    .where("studentId", "==", studentId)
    .where("courseId", "==", courseId)
    .get();

  if (!existingEnrollment.empty) {
    throw new Error("Already enrolled");
  }

  // 3. create enrollment
  const enrollment = await db.collection("enrollments").add({
    studentId,
    courseId,
    status: "active",
    enrolledAt: new Date(),
  });

  return enrollment.id;
};
