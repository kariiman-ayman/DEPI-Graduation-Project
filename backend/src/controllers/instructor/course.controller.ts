import type { Request, Response } from "express";

import { getInstructorCourses } from "../../services/course.service.js";

export const getCoursesController = async (req: Request, res: Response) => {
  try {
    const instructorId = req.user?.uid;

    if (!instructorId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const courses = await getInstructorCourses(instructorId);

    res.json(courses);
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};
