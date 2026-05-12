import api from "_core/api";
import type { AttendanceResponse } from "../types/attendance.types";

export const getMyAttendance = async (): Promise<AttendanceResponse> => {
  const res = await api.get("/student/attendance");
  return res.data;
};
