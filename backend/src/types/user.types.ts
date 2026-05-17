import type { Role } from "./common.types.js";

export interface User {
  uid: string;
  email: string;
  role: Role;
  createdAt: Date;
}
