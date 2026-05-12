export interface UploadLectureDTO {
  title: string;
  courseId: string;
  video: File;
}

export interface InstructorLecture {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  videoUrl: string;
  duration: number | null;
  createdAt: string | null;
}
