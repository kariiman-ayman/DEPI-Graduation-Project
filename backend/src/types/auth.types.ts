import type { Role } from "./common.types.js";

export interface SignupDTO {
  email: string;
  password: string;
  role: Role;
}

export interface LoginDTO {
  email: string;
  password: string;
}
