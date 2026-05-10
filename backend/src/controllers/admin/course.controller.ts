import type { Request, Response } from "express";

import type { CreateCourseDTO } from "@/types/course.types";

import { getCourses } from "@/services/course.service";
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
