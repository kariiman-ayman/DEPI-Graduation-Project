export interface CoursesList {
  id: string;
  title: string;
  credits: number;
  lectureTime: {
    day: string;
    start: string;
    end: string;
  };
  instructor: {
    id: string;
    name: string;
    email: string;
  } | null;
  department: {
    id: string;
    code: string;
    name: string;
  } | null;
  minYear: number | null;
  capacity: number | null;
  enrolledCount: number;
}

export interface EnrolledCourse {
  enrollmentId: string;
  courseId: string;
  title: string;
  credits: number;
  lectureTime: {
    day: string;
    start: string;
    end: string;
  };
  instructor: {
    id: string;
    name: string;
    email: string;
  } | null;
  department: {
    id: string;
    code: string;
    name: string;
  } | null;
  grade: {
    letterGrade: string | null;
    gradePoints: number | null;
    total: number | null;
  } | null;
  enrolledAt: string | null;
}
