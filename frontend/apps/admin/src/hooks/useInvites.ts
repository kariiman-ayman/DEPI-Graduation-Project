import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getInvitations, invite } from "../api/invites";

export const useInvitations = () => {
  return useQuery({
    queryKey: ["invitations"],
    queryFn: getInvitations,
  });
};

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invite,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invitations"], // refetch invitations automatically
      });
    },
  });
};
