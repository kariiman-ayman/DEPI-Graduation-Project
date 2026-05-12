import type { Request, Response } from "express";

import type { CreateCourseDTO } from "@/types/course.types";

import { createCourse } from "@/services/course.service";

export const createCourseController = async (
  req: Request<{}, {}, CreateCourseDTO>,
  res: Response,
) => {
  try {
    const course = await createCourse(req.body);

    res.status(201).json({
      message: "Course created successfully",

      course,
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};
