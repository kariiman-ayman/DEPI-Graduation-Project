import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, changePassword } from "../api/profile";

export const useProfile = () =>
  useQuery({ queryKey: ["student-profile"], queryFn: getProfile });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["student-profile"] }),
  });
};

export const useChangePassword = () =>
  useMutation({ mutationFn: changePassword });
