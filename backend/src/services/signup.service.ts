import { auth, db } from "../config/firebase";

export const signup = async (
  token: string,
  password: string,
  name: string,
  expectedRole: "student" | "instructor" | "admin",
  extra?: Record<string, string | undefined>,
) => {
  const inviteDoc = await db.collection("invites").doc(token).get();

  if (!inviteDoc.exists) throw new Error("Invalid invite");

  const invite = inviteDoc.data();
  if (!invite) throw new Error("Invalid invite");
  if (invite.used) throw new Error("Invite already used");
  if (new Date(invite.expiresAt.toDate()) < new Date())
    throw new Error("Invite expired");
  if (invite.role !== expectedRole) throw new Error("Invite role mismatch");

  const user = await auth.createUser({ email: invite.email, password });

  const extraFields: Record<string, string> = {};
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v !== undefined && v !== "") extraFields[k] = v;
    }
  }

  // Carry invite-level fields (e.g. academicYear) into the user doc automatically
  const inviteCarry: Record<string, unknown> = {};
  if (invite.academicYear !== undefined)
    inviteCarry.academicYear = invite.academicYear;
  if (invite.initialGpa !== undefined)
    inviteCarry.initialGpa = invite.initialGpa;

  await db
    .collection("users")
    .doc(user.uid)
    .set({
      email: invite.email,
      role: invite.role,
      name,
      ...inviteCarry,
      ...extraFields,
      createdAt: new Date(),
    });

  await db.collection("invites").doc(token).update({ used: true });

  return user;
};

// Validate an invite token without consuming it
export const validateInvite = async (
  token: string,
  expectedRole: string,
): Promise<{ email: string; role: string; academicYear?: number }> => {
  const inviteDoc = await db.collection("invites").doc(token).get();
  if (!inviteDoc.exists) throw new Error("Invalid invitation link");

  const invite = inviteDoc.data()!;
  if (invite.used) throw new Error("This invitation has already been used");
  if (new Date(invite.expiresAt.toDate()) < new Date())
    throw new Error("This invitation has expired");
  if (invite.role !== expectedRole)
    throw new Error("This invitation is not valid for this portal");

  return {
    email: invite.email as string,
    role: invite.role as string,
    ...(invite.academicYear !== undefined
      ? { academicYear: invite.academicYear as number }
      : {}),
  };
};
