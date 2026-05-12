import type { Response } from "express";

import cloudinary from "@/config/cloudinary";
import { db } from "@/config/firebase";

import type { AuthRequest } from "@/types/request.types";

export const uploadLecture = async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    const { title, courseId } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer to base64 data URI
    const base64 = file.buffer.toString("base64");
    const dataUri = `data:${file.mimetype};base64,${base64}`;

    // Upload directly — no stream needed
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      resource_type: "video",
      folder: "lectures",
    });

    const lectureRef = await db.collection("lectures").add({
      title,
      courseId,
      instructorId: req.user?.uid,
      videoUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      createdAt: new Date(),
    });

    return res.status(201).json({
      message: "Lecture uploaded successfully",
      lectureId: lectureRef.id,
      videoUrl: uploadResult.secure_url,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
