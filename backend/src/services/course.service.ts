import { db } from "../config/firebase.js";

import type { CreateCourseDTO } from "../types/course.types.js";

export const createCourse = async (data: CreateCourseDTO) => {
  // check instructor exists
  const instructorDoc = await db
    .collection("users")
    .doc(data.instructorId)
    .get();

  if (!instructorDoc.exists) {
    throw new Error("Instructor not found");
  }

  const instructor = instructorDoc.data();

  if (instructor?.role !== "instructor") {
    throw new Error("User is not an instructor");
  }

  // optional: check department exists
  const departmentDoc = await db
    .collection("departments")
    .doc(data.departmentId)
    .get();

  if (!departmentDoc.exists) {
    throw new Error("Department not found");
  }

  // create course
  const courseRef = await db.collection("courses").add({
    title: data.title,
    instructorId: data.instructorId,
    departmentId: data.departmentId,
    lectureTime: data.lectureTime,
    credits: data.credits,
    minYear: data.minYear ?? null,
    capacity: data.capacity ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    id: courseRef.id,

    ...data,
  };
};

export const getCourses = async () => {
  const [snapshot, enrollmentsSnap] = await Promise.all([
    db.collection("courses").orderBy("createdAt", "desc").get(),
    db.collection("enrollments").where("status", "==", "active").get(),
  ]);

  const enrolledCountMap = new Map<string, number>();
  enrollmentsSnap.docs.forEach((doc) => {
    const cid = doc.data().courseId as string;
    enrolledCountMap.set(cid, (enrolledCountMap.get(cid) ?? 0) + 1);
  });

  const courses = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const course = doc.data();

      const [instructorDoc, departmentDoc] = await Promise.all([
        db.collection("users").doc(course.instructorId).get(),
        db.collection("departments").doc(course.departmentId).get(),
      ]);

      return {
        id: doc.id,
        title: course.title,
        credits: course.credits,
        lectureTime: course.lectureTime,
        minYear: (course.minYear as number | undefined) ?? null,
        capacity: (course.capacity as number | undefined) ?? null,
        enrolledCount: enrolledCountMap.get(doc.id) ?? 0,
        instructor: instructorDoc.exists
          ? {
              id: instructorDoc.id,
              name: instructorDoc.data()?.name,
              email: instructorDoc.data()?.email,
            }
          : null,
        department: departmentDoc.exists
          ? {
              id: departmentDoc.id,
              name: departmentDoc.data()?.name,
              code: departmentDoc.data()?.code,
            }
          : null,
        createdAt: course.createdAt,
      };
    }),
  );

  return courses;
};

export const getInstructorCourses = async (instructorId: string) => {
  const [snapshot, enrollmentsSnap] = await Promise.all([
    db
      .collection("courses")
      .where("instructorId", "==", instructorId)
      .orderBy("createdAt", "asc")
      .get(),
    db.collection("enrollments").where("status", "==", "active").get(),
  ]);

  const enrolledCountMap = new Map<string, number>();
  enrollmentsSnap.docs.forEach((doc) => {
    const cid = doc.data().courseId as string;
    enrolledCountMap.set(cid, (enrolledCountMap.get(cid) ?? 0) + 1);
  });

  const courses = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const course = doc.data();

      const departmentDoc = await db
        .collection("departments")
        .doc(course.departmentId)
        .get();

      return {
        id: doc.id,
        title: course.title,
        credits: course.credits,
        lectureTime: course.lectureTime,
        minYear: (course.minYear as number | undefined) ?? null,
        capacity: (course.capacity as number | undefined) ?? null,
        enrolledCount: enrolledCountMap.get(doc.id) ?? 0,
        department: departmentDoc.exists
          ? {
              id: departmentDoc.id,
              name: departmentDoc.data()?.name,
              code: departmentDoc.data()?.code,
            }
          : null,
        createdAt: course.createdAt,
      };
    }),
  );

  return courses;
};
