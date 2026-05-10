import type { Role } from "_core/types/common.types";

export interface InviteDTO {
  email: string;
  role: string;
}

export interface InvitesList {
  id: string;
  email: string;
  role: Role;
  token: string;
  used: boolean;
  expiresAt: Date;
}
