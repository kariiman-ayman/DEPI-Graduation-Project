import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Login } from "../api/auth";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: Login,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
    },
  });
};
