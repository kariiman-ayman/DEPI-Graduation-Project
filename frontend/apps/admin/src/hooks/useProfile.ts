import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, changePassword } from "../api/profile.js";

export const useProfile = () =>
  useQuery({ queryKey: ["admin-profile"], queryFn: getProfile });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-profile"] }),
  });
};

export const useChangePassword = () =>
  useMutation({ mutationFn: changePassword });
