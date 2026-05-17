import api from "_core/api";
import type { CoursesList, CreateCourseDTO } from "../types/course.types.js";

const URL = "admin/course";

export const getCourses = async (): Promise<CoursesList[]> => {
  const res = await api.get(`${URL}/list`);
  return res.data;
};

export const createCourse = async (req: CreateCourseDTO) => {
  const res = await api.post(`${URL}`, req);
  return res.data;
};
