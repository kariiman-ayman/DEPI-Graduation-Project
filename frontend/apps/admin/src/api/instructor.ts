import type { instructorList } from "../types/instructor.types";
import api from "_core/api";

const URL = "admin/instructor";

export const getInstructors = async (): Promise<instructorList[]> => {
  const res = await api.get(`${URL}/list`);
  return res.data;
};
