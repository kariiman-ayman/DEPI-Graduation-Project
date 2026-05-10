import { Button } from "_core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { BookOpen, Clock, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AddCourseModal } from "../components/AddCourseModal";
import { useCourses } from "../hooks/useCourses";

export default function AdminCourses() {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: courses, isLoading } = useCourses();

  if (isLoading) return <div>Loading...</div>;

  if (!courses) return <div>No courses found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Course Management</h3>
          <p className="text-sm text-gray-500">
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
                  <p className="text-sm text-gray-500">
                    {course.instructor.name}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span>{course.department.name}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  {course.lectureTime.day} {course.lectureTime.start} -{" "}
                  {course.lectureTime.end}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-gray-600">
                  {course.credits} Credits
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddCourseModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </div>
  );
}
