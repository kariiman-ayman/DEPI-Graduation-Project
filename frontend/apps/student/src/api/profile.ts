import api from "_core/api";

export interface StudentProfile {
  uid: string;
  email: string;
  name: string;
  role: "student";
  academicYear: number | null;
  createdAt: string | null;
  stats: {
    enrolledCourses: number;
    attendanceRate: number;
    averageGrade: number | null;
    totalPaid: number;
  };
}

export const getProfile = async (): Promise<StudentProfile> => {
  const res = await api.get("/student/profile");
  return res.data;
};

export const updateProfile = async (data: { name: string }): Promise<void> => {
  await api.patch("/student/profile", data);
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  await api.post("/student/profile/change-password", data);
};
