export interface CourseAttendance {
  courseId: string;
  courseName: string;
  present: number;
  total: number;
  percentage: number;
  records: { date: string; status: "present" | "absent" }[];
}

export interface AttendanceResponse {
  courses: CourseAttendance[];
  calendar: { date: string; status: "present" | "absent" }[];
  overall: { present: number; total: number; percentage: number };
}
