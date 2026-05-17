import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInvitations,
  invite,
  resendInvitation,
  revokeInvitation,
} from "../api/invites";
import type { InviteDTO } from "../types/invites.types";

const KEY = ["invitations"] as const;

export const useInvitations = () =>
  useQuery({ queryKey: KEY, queryFn: getInvitations });

export const useCreateInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: InviteDTO) => invite(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useResendInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => resendInvitation(token),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useRevokeInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => revokeInvitation(token),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};
