import type { Response } from "express";
import axios from "axios";
import { auth, db } from "@/config/firebase";
import type { AuthRequest } from "@/types/request.types";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid;

    const [userDoc, coursesSnap] = await Promise.all([
      db.collection("users").doc(uid).get(),
      db.collection("courses").where("instructorId", "==", uid).get(),
    ]);

    if (!userDoc.exists) return res.status(404).json({ message: "User not found" });
    const user = userDoc.data()!;

    const courseIds = coursesSnap.docs.map((d) => d.id);

    // Count total students across all courses
    let totalStudents = 0;
    if (courseIds.length > 0) {
      const enrollmentSnaps = await Promise.all(
        courseIds.map((cId) =>
          db.collection("enrollments").where("courseId", "==", cId).get()
        )
      );
      const seen = new Set<string>();
      for (const snap of enrollmentSnaps) {
        for (const doc of snap.docs) {
          const sid = doc.data().studentId as string;
          if (sid) seen.add(sid);
        }
      }
      totalStudents = seen.size;
    }

    return res.json({
      uid,
      email: user.email,
      name: user.name,
      role: "instructor",
      title: user.title ?? null,
      specialization: user.specialization ?? null,
      createdAt: user.createdAt?.toDate?.()?.toISOString?.() ?? null,
      stats: {
        totalCourses: coursesSnap.size,
        totalStudents,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { name, title, specialization } = req.body as {
      name?: string;
      title?: string;
      specialization?: string;
    };

    if (!name || !name.trim()) return res.status(400).json({ message: "Name is required" });

    const updates: Record<string, string> = { name: name.trim() };
    if (title !== undefined) updates.title = title;
    if (specialization !== undefined) updates.specialization = specialization;

    await db.collection("users").doc(uid).update(updates);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "currentPassword and newPassword are required" });
    if (newPassword.length < 6)
      return res.status(400).json({ message: "New password must be at least 6 characters" });

    const userDoc = await db.collection("users").doc(uid).get();
    const email = userDoc.data()?.email as string;

    await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      { email, password: currentPassword, returnSecureToken: false }
    );

    await auth.updateUser(uid, { password: newPassword });
    return res.json({ success: true });
  } catch (err: any) {
    const msg = err?.response?.data?.error?.message ?? err.message;
    if (msg === "INVALID_PASSWORD" || msg === "INVALID_LOGIN_CREDENTIALS")
      return res.status(400).json({ message: "Current password is incorrect" });
    return res.status(500).json({ error: msg });
  }
};
