import { db } from "../config/firebase.js";

import type { CreateDepartmentDTO } from "../types/department.types.js";

export const createDepartment = async (data: CreateDepartmentDTO) => {
  // check if code already exists
  const existing = await db
    .collection("departments")
    .where("code", "==", data.code)
    .get();

  if (!existing.empty) {
    throw new Error("Department code already exists");
  }

  const departmentRef = await db.collection("departments").add({
    name: data.name,
    code: data.code,
    createdAt: new Date(),
  });

  return {
    id: departmentRef.id,
    ...data,
  };
};

export const getDepartments = async () => {
  const snapshot = await db
    .collection("departments")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,

    ...doc.data(),
  }));
};

export const deleteDepartment = async (id: string) => {
  const departmentDoc = await db.collection("departments").doc(id).get();

  if (!departmentDoc.exists) {
    throw new Error("Department not found");
  }

  await db.collection("departments").doc(id).delete();

  return {
    message: "Department deleted successfully",
  };
};
