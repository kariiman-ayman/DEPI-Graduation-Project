import api from "_core/api";
import type { CoursesList, EnrolledCourse } from "../types/course.types";

const BASE = "/student/courses";

export const getCourses = async (): Promise<CoursesList[]> => {
  const res = await api.get(`${BASE}/list`);
  return res.data;
};

export const getEnrolledCourses = async (): Promise<EnrolledCourse[]> => {
  const res = await api.get(`${BASE}/enrolled`);
  return res.data;
};
