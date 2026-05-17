import { useNavigate } from "react-router";
import { useCourses } from "../hooks/useCourses";
import { BookOpen, Calendar, Clock, Users, Layers } from "lucide-react";
import { Badge } from "_core/components/ui/badge";
import { Button } from "_core/components/ui/button";

function CourseCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-16" />
        <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
      </div>
      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full" />
      <div className="h-9 bg-gray-100 dark:bg-gray-700 rounded mt-2" />
    </div>
  );
}

export default function InstructorCourses() {
  const navigate = useNavigate();
  const { data: courses, isLoading, isError } = useCourses();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          My Courses
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your courses and student grades
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl px-4 py-3 text-sm text-red-600">
          Failed to load courses
        </div>
      )}

      {!isLoading && !isError && courses?.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-indigo-500" />
          </div>
          <p className="font-semibold text-gray-900 dark:text-white">
            No courses assigned
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Contact an admin to be assigned to a course
          </p>
        </div>
      )}

      {!isLoading && !isError && courses && courses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {courses.map((course) => {
            const isFull =
              course.capacity !== null &&
              course.enrolledCount >= course.capacity;
            const fillPct =
              course.capacity !== null
                ? Math.min((course.enrolledCount / course.capacity) * 100, 100)
                : null;

            return (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-block text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full mb-2">
                      {course.department?.code ?? "—"}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {course.department?.name ?? "—"}
                    </p>
                  </div>
                  {isFull && (
                    <Badge className="shrink-0 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                      Full
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {course.lectureTime.day}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {course.lectureTime.start}–{course.lectureTime.end}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {course.credits} credits
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.enrolledCount}
                      {course.capacity !== null
                        ? `/${course.capacity}`
                        : ""}{" "}
                      enrolled
                    </span>
                    {fillPct !== null && <span>{Math.round(fillPct)}%</span>}
                  </div>
                  {fillPct !== null && (
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isFull ? "bg-red-500" : "bg-indigo-500"}`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  )}
                  {course.minYear !== null && (
                    <p className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <Layers className="w-3 h-3" />
                      Requires Year {course.minYear}+
                    </p>
                  )}
                </div>

                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  size="sm"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  Manage Course
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
