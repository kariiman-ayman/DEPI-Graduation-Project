import api from "_core/api";
import type { InstructorCourseGrade, UpsertGradeDTO } from "../types/grade.types";

export const getCourseGrades = async (
  courseId: string,
): Promise<InstructorCourseGrade[]> => {
  const res = await api.get("/instructor/grades", {
    params: { courseId },
  });
  return res.data;
};

export const upsertGrade = async (dto: UpsertGradeDTO): Promise<void> => {
  await api.post("/instructor/grades", dto);
};
