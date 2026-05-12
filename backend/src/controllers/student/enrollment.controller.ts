import type { Response } from "express";
import type { AuthRequest } from "@/types/request.types";
import { enrollStudent } from "@/services/enrollment.service";

export const enroll = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.uid;

    const { courseId } = req.body;

    const enrollmentId = await enrollStudent(studentId!, courseId);

    res.json({
      message: "Enrollment successful",
      enrollmentId,
    });
  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
};
