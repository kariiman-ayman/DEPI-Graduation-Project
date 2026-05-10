export interface CoursesList {
  id: string;
  title: string;
  credits: number;
  lectureTime: {
    day: string;
    start: string;
    end: string;
  };
  department: {
    id: string;
    code: string;
    name: string;
  };
}
