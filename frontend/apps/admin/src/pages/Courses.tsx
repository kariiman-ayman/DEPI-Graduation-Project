import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { Button } from "_core/components/ui/button";
import { Badge } from "_core/components/ui/badge";
import { Progress } from "_core/components/ui/progress";
import { Plus, Users, Clock, BookOpen } from "lucide-react";
import { AddCourseModal } from "_core/components/modals/AddCourseModal";

export default function AdminCourses() {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const courses = [
    {
      id: "CS401",
      name: "Advanced Data Structures",
      instructor: "Dr. Sarah Johnson",
      department: "Computer Science",
      enrolled: 45,
      capacity: 50,
      credits: 4,
      schedule: "Mon, Wed 10:00 AM",
      status: "Active",
    },
    {
      id: "BUS301",
      name: "Business Analytics",
      instructor: "Prof. Michael Chen",
      department: "Business",
      enrolled: 38,
      capacity: 40,
      credits: 3,
      schedule: "Tue, Thu 2:00 PM",
      status: "Active",
    },
    {
      id: "ENG201",
      name: "Thermodynamics",
      instructor: "Dr. Emily Davis",
      department: "Engineering",
      enrolled: 50,
      capacity: 50,
      credits: 4,
      schedule: "Mon, Wed, Fri 9:00 AM",
      status: "Full",
    },
    {
      id: "MED101",
      name: "Human Anatomy",
      instructor: "Dr. James Wilson",
      department: "Medicine",
      enrolled: 28,
      capacity: 30,
      credits: 5,
      schedule: "Tue, Thu 1:00 PM",
      status: "Active",
    },
    {
      id: "ART205",
      name: "Digital Design",
      instructor: "Prof. Sofia Rodriguez",
      department: "Arts",
      enrolled: 22,
      capacity: 35,
      credits: 3,
      schedule: "Wed, Fri 3:00 PM",
      status: "Active",
    },
    {
      id: "SCI302",
      name: "Organic Chemistry",
      instructor: "Dr. Daniel Kim",
      department: "Sciences",
      enrolled: 40,
      capacity: 45,
      credits: 4,
      schedule: "Mon, Wed 11:00 AM",
      status: "Active",
    },
  ];

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
        {courses.map((course) => {
          const enrollmentPercentage =
            (course.enrolled / course.capacity) * 100;
          return (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {course.id}
                    </Badge>
                    <CardTitle className="text-lg mb-1">
                      {course.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{course.instructor}</p>
                  </div>
                  <Badge
                    className={
                      course.status === "Full"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }
                  >
                    {course.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.department}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{course.schedule}</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Enrollment</span>
                    </div>
                    <span className="text-sm">
                      {course.enrolled}/{course.capacity}
                    </span>
                  </div>
                  <Progress value={enrollmentPercentage} className="h-2" />
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
          );
        })}
      </div>

      <AddCourseModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </div>
  );
}
