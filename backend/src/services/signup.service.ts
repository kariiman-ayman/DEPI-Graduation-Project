import { auth, db } from "@/config/firebase";

export const signup = async (
  token: string,
  password: string,
  name: string,
  expectedRole: "student" | "instructor" | "admin",
) => {
  const inviteDoc = await db.collection("invites").doc(token).get();

  if (!inviteDoc.exists) {
    throw new Error("Invalid invite");
  }

  const invite = inviteDoc.data();

  if (!invite) {
    throw new Error("Invalid invite");
  }

  if (invite.used) {
    throw new Error("Invite already used");
  }

  if (new Date(invite.expiresAt.toDate()) < new Date()) {
    throw new Error("Invite expired");
  }

  // enforce role match (IMPORTANT PART)
  if (invite.role !== expectedRole) {
    throw new Error("Invite role mismatch");
  }

  const user = await auth.createUser({
    email: invite.email,
    password,
  });

  await db.collection("users").doc(user.uid).set({
    email: invite.email,
    role: invite.role,
    name,
    createdAt: new Date(),
  });

  await db.collection("invites").doc(token).update({
    used: true,
  });

  return user;
};
