import api from "_core/api";

export interface DashboardStats {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalCollected: number;
  totalOutstanding: number;
  totalOverdue: number;
}

export interface RecentStudent {
  id: string;
  name: string | null;
  email: string;
  createdAt: string | null;
}

export interface DeptCourseCount {
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  courseCount: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentStudents: RecentStudent[];
  coursesByDepartment: DeptCourseCount[];
}

export const getDashboard = async (): Promise<DashboardData> => {
  const res = await api.get("admin/dashboard");
  return res.data;
};
