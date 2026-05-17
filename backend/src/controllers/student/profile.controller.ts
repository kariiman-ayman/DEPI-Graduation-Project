import type { Response } from "express";
import axios from "axios";
import { auth, db } from "../../config/firebase.js";
import type { AuthRequest } from "../../types/request.types.js";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid;

    const [userDoc, enrollmentsSnap, attendanceSnap, gradesSnap, paymentsSnap] =
      await Promise.all([
        db.collection("users").doc(uid).get(),
        db.collection("enrollments").where("studentId", "==", uid).get(),
        db.collection("attendance").where("studentId", "==", uid).get(),
        db.collection("grades").where("studentId", "==", uid).get(),
        db.collection("payments").where("studentId", "==", uid).get(),
      ]);

    if (!userDoc.exists)
      return res.status(404).json({ message: "User not found" });
    const user = userDoc.data()!;

    const activeEnrollments = enrollmentsSnap.docs.filter(
      (d) => !d.data().status || d.data().status === "active",
    );

    const attRecords = attendanceSnap.docs.map((d) => d.data());
    const attPresent = attRecords.filter((r) => r.status === "present").length;
    const attendanceRate =
      attRecords.length > 0
        ? Math.round((attPresent / attRecords.length) * 100)
        : 0;

    const gradeValues = gradesSnap.docs
      .map((d) => d.data().grade)
      .filter((g) => g !== null && g !== undefined && !isNaN(Number(g)))
      .map(Number);
    const averageGrade =
      gradeValues.length > 0
        ? Math.round(
            (gradeValues.reduce((s, g) => s + g, 0) / gradeValues.length) * 10,
          ) / 10
        : ((user.initialGpa as number | undefined) ?? null);

    const totalPaid = paymentsSnap.docs
      .filter((d) => d.data().status === "paid")
      .reduce((sum, d) => sum + (d.data().amount ?? 0), 0);

    return res.json({
      uid,
      email: user.email,
      name: user.name,
      role: "student",
      academicYear: (user.academicYear as number | undefined) ?? null,
      createdAt: user.createdAt?.toDate?.()?.toISOString?.() ?? null,
      stats: {
        enrolledCourses: activeEnrollments.length,
        attendanceRate,
        averageGrade,
        totalPaid,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { name } = req.body as { name?: string };

    if (!name || !name.trim())
      return res.status(400).json({ message: "Name is required" });

    const updates: Record<string, unknown> = { name: name.trim() };

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
      return res
        .status(400)
        .json({ message: "currentPassword and newPassword are required" });
    if (newPassword.length < 6)
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });

    const userDoc = await db.collection("users").doc(uid).get();
    const email = userDoc.data()?.email as string;

    await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      { email, password: currentPassword, returnSecureToken: false },
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
