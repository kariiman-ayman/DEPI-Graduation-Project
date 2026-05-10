import { Badge } from "_core/components/ui/badge";
import { Button } from "_core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "_core/components/ui/tabs";
import { BookOpen, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router";
import { useCourses } from "../hooks/useCourses";

export default function InstructorCourses() {
  const navigate = useNavigate();
  const { data: courses } = useCourses();

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
            {courses?.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-1">{course.title}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {course.department.name}
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
                      <span className="text-gray-600">
                        {course.lectureTime.day}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {course.lectureTime.start} - {course.lectureTime.end}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl text-indigo-600">
                        {course.credits}
                      </p>
                      <p className="text-xs text-gray-500">Credits</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
