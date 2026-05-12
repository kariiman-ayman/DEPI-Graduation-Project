export interface InstructorCourseGrade {
  studentId: string;
  studentName: string;
  studentEmail: string;
  midterm: number | null;
  assignments: number | null;
  project: number | null;
  final: number | null;
  total: number | null;
  letterGrade: string | null;
  gradePoints: number | null;
  hasGrade: boolean;
}

export interface UpsertGradeDTO {
  studentId: string;
  courseId: string;
  midterm: number;
  assignments: number;
  project: number;
  final: number;
}
