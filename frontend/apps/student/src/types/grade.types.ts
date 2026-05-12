export interface StudentGrade {
  courseId: string;
  courseName: string;
  departmentId: string;
  credits: number;
  midterm: number | null;
  assignments: number | null;
  project: number | null;
  final: number | null;
  total: number | null;
  letterGrade: string | null;
  gradePoints: number | null;
  hasGrade: boolean;
}

export interface GradesResponse {
  grades: StudentGrade[];
  gpa: number;
  totalCredits: number;
  gradedCredits: number;
}
