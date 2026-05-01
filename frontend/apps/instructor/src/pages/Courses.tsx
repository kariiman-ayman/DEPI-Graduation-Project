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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "_core/components/ui/tabs";
import { BookOpen, Users, Calendar, Clock, FileText } from "lucide-react";

export default function InstructorCourses() {
  const navigate = useNavigate();
  const courses = [
    {
      id: "CS401",
      name: "Advanced Data Structures",
      code: "CS401",
      semester: "Spring 2026",
      enrolled: 45,
      capacity: 50,
      schedule: "Mon, Wed 10:00 AM - 11:30 AM",
      room: "Lab 204",
      credits: 4,
      assignments: 8,
      lectures: 24,
    },
    {
      id: "CS301",
      name: "Database Systems",
      code: "CS301",
      semester: "Spring 2026",
      enrolled: 38,
      capacity: 40,
      schedule: "Tue, Thu 2:00 PM - 3:30 PM",
      room: "Room 301",
      credits: 3,
      assignments: 6,
      lectures: 20,
    },
    {
      id: "CS201",
      name: "Data Structures",
      code: "CS201",
      semester: "Spring 2026",
      enrolled: 42,
      capacity: 45,
      schedule: "Mon, Wed, Fri 11:00 AM - 12:00 PM",
      room: "Lab 102",
      credits: 4,
      assignments: 10,
      lectures: 30,
    },
  ];

  const upcomingSessions = [
    {
      course: "CS401",
      topic: "Binary Search Trees",
      date: "Today",
      time: "10:00 AM",
      room: "Lab 204",
    },
    {
      course: "CS301",
      topic: "SQL Joins & Optimization",
      date: "Tomorrow",
      time: "2:00 PM",
      room: "Room 301",
    },
    {
      course: "CS201",
      topic: "Linked Lists",
      date: "Wed",
      time: "11:00 AM",
      room: "Lab 102",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">My Courses</h3>
          <p className="text-sm text-gray-500">
            Manage your courses and schedules
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => {
              const enrollmentPercentage =
                (course.enrolled / course.capacity) * 100;
              return (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {course.code}
                        </Badge>
                        <CardTitle className="mb-1">{course.name}</CardTitle>
                        <p className="text-sm text-gray-500">
                          {course.semester}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/courses/${course.id}`)}
                      >
                        Manage
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{course.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{course.room}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Enrollment
                          </span>
                        </div>
                        <span className="text-sm">
                          {course.enrolled}/{course.capacity}
                        </span>
                      </div>
                      <Progress value={enrollmentPercentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl text-indigo-600">
                          {course.credits}
                        </p>
                        <p className="text-xs text-gray-500">Credits</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl text-blue-600">
                          {course.lectures}
                        </p>
                        <p className="text-xs text-gray-500">Lectures</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl text-green-600">
                          {course.assignments}
                        </p>
                        <p className="text-xs text-gray-500">Assignments</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-2" />
                        Materials
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Syllabus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {session.course}
                        </Badge>
                        <h4 className="mb-1">{session.topic}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{session.date}</span>
                          <span>•</span>
                          <span>{session.time}</span>
                          <span>•</span>
                          <span>{session.room}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/courses/${session.course}`)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
