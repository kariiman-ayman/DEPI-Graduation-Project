export type { StudentDetail } from "_core/components/modals/StudentDetailsModal";

export interface StudentListItem {
  id: string;
  name: string | null;
  email: string;
  academicYear: number | null;
  createdAt: string | null;
  enrolledCourses: number;
  averageGrade: number | null;
  totalPaid: number;
}
