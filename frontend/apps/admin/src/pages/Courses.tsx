import { Button } from "_core/components/ui/button";
import { Badge } from "_core/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { BookOpen, Clock, Plus, Users, Layers } from "lucide-react";
import { useState } from "react";
import { AddCourseModal } from "../components/AddCourseModal";
import { useCourses } from "../hooks/useCourses";

export default function AdminCourses() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: courses, isLoading } = useCourses();

  if (isLoading) return <div>Loading...</div>;

  if (!courses) return <div>No courses found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Course Management</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage courses and track enrollments
          </p>
        </div>
        <Button
          className="gap-2 bg-indigo-600 hover:bg-indigo-700"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg mb-1">{course.title}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {course.instructor.name}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <BookOpen className="w-4 h-4" />
                <span>{course.department?.name ?? "—"}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>
                  {course.lectureTime.day} {course.lectureTime.start} –{" "}
                  {course.lectureTime.end}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>
                  {course.enrolledCount}
                  {course.capacity !== null ? `/${course.capacity}` : ""}{" "}
                  enrolled
                </span>
                {course.capacity !== null &&
                  course.enrolledCount >= course.capacity && (
                    <Badge className="text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 ml-auto">
                      Full
                    </Badge>
                  )}
              </div>

              <div className="flex items-center pt-2 border-t">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {course.credits} credits
                </span>
                {course.minYear !== null && (
                  <span className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full ml-2">
                    <Layers className="w-3 h-3" />
                    Yr {course.minYear}+
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddCourseModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </div>
  );
}
