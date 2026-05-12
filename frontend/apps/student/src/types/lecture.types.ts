export interface Lecture {
  id: string;
  title: string;
  videoUrl: string;
  courseId: string;
  courseName: string;
  instructorName: string;
  duration: number | null;
  createdAt: string | null;
  watchProgress: number;
  watchedSeconds: number;
  completed: boolean;
}
