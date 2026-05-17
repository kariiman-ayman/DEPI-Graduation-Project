import type { Request, Response } from "express";
import { db } from "../../config/firebase";
import { generateInviteToken } from "../../utils/generateToken";
import { sendInviteEmail } from "../../services/email.service";

const VALID_ROLES = ["student", "instructor", "admin"] as const;
type Role = (typeof VALID_ROLES)[number];

function roleAppUrl(role: string): string {
  switch (role) {
    case "student":
      return (
        process.env.STUDENT_FRONTEND_URL ??
        process.env.FRONTEND_URL ??
        "http://localhost:5173"
      );
    case "instructor":
      return (
        process.env.INSTRUCTOR_FRONTEND_URL ??
        process.env.FRONTEND_URL ??
        "http://localhost:5174"
      );
    default:
      return (
        process.env.ADMIN_FRONTEND_URL ??
        process.env.FRONTEND_URL ??
        "http://localhost:5175"
      );
  }
}

// ---------------------------------------------------------------------------
// POST /admin/invite
// ---------------------------------------------------------------------------

export const inviteUser = async (req: Request, res: Response) => {
  try {
    const { email, role, academicYear, initialGpa } = req.body as {
      email?: string;
      role?: string;
      academicYear?: number;
      initialGpa?: number;
    };

    if (!email || !role || !VALID_ROLES.includes(role as Role)) {
      return res
        .status(400)
        .json({ message: "Valid email and role are required" });
    }

    if (
      role === "student" &&
      (!academicYear || ![1, 2, 3, 4].includes(academicYear))
    ) {
      return res
        .status(400)
        .json({
          message: "Academic year (1–4) is required for student invitations",
        });
    }

    if (
      initialGpa !== undefined &&
      (typeof initialGpa !== "number" || initialGpa < 0 || initialGpa > 4)
    ) {
      return res
        .status(400)
        .json({ message: "Initial GPA must be between 0.0 and 4.0" });
    }

    const token = generateInviteToken();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
    const now = new Date();
    const inviteLink = `${roleAppUrl(role)}/signup?token=${token}`;

    await db
      .collection("invites")
      .doc(token)
      .set({
        email,
        role,
        token,
        used: false,
        inviteLink,
        expiresAt,
        createdAt: now,
        ...(role === "student" && academicYear ? { academicYear } : {}),
        ...(role === "student" && initialGpa !== undefined
          ? { initialGpa }
          : {}),
      });

    sendInviteEmail(email, inviteLink, role as Role).catch((err) => {
      console.error("Failed to send invite email:", err);
    });

    return res.json({
      message: "Invitation sent successfully",
      token,
      inviteLink,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// GET /admin/invite/list
// ---------------------------------------------------------------------------

export const getInvitations = async (_req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("invites").get();

    const now = new Date();

    const invitations = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        const expiresAt = data.expiresAt?.toDate?.() ?? null;
        const expired = !data.used && expiresAt !== null && expiresAt < now;
        return {
          id: doc.id,
          email: data.email as string,
          role: data.role as string,
          token: data.token as string,
          used: data.used as boolean,
          expired,
          inviteLink: (data.inviteLink as string | undefined) ?? null,
          expiresAt: expiresAt?.toISOString() ?? null,
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
          academicYear: (data.academicYear as number | undefined) ?? null,
          initialGpa: (data.initialGpa as number | undefined) ?? null,
        };
      })
      .sort((a, b) => {
        const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bt - at;
      });

    return res.json(invitations);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// POST /admin/invite/:token/resend
// ---------------------------------------------------------------------------

export const resendInvite = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const doc = await db.collection("invites").doc(token).get();
    if (!doc.exists)
      return res.status(404).json({ message: "Invitation not found" });

    const invite = doc.data()!;
    if (invite.used)
      return res.status(400).json({ message: "Invitation already used" });

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const inviteLink: string =
      (invite.inviteLink as string | undefined) ??
      `${roleAppUrl(invite.role)}/signup?token=${token}`;

    await db.collection("invites").doc(token).update({ expiresAt, inviteLink });

    sendInviteEmail(
      invite.email as string,
      inviteLink,
      invite.role as Role,
    ).catch((err) => {
      console.error("Failed to resend invite email:", err);
    });

    return res.json({ message: "Invitation resent successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// DELETE /admin/invite/:token
// ---------------------------------------------------------------------------

export const revokeInvite = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const doc = await db.collection("invites").doc(token).get();
    if (!doc.exists)
      return res.status(404).json({ message: "Invitation not found" });
    if (doc.data()?.used) {
      return res
        .status(400)
        .json({ message: "Cannot revoke an accepted invitation" });
    }

    await db.collection("invites").doc(token).delete();

    return res.json({ message: "Invitation revoked" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
