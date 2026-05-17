import type { Response } from "express";
import { db } from "../../config/firebase";
import type { AuthRequest } from "../../types/request.types";

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size)
    chunks.push(arr.slice(i, i + size));
  return chunks;
}

export const getLectures = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.uid;

    // 1. Get enrollments for this student, filter active in memory to avoid composite index requirement
    const enrollmentsSnap = await db
      .collection("enrollments")
      .where("studentId", "==", studentId)
      .get();

    if (enrollmentsSnap.empty) return res.json([]);

    const courseIds = enrollmentsSnap.docs
      .filter((d) => !d.data().status || d.data().status === "active")
      .map((d) => d.data().courseId as string);

    // 2. Fetch courses
    const courseDocs = await Promise.all(
      courseIds.map((id) => db.collection("courses").doc(id).get()),
    );
    const courseMap = new Map(courseDocs.map((d) => [d.id, d.data()]));

    // 3. Fetch lectures for those courses — no orderBy to avoid composite index requirement
    const lectureSnaps = await Promise.all(
      chunkArray(courseIds, 10).map((chunk) =>
        db.collection("lectures").where("courseId", "in", chunk).get(),
      ),
    );
    const allLectureDocs = lectureSnaps
      .flatMap((s) => s.docs)
      .sort((a, b) => {
        const aTime = a.data().createdAt?.toMillis?.() ?? 0;
        const bTime = b.data().createdAt?.toMillis?.() ?? 0;
        return bTime - aTime;
      });

    if (allLectureDocs.length === 0) return res.json([]);

    // 4. Fetch progress for this student
    const progressSnap = await db
      .collection("lectureProgress")
      .where("studentId", "==", studentId)
      .get();
    const progressMap = new Map(
      progressSnap.docs.map((d) => [d.data().lectureId as string, d.data()]),
    );

    // 5. Fetch unique instructors
    const instructorIds = [
      ...new Set(allLectureDocs.map((d) => d.data().instructorId as string)),
    ];
    const instructorDocs = await Promise.all(
      instructorIds.map((id) => db.collection("users").doc(id).get()),
    );
    const instructorMap = new Map(instructorDocs.map((d) => [d.id, d.data()]));

    // 6. Build response
    const lectures = allLectureDocs.map((doc) => {
      const data = doc.data();
      const course = courseMap.get(data.courseId);
      const instructor = instructorMap.get(data.instructorId);
      const progress = progressMap.get(doc.id);
      return {
        id: doc.id,
        title: data.title,
        videoUrl: data.videoUrl,
        courseId: data.courseId,
        courseName: course?.title ?? "Unknown Course",
        instructorName: instructor?.name ?? "Unknown Instructor",
        duration: data.duration ?? null,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
        watchProgress: progress?.progress ?? 0,
        watchedSeconds: progress?.watchedSeconds ?? 0,
        completed: progress?.completed ?? false,
      };
    });

    return res.json(lectures);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const saveProgress = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.uid;
    const { lectureId } = req.params;
    const { progress, watchedSeconds } = req.body as {
      progress: number;
      watchedSeconds: number;
    };

    if (typeof progress !== "number" || progress < 0 || progress > 100) {
      return res
        .status(400)
        .json({ message: "progress must be a number between 0 and 100" });
    }

    // Upsert: find existing doc or create
    const existingSnap = await db
      .collection("lectureProgress")
      .where("studentId", "==", studentId)
      .where("lectureId", "==", lectureId)
      .limit(1)
      .get();

    const payload = {
      studentId,
      lectureId,
      progress,
      watchedSeconds: watchedSeconds ?? 0,
      completed: progress >= 90,
      updatedAt: new Date(),
    };

    if (existingSnap.empty) {
      await db
        .collection("lectureProgress")
        .add({ ...payload, createdAt: new Date() });
    } else {
      await existingSnap.docs[0].ref.update(payload);
    }

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
