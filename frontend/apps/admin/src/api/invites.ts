import api from "_core/api";
import type { InviteDTO, InvitesList } from "../types/invites.types";

const URL = "/admin/invite";

export const invite = async (req: InviteDTO) => {
  const res = await api.post(URL, req);
  return res.data;
};

export const getInvitations = async (): Promise<InvitesList[]> => {
  const res = await api.get(`${URL}/list`);
  return res.data;
};
