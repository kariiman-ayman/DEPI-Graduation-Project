import { useNavigate } from "react-router";
import { useCourses } from "../hooks/useCourses.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { Button } from "_core/components/ui/button";
import {
  BookOpen,
  Users,
  ClipboardCheck,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react";

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-24" />
            <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 animate-pulse">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3" />
      </div>
      <div className="h-8 w-16 bg-gray-100 dark:bg-gray-700 rounded ml-4" />
    </div>
  );
}

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const { data: courses = [], isLoading } = useCourses();

  const totalStudents = courses.reduce((sum, c) => sum + c.enrolledCount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of your courses and students
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Active Courses
                    </p>
                    <p className="text-2xl font-semibold">{courses.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Students
                    </p>
                    <p className="text-2xl font-semibold">{totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Courses</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/courses")}
              >
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : courses.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
                No courses assigned yet
              </p>
            ) : (
              courses.slice(0, 5).map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {course.title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {course.lectureTime.day}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.lectureTime.start}–{course.lectureTime.end}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.enrolledCount}
                        {course.capacity !== null ? `/${course.capacity}` : ""}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-3 shrink-0"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate("/courses")}
            >
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate("/grades")}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Enter Grades
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate("/courses")}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Manage Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
