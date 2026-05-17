import api from "_core/api";
import type { InviteDTO, InvitesList } from "../types/invites.types.js";

const BASE = "/admin/invite";

export const invite = async (req: InviteDTO): Promise<void> => {
  await api.post(BASE, req);
};

export const getInvitations = async (): Promise<InvitesList[]> => {
  const res = await api.get(`${BASE}/list`);
  return res.data;
};

export const resendInvitation = async (token: string): Promise<void> => {
  await api.post(`${BASE}/${token}/resend`);
};

export const revokeInvitation = async (token: string): Promise<void> => {
  await api.delete(`${BASE}/${token}`);
};
