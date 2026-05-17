import axios from "axios";
import { db } from "../config/firebase.js";

export const loginUser = async (
  email: string,
  password: string,
  allowedRoles: string[],
) => {
  const apiKey = process.env.FIREBASE_API_KEY;

  // 1. Firebase login
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      email,
      password,
      returnSecureToken: true,
    },
  );

  const { idToken, localId } = response.data;

  // 2. Get user from Firestore
  const userDoc = await db.collection("users").doc(localId).get();

  if (!userDoc.exists) {
    throw new Error("User not found");
  }

  const user = userDoc.data();

  if (!user) {
    throw new Error("User not found");
  }

  // 3. ROLE CHECK (IMPORTANT PART)
  if (!allowedRoles.includes(user.role)) {
    throw new Error("You are not allowed to login to this app");
  }

  return {
    token: idToken,
    uid: localId,
    user,
  };
};
