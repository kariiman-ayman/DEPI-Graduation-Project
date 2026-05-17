import type { Request, Response } from "express";
import { signup } from "../../services/signup.service";
import { loginUser } from "../../services/login.service";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password, ["admin"]);

    res.json(result);
  } catch (err: any) {
    res.status(403).json({
      message: err.message,
    });
  }
};

export const signupController = async (req: Request, res: Response) => {
  try {
    const { name, token, password } = req.body;

    await signup(token, password, name, "admin");

    res.json({
      message: "Admin account created successfully",
    });
  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
};
