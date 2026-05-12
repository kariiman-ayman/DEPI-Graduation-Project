import { useState } from "react";
import { Upload, Video, Clock, Calendar, Eye } from "lucide-react";
import { Button } from "_core/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "_core/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "_core/components/ui/select";
import { UploadModal } from "../components/UploadModal";
import { useCourses } from "../hooks/useCourses";
import { useLectures } from "../hooks/useLectures";

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function isThisWeek(iso: string | null): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return d >= weekStart;
}

function LectureSkeleton() {
  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-start gap-4 animate-pulse">
      <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  );
}

export default function InstructorLectures() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);

  const { data: courses = [] } = useCourses();
  const { data: lectures = [], isLoading, isError } = useLectures(
    selectedCourseId === "all" ? undefined : selectedCourseId,
  );

  const thisWeekCount = lectures.filter((l) => isThisWeek(l.createdAt)).length;

  return (
    <>
      <UploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        courses={courses}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Lecture Recordings
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload and manage recorded lectures
            </p>
          </div>
          <Button
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setModalOpen(true)}
          >
            <Upload className="w-4 h-4" />
            Upload New Lecture
          </Button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Videos</p>
                  <p className="text-2xl font-semibold">{isLoading ? "—" : lectures.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Uploaded This Week</p>
                  <p className="text-2xl font-semibold">{isLoading ? "—" : thisWeekCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lecture list */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Lectures</CardTitle>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="All courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isError && (
              <p className="text-sm text-red-600 dark:text-red-400 py-4 text-center">
                Failed to load lectures
              </p>
            )}

            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <LectureSkeleton key={i} />)}
              </div>
            )}

            {!isLoading && !isError && lectures.length === 0 && (
              <div className="py-12 text-center">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Video className="w-6 h-6 text-indigo-500" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  No lectures yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Upload your first lecture recording to get started
                </p>
              </div>
            )}

            {!isLoading && !isError && lectures.length > 0 && (
              <div className="space-y-3">
                {lectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    className="flex items-start gap-4 border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center shrink-0">
                      <Video className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {lecture.title}
                          </h4>
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
                            {lecture.courseName}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={() => window.open(lecture.videoUrl, "_blank")}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                          Preview
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(lecture.duration)}
                        </span>
                        {lecture.createdAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(lecture.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
