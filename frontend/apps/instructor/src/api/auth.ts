import api from "_core/api";
import type { LoginRequest, SignUpRequest } from "_core/types/auth.types";

const URL = "/instructor/auth";

export const Signup = async (req: SignUpRequest) => {
  const res = await api.post(`${URL}/signup`, req);
  return res.data;
};

export const Login = async (req: LoginRequest) => {
  const res = await api.post(`${URL}/login`, req);
  return res.data;
};

export const validateInvite = async (token: string): Promise<{ email: string; role: string }> => {
  const res = await api.get(`${URL}/validate-invite`, { params: { token } });
  return res.data;
};

export interface InstructorSignUpRequest {
  token: string;
  name: string;
  password: string;
  title?: string;
  specialization?: string;
}

export const SignupInstructor = async (req: InstructorSignUpRequest) => {
  const res = await api.post(`${URL}/signup`, req);
  return res.data;
};
