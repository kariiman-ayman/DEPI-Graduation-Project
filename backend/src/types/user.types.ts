import type { Role } from "./common.types";

export interface User {
  uid: string;
  email: string;
  role: Role;
  createdAt: Date;
}
