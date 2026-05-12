export interface CreateCourseDTO {
  title: string;
  credits: number;
  lectureTime: {
    day: string;
    start: string;
    end: string;
  };
  instructorId: string;
  departmentId: string;
  minYear?: number | null;
  capacity?: number | null;
}

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
