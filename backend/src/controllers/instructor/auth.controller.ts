import type { Request, Response } from "express";
import { signup, validateInvite } from "@/services/signup.service";
import { loginUser } from "@/services/login.service";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password, ["instructor"]);
    res.json(result);
  } catch (err: any) {
    res.status(403).json({ message: err.message });
  }
};

export const signupController = async (req: Request, res: Response) => {
  try {
    const { name, token, password, title, specialization } = req.body as {
      name: string;
      token: string;
      password: string;
      title?: string;
      specialization?: string;
    };
    await signup(token, password, name, "instructor", { title, specialization });
    res.json({ message: "Instructor account created successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const validateInviteController = async (req: Request, res: Response) => {
  try {
    const { token } = req.query as { token?: string };
    if (!token) return res.status(400).json({ message: "token is required" });
    const result = await validateInvite(token, "instructor");
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
