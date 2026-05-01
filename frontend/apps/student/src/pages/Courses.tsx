import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { Button } from "_core/components/ui/button";
import { Badge } from "_core/components/ui/badge";
import { Progress } from "_core/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "_core/components/ui/tabs";
import { Users, Clock, Calendar, FileText, Video, Plus } from "lucide-react";

export default function StudentCourses() {
  const enrolledCourses = [
    {
      code: "CS401",
      name: "Advanced Data Structures",
      instructor: "Dr. Sarah Johnson",
      credits: 4,
      enrolled: 45,
      capacity: 50,
      schedule: "Mon, Wed 10:00 AM",
      room: "Lab 204",
      progress: 65,
      grade: "A-",
    },
    {
      code: "CS301",
      name: "Database Systems",
      instructor: "Prof. Michael Chen",
      credits: 3,
      enrolled: 38,
      capacity: 40,
      schedule: "Tue, Thu 2:00 PM",
      room: "Room 301",
      progress: 58,
      grade: "B+",
    },
    {
      code: "BUS201",
      name: "Business Analytics",
      instructor: "Dr. Emily Davis",
      credits: 3,
      enrolled: 42,
      capacity: 45,
      schedule: "Wed, Fri 11:00 AM",
      room: "Room 105",
      progress: 72,
      grade: "A",
    },
  ];

  const availableCourses = [
    {
      code: "CS501",
      name: "Machine Learning",
      instructor: "Dr. James Wilson",
      credits: 4,
      enrolled: 28,
      capacity: 30,
      schedule: "Mon, Wed 2:00 PM",
      prerequisites: "CS401",
    },
    {
      code: "CS402",
      name: "Software Engineering",
      instructor: "Prof. Sofia Rodriguez",
      credits: 3,
      enrolled: 35,
      capacity: 40,
      schedule: "Tue, Thu 10:00 AM",
      prerequisites: "CS301",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">My Courses</h3>
          <p className="text-sm text-gray-500">
            View enrolled courses and register for new ones
          </p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4" />
          Register for Courses
        </Button>
      </div>

      <Tabs defaultValue="enrolled" className="space-y-6">
        <TabsList>
          <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
          <TabsTrigger value="available">Available Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => (
              <Card
                key={course.code}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {course.code}
                      </Badge>
                      <CardTitle className="text-lg mb-1">
                        {course.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {course.instructor}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      {course.grade}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{course.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{course.room}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Class Size
                        </span>
                      </div>
                      <span className="text-sm">
                        {course.enrolled}/{course.capacity}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Course Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Materials
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Video className="w-4 h-4 mr-2" />
                      Lectures
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableCourses.map((course) => {
              const enrollmentPercentage =
                (course.enrolled / course.capacity) * 100;
              return (
                <Card key={course.code}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {course.code}
                        </Badge>
                        <CardTitle className="text-lg mb-1">
                          {course.name}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {course.instructor}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        Available
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{course.schedule}</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Seats Available
                          </span>
                        </div>
                        <span className="text-sm">
                          {course.capacity - course.enrolled}/{course.capacity}
                        </span>
                      </div>
                      <Progress value={enrollmentPercentage} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Prerequisites</p>
                        <Badge variant="outline" className="mt-1">
                          {course.prerequisites}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Credits</p>
                        <p className="text-lg">{course.credits}</p>
                      </div>
                    </div>

                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Registration Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5" />
                  <p>Registration deadline: March 1, 2026</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5" />
                  <p>Maximum credits per semester: 18</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5" />
                  <p>Prerequisites must be completed before enrollment</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5" />
                  <p>Contact your academic advisor for guidance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
