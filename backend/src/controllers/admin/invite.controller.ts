import type { Request, Response } from "express";
import { db } from "@/config/firebase";
import { generateInviteToken } from "@/utils/generateToken";
import { sendInviteEmail } from "@/services/email.service";

export const inviteUser = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;

    // generate token
    const token = generateInviteToken();

    // expiry (24 hours)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // save invite in firestore
    await db.collection("invites").doc(token).set({
      email,
      role,
      token,
      used: false,
      expiresAt,
    });

    // frontend signup page
    const inviteLink = `${process.env.FRONTEND_URL}/signup?token=${token}`;

    // send email
    await sendInviteEmail(email, inviteLink);

    res.json({
      message: "Invitation sent successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const getInvitations = async (req: Request, res: Response) => {
  try {
    const snapshot = await db
      .collection("invites")
      .orderBy("expiresAt", "desc")
      .get();

    const invitations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(invitations);
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
};
