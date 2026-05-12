import api from "_core/api";
import type { LoginRequest, SignUpRequest } from "_core/types/auth.types";

const URL = "/admin/auth";

export const Signup = async (req: SignUpRequest) => {
  const res = await api.post(`${URL}/signup`, req);
  return res.data;
};

export const Login = async (req: LoginRequest) => {
  const res = await api.post(`${URL}/login`, req);
  return res.data;
};
