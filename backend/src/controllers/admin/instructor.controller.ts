import type { Request, Response } from "express";

import { getInstructors } from "../../services/user.service";

export const getInstructorsController = async (req: Request, res: Response) => {
  try {
    const instructors = await getInstructors();

    res.json(instructors);
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};
