export interface CreateDepartmentDTO {
  name: string;
  code: string;
}

export interface DepartmentList {
  id: string;
  code: string;
  name: string;
  createdAt: Date;
}
