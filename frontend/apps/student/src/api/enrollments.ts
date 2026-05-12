import api from "_core/api";

const URL = "/student/enrollments";

export const enroll = async (req: string) => {
  const res = await api.post(`${URL}`, { courseId: req });
  return res.data;
};
