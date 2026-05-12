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
  };
  department: {
    id: string;
    code: string;
    name: string;
  };
}
