import api from "_core/api";
import type {
  InstructorLecture,
  UploadLectureDTO,
} from "../types/lecture.types";

const URL = "/instructor/lecture";

export const getLectures = async (
  courseId?: string,
): Promise<InstructorLecture[]> => {
  const res = await api.get(URL, {
    params: courseId ? { courseId } : undefined,
  });
  return res.data;
};

export const uploadLecture = async (req: UploadLectureDTO) => {
  const formData = new FormData();

  formData.append("title", req.title);
  formData.append("courseId", req.courseId);
  formData.append("video", req.video);
  const res = await api.post(`${URL}`, formData);
  return res.data;
};
