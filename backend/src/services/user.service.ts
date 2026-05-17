import { db } from "../config/firebase.js";

export const getInstructors = async () => {
  const snapshot = await db
    .collection("users")
    .where("role", "==", "instructor")
    .get();

  return snapshot.docs.map((doc) => {
    const user = doc.data();

    return {
      id: doc.id,

      name: user.name,

      email: user.email,

      role: user.role,

      createdAt: user.createdAt,
    };
  });
};
