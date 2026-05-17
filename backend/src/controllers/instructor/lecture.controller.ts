import type { Response } from "express";

import cloudinary from "../../config/cloudinary.js";
import { db } from "../../config/firebase.js";

import type { AuthRequest } from "../../types/request.types.js";

export const getInstructorLectures = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const instructorId = req.user!.uid;
    const { courseId } = req.query;

    const snap = await db
      .collection("lectures")
      .where("instructorId", "==", instructorId)
      .get();
    if (snap.empty) return res.json([]);

    const docs = courseId
      ? snap.docs.filter((d) => d.data().courseId === courseId)
      : snap.docs;

    const courseIds = [
      ...new Set(docs.map((d) => d.data().courseId as string)),
    ];
    const courseDocs = await Promise.all(
      courseIds.map((id) => db.collection("courses").doc(id).get()),
    );
    const courseMap = new Map(courseDocs.map((d) => [d.id, d.data()]));

    const lectures = docs
      .sort((a, b) => {
        const aTime = a.data().createdAt?.toMillis?.() ?? 0;
        const bTime = b.data().createdAt?.toMillis?.() ?? 0;
        return bTime - aTime;
      })
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title as string,
          courseId: data.courseId as string,
          courseName: (courseMap.get(data.courseId)?.title as string) ?? "—",
          videoUrl: data.videoUrl as string,
          duration: (data.duration as number | null) ?? null,
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
        };
      });

    return res.json(lectures);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

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
      duration: uploadResult.duration ?? null,
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
