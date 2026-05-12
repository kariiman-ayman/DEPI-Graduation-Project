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
