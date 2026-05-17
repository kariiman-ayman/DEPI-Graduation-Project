import api from "_core/api";
import type { StudentDetail, StudentListItem } from "../types/student.types";

const URL = "admin/student";

export const getStudents = async (): Promise<StudentListItem[]> => {
  const res = await api.get(`${URL}/list`);
  return res.data.students;
};

export const getStudentDetails = async (id: string): Promise<StudentDetail> => {
  const res = await api.get(`${URL}/${id}`);
  return res.data;
};
