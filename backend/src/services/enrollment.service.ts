import { db } from "@/config/firebase";

export const enrollStudent = async (studentId: string, courseId: string) => {
  const courseDoc = await db.collection("courses").doc(courseId).get();
  if (!courseDoc.exists) throw new Error("Course not found");

  const course = courseDoc.data()!;
  const minYear = (course.minYear as number | undefined) ?? null;
  const capacity = (course.capacity as number | undefined) ?? null;

  // Prevent duplicate enrollment
  const existingEnrollment = await db
    .collection("enrollments")
    .where("studentId", "==", studentId)
    .where("courseId", "==", courseId)
    .get();
  if (!existingEnrollment.empty) throw new Error("Already enrolled in this course");

  // Check minimum academic year
  if (minYear) {
    const studentDoc = await db.collection("users").doc(studentId).get();
    const studentYear = (studentDoc.data()?.academicYear as number | undefined) ?? 0;
    if (studentYear < minYear) {
      throw new Error(`This course requires Year ${minYear} or above`);
    }
  }

  // Check capacity
  if (capacity) {
    const activeSnap = await db
      .collection("enrollments")
      .where("courseId", "==", courseId)
      .where("status", "==", "active")
      .get();
    if (activeSnap.size >= capacity) {
      throw new Error("This course is full");
    }
  }

  const enrollment = await db.collection("enrollments").add({
    studentId,
    courseId,
    status: "active",
    enrolledAt: new Date(),
  });

  return enrollment.id;
};
