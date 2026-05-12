import api from "_core/api";

export interface InstructorProfile {
  uid: string;
  email: string;
  name: string;
  role: "instructor";
  title: string | null;
  specialization: string | null;
  createdAt: string | null;
  stats: {
    totalCourses: number;
    totalStudents: number;
  };
}

export const getProfile = async (): Promise<InstructorProfile> => {
  const res = await api.get("/instructor/profile");
  return res.data;
};

export const updateProfile = async (data: {
  name: string;
  title?: string;
  specialization?: string;
}): Promise<void> => {
  await api.patch("/instructor/profile", data);
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  await api.post("/instructor/profile/change-password", data);
};
