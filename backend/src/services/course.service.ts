import { db } from "@/config/firebase";

import type { CreateCourseDTO } from "@/types/course.types";

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

    createdAt: new Date(),

    updatedAt: new Date(),
  });

  return {
    id: courseRef.id,

    ...data,
  };
};

export const getCourses = async () => {
  const snapshot = await db
    .collection("courses")
    .orderBy("createdAt", "desc")
    .get();

  const courses = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const course = doc.data();

      // get instructor
      const instructorDoc = await db
        .collection("users")
        .doc(course.instructorId)
        .get();

      // get department
      const departmentDoc = await db
        .collection("departments")
        .doc(course.departmentId)
        .get();

      return {
        id: doc.id,

        title: course.title,

        credits: course.credits,

        lectureTime: course.lectureTime,

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
  const snapshot = await db
    .collection("courses")
    .where("instructorId", "==", instructorId)
    .orderBy("createdAt", "asc")
    .get();

  const courses = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const course = doc.data();

      // get department
      const departmentDoc = await db
        .collection("departments")
        .doc(course.departmentId)
        .get();

      return {
        id: doc.id,

        title: course.title,

        credits: course.credits,

        lectureTime: course.lectureTime,

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
