import type {
  CreateDepartmentDTO,
  DepartmentList,
} from "@/types/department.types";
import api from "_core/api";

const URL = "admin/department";

export const createDepartment = async (req: CreateDepartmentDTO) => {
  const res = await api.post(`${URL}`, req);
  return res.data;
};

export const getDepartments = async (): Promise<DepartmentList[]> => {
  const res = await api.get(`${URL}/list`);
  return res.data;
};

export const deleteDepartment = async (id: string) => {
  const res = await api.delete(`${URL}/${id}`);
  return res.data;
};
