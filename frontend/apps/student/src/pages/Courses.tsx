import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AlertCircle, BookOpen, Calendar, Plus, Video, Users, Layers } from "lucide-react";
import { Badge } from "_core/components/ui/badge";
import { Button } from "_core/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "_core/components/ui/tabs";
import { useCourses, useEnrolledCourses } from "../hooks/useCourses";
import { useEnrollCourse } from "../hooks/useEnrollments";
import { useProfile } from "../hooks/useProfile";

function gradeColor(letter: string | null) {
  if (!letter) return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
  if (letter.startsWith("A")) return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400";
  if (letter.startsWith("B")) return "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400";
  if (letter.startsWith("C")) return "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400";
  return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400";
}

function CourseCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-3 animate-pulse">
      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-16" />
      <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-9 bg-gray-100 dark:bg-gray-700 rounded mt-2" />
    </div>
  );
}

export default function StudentCourses() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"enrolled" | "available">(
    tabFromUrl === "available" ? "available" : "enrolled"
  );
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const { data: availableCourses, isLoading: loadingAvailable, isError: errorAvailable } = useCourses();
  const { data: enrolledCourses, isLoading: loadingEnrolled, isError: errorEnrolled } = useEnrolledCourses();
  const { mutateAsync: enrollMutate } = useEnrollCourse();
  const { data: profile } = useProfile();
  const studentYear = profile?.academicYear ?? null;

  const enrolledIds = new Set((enrolledCourses ?? []).map((c) => c.courseId));

  function onTabChange(next: string) {
    const value = next === "available" ? "available" : "enrolled";
    setActiveTab(value);
    setSearchParams(value === "available" ? { tab: "available" } : {}, { replace: true });
  }

  async function handleEnroll(courseId: string) {
    setEnrollingId(courseId);
    setEnrollError(null);
    try {
      await enrollMutate(courseId);
      onTabChange("enrolled");
    } catch (err) {
      setEnrollError(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setEnrollingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">My Courses</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View enrolled courses and register for new ones
          </p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={() => onTabChange("available")}>
          <Plus className="w-4 h-4" />
          Browse Courses
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="enrolled" className="gap-1.5">
            Enrolled
            {enrolledCourses && enrolledCourses.length > 0 && (
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-full">
                {enrolledCourses.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
        </TabsList>

        {/* ── Enrolled ── */}
        <TabsContent value="enrolled" className="space-y-4">
          {loadingEnrolled && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => <CourseCardSkeleton key={i} />)}
            </div>
          )}

          {errorEnrolled && (
            <div className="flex items-center gap-3 text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-sm">Failed to load enrolled courses</p>
            </div>
          )}

          {!loadingEnrolled && !errorEnrolled && enrolledCourses?.length === 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-indigo-500" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">No enrolled courses</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
                Browse available courses to get started
              </p>
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => onTabChange("available")}>
                <Plus className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
            </div>
          )}

          {!loadingEnrolled && !errorEnrolled && enrolledCourses && enrolledCourses.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {enrolledCourses.map((course) => (
                <div
                  key={course.enrollmentId}
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
                        {course.instructor?.name ?? "—"}
                      </p>
                    </div>
                    <Badge className={`shrink-0 ${gradeColor(course.grade?.letterGrade ?? null)}`}>
                      {course.grade?.letterGrade ?? "Enrolled"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {course.lectureTime?.day} {course.lectureTime?.start}–{course.lectureTime?.end}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      {course.credits} credits
                    </span>
                  </div>

                  {course.grade && (
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                      <span>
                        GPA points:{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          {course.grade.gradePoints ?? "—"}
                        </span>
                      </span>
                      {course.grade.total !== null && (
                        <span>
                          Total:{" "}
                          <span className="font-medium text-gray-700 dark:text-gray-200">
                            {course.grade.total}
                          </span>
                        </span>
                      )}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/lectures?course=${course.courseId}`)}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    View Lectures
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Available ── */}
        <TabsContent value="available" className="space-y-4">
          {enrollError && (
            <div className="flex items-center gap-3 text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-sm">{enrollError}</p>
            </div>
          )}

          {loadingAvailable && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => <CourseCardSkeleton key={i} />)}
            </div>
          )}

          {errorAvailable && (
            <div className="flex items-center gap-3 text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-sm">Failed to load available courses</p>
            </div>
          )}

          {!loadingAvailable && !errorAvailable && (availableCourses ?? []).length === 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
              <p className="text-gray-500 dark:text-gray-400">No courses available at this time</p>
            </div>
          )}

          {!loadingAvailable && !errorAvailable && availableCourses && availableCourses.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {availableCourses.map((course) => {
                const alreadyEnrolled = enrolledIds.has(course.id);
                const isEnrolling = enrollingId === course.id;
                const isFull = course.capacity !== null && course.enrolledCount >= course.capacity;
                const yearBlocked = course.minYear !== null && (studentYear === null || studentYear < course.minYear);
                const cannotEnroll = alreadyEnrolled || isFull || yearBlocked;

                let buttonLabel = "Enroll Now";
                if (alreadyEnrolled) buttonLabel = "Already Enrolled";
                else if (isEnrolling) buttonLabel = "Enrolling…";
                else if (isFull) buttonLabel = "Course Full";
                else if (yearBlocked) buttonLabel = `Year ${course.minYear}+ Required`;

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
                          {course.instructor?.name ?? "—"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {alreadyEnrolled && (
                          <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                            Enrolled
                          </Badge>
                        )}
                        {isFull && !alreadyEnrolled && (
                          <Badge className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                            Full
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {course.lectureTime?.day} {course.lectureTime?.start}–{course.lectureTime?.end}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.credits} credits
                      </span>
                    </div>

                    {/* Capacity bar + minYear requirement */}
                    <div className="space-y-2">
                      {course.capacity !== null && (
                        <div>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {course.enrolledCount}/{course.capacity} enrolled
                            </span>
                            <span>{Math.round((course.enrolledCount / course.capacity) * 100)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isFull ? "bg-red-500" : "bg-indigo-500"}`}
                              style={{ width: `${Math.min((course.enrolledCount / course.capacity) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {course.minYear !== null && (
                        <p className={`flex items-center gap-1 text-xs ${yearBlocked ? "text-amber-600 dark:text-amber-400" : "text-gray-400 dark:text-gray-500"}`}>
                          <Layers className="w-3 h-3" />
                          Requires Year {course.minYear} or above
                          {yearBlocked && studentYear !== null && ` (you are Year ${studentYear})`}
                        </p>
                      )}
                    </div>

                    <Button
                      className={`w-full ${cannotEnroll ? "" : "bg-indigo-600 hover:bg-indigo-700"}`}
                      disabled={cannotEnroll || isEnrolling}
                      onClick={() => !cannotEnroll && handleEnroll(course.id)}
                    >
                      {buttonLabel}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
