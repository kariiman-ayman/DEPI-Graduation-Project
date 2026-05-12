export type InviteRole = "student" | "instructor" | "admin";

export interface InviteDTO {
  email: string;
  role: InviteRole;
  academicYear?: number;
  initialGpa?: number;
}

export interface InvitesList {
  id: string;
  email: string;
  role: InviteRole;
  token: string;
  used: boolean;
  expired: boolean;
  inviteLink: string | null;
  expiresAt: string | null;
  createdAt: string | null;
  academicYear: number | null;
  initialGpa: number | null;
}
