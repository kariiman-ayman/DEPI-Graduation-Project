import type { Response, NextFunction } from "express";
import { auth, db } from "@/config/firebase";
import type { AuthRequest } from "@/types/request.types";

export const verifyUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Get token from header
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // 2. Verify token using Firebase
    const decoded = await auth.verifyIdToken(token);

    // 3. Get user from Firestore (for role)
    const userDoc = await db.collection("users").doc(decoded.uid).get();

    const userData = userDoc.data();

    if (!userData) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 4. Attach user to request
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: userData.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
