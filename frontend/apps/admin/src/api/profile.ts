import api from "_core/api";

export interface AdminProfile {
  uid: string;
  email: string;
  name: string;
  role: "admin";
  createdAt: string | null;
  stats: {
    totalInvites: number;
    acceptedInvites: number;
    totalUsers: number;
  };
}

export const getProfile = async (): Promise<AdminProfile> => {
  const res = await api.get("/admin/profile");
  return res.data;
};

export const updateProfile = async (data: { name: string }): Promise<void> => {
  await api.patch("/admin/profile", data);
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  await api.post("/admin/profile/change-password", data);
};
