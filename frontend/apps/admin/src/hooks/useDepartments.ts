import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDepartment,
  getDepartments,
  deleteDepartment,
} from "../api/department.js";

export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDepartment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"], // refetch invitations automatically
      });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDepartment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"], // refetch invitations automatically
      });
    },
  });
};
