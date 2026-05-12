import { getCourses } from "@/services/course.service";
import type { Request, Response } from "express";

export const getCoursesController = async (req: Request, res: Response) => {
  try {
    const courses = await getCourses();

    res.json(courses);
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};
