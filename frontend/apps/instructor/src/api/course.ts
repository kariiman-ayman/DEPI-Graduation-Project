import api from "_core/api";
import type { CoursesList } from "../types/course.types.js";

const URL = "instructor/course";

export const getCourses = async (): Promise<CoursesList[]> => {
  const res = await api.get(`${URL}/list`);
  return res.data;
};
