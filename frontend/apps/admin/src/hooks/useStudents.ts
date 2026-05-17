import { useQuery } from "@tanstack/react-query";
import { getStudents, getStudentDetails } from "../api/students.js";

export const useStudents = () =>
  useQuery({ queryKey: ["admin-students"], queryFn: getStudents });

export const useStudentDetails = (id: string | null) =>
  useQuery({
    queryKey: ["admin-student-detail", id],
    queryFn: () => getStudentDetails(id!),
    enabled: !!id,
  });
