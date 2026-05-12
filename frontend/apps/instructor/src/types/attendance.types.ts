export interface StudentAttendanceRow {
  studentId: string;
  name: string;
  email: string;
  todayStatus: "present" | "absent" | null;
  attendanceRate: number;
  present: number;
  total: number;
  lastSessions: { date: string; status: "present" | "absent" | null }[];
}

export interface CourseAttendanceResponse {
  students: StudentAttendanceRow[];
  sessionDates: string[];
  selectedDate: string;
}

export interface SaveAttendanceDTO {
  courseId: string;
  date: string;
  records: { studentId: string; status: "present" | "absent" }[];
}
