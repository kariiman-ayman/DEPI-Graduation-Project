import { useQuery } from "@tanstack/react-query";
import { getCourses, getEnrolledCourses } from "../api/courses.js";

export const useCourses = () =>
  useQuery({ queryKey: ["courses"], queryFn: getCourses });

export const useEnrolledCourses = () =>
  useQuery({ queryKey: ["enrolled-courses"], queryFn: getEnrolledCourses });
