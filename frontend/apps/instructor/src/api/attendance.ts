import api from "_core/api";
import type {
  CourseAttendanceResponse,
  SaveAttendanceDTO,
} from "../types/attendance.types";

export const getCourseAttendance = async (
  courseId: string,
  date: string,
): Promise<CourseAttendanceResponse> => {
  const res = await api.get("/instructor/attendance", {
    params: { courseId, date },
  });
  return res.data;
};

export const saveAttendance = async (dto: SaveAttendanceDTO): Promise<void> => {
  await api.post("/instructor/attendance", dto);
};
