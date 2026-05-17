import api from "_core/api";
import type { GradesResponse } from "../types/grade.types.js";

export const getMyGrades = async (): Promise<GradesResponse> => {
  const res = await api.get("/student/grades");
  return res.data;
};
