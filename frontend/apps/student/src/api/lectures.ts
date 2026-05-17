import api from "_core/api";
import type { Lecture } from "../types/lecture.types";

const URL = "/student/lectures";

export const getLectures = async (): Promise<Lecture[]> => {
  const res = await api.get(URL);
  return res.data;
};

export const saveProgress = async (
  lectureId: string,
  progress: number,
  watchedSeconds: number,
): Promise<void> => {
  await api.post(`${URL}/${lectureId}/progress`, { progress, watchedSeconds });
};
