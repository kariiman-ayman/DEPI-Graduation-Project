import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { BookOpen, Users, ClipboardCheck, TrendingUp } from "lucide-react";
import { Progress } from "_core/components/ui/progress";
import { Badge } from "_core/components/ui/badge";
import { Button } from "_core/components/ui/button";

export default function InstructorDashboard() {
  const stats = [
    {
      title: "Active Courses",
      value: "5",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "Total Students",
      value: "187",
      icon: Users,
      color: "bg-indigo-500",
    },
    {
      title: "Avg. Attendance",
      value: "89.3%",
      icon: ClipboardCheck,
      color: "bg-green-500",
    },
    {
      title: "Avg. Grade",
      value: "B+",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  const courses = [
    {
      id: "CS401",
      name: "Advanced Data Structures",
      enrolled: 45,
      capacity: 50,
      nextClass: "Today, 10:00 AM",
      attendance: 91,
      avgGrade: 3.6,
    },
    {
      id: "CS301",
      name: "Database Systems",
      enrolled: 38,
      capacity: 40,
      nextClass: "Tomorrow, 2:00 PM",
      attendance: 88,
      avgGrade: 3.4,
    },
    {
      id: "CS201",
      name: "Data Structures",
      enrolled: 42,
      capacity: 45,
      nextClass: "Wed, 11:00 AM",
      attendance: 90,
      avgGrade: 3.5,
    },
  ];

  const recentActivity = [
    { action: "New assignment submitted", course: "CS401", time: "10 min ago" },
    { action: "Attendance marked", course: "CS301", time: "2 hours ago" },
    { action: "Grades updated", course: "CS201", time: "5 hours ago" },
    { action: "Lecture video uploaded", course: "CS401", time: "1 day ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {course.id}
                    </Badge>
                    <h4 className="mb-1">{course.name}</h4>
                    <p className="text-sm text-gray-500">
                      Next: {course.nextClass}
                    </p>
                  </div>
                  <Button size="sm">View</Button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Students</p>
                    <p>
                      {course.enrolled}/{course.capacity}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Attendance</p>
                    <p className="text-green-600">{course.attendance}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Avg Grade</p>
                    <p className="text-blue-600">
                      {course.avgGrade.toFixed(1)}
                    </p>
                  </div>
                </div>
                <Progress
                  value={(course.enrolled / course.capacity) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-4 border-b last:border-0"
                  >
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-500">
                        {activity.course} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Mark Attendance
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Enter Grades
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
