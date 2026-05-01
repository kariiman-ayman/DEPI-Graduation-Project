import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import {
  BookOpen,
  Trophy,
  DollarSign,
  Flame,
  Award,
  Target,
  Star,
  TrendingUp,
} from "lucide-react";
import { Progress } from "_core/components/ui/progress";
import { Badge } from "_core/components/ui/badge";
import { Button } from "_core/components/ui/button";

export default function StudentDashboard() {
  const stats = [
    {
      title: "Enrolled Courses",
      value: "6",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "Current GPA",
      value: "3.85",
      icon: Trophy,
      color: "bg-green-500",
    },
    {
      title: "Avg. Attendance",
      value: "92%",
      icon: Target,
      color: "bg-purple-500",
    },
    {
      title: "Outstanding Fees",
      value: "$1,200",
      icon: DollarSign,
      color: "bg-orange-500",
    },
  ];

  const courses = [
    {
      code: "CS401",
      name: "Advanced Data Structures",
      instructor: "Dr. Johnson",
      progress: 65,
      nextClass: "Today, 10:00 AM",
      attendance: 91,
    },
    {
      code: "CS301",
      name: "Database Systems",
      instructor: "Prof. Chen",
      progress: 58,
      nextClass: "Tomorrow, 2:00 PM",
      attendance: 88,
    },
    {
      code: "BUS201",
      name: "Business Analytics",
      instructor: "Dr. Davis",
      progress: 72,
      nextClass: "Wed, 11:00 AM",
      attendance: 95,
    },
  ];

  const achievements = [
    {
      icon: Flame,
      title: "15 Day Streak",
      description: "Perfect attendance",
      color: "bg-orange-500",
    },
    {
      icon: Award,
      title: "Dean's List",
      description: "GPA above 3.8",
      color: "bg-yellow-500",
    },
    {
      icon: Star,
      title: "Top 10%",
      description: "In your class",
      color: "bg-purple-500",
    },
    {
      icon: TrendingUp,
      title: "Improving",
      description: "+0.3 GPA this sem",
      color: "bg-green-500",
    },
  ];

  const upcomingDeadlines = [
    {
      course: "CS401",
      task: "Assignment 3: Tree Algorithms",
      due: "Tomorrow",
      priority: "high",
    },
    {
      course: "CS301",
      task: "Database Project Milestone",
      due: "3 days",
      priority: "medium",
    },
    {
      course: "BUS201",
      task: "Case Study Analysis",
      due: "1 week",
      priority: "low",
    },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.code}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {course.code}
                      </Badge>
                      <h4 className="mb-1">{course.name}</h4>
                      <p className="text-sm text-gray-500">
                        {course.instructor}
                      </p>
                    </div>
                    <Button size="sm">View</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Next Class</p>
                      <p>{course.nextClass}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Attendance</p>
                      <p className="text-green-600">{course.attendance}%</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Course Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {deadline.course}
                        </Badge>
                        <Badge
                          className={`text-xs ${
                            deadline.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : deadline.priority === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {deadline.priority}
                        </Badge>
                      </div>
                      <p className="text-sm">{deadline.task}</p>
                    </div>
                    <p className="text-sm text-gray-500 ml-4">
                      Due {deadline.due}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gamification & Achievements */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="text-center p-4 border rounded-lg"
                  >
                    <div
                      className={`${achievement.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}
                    >
                      <achievement.icon className="w-6 h-6 text-white" />
                    </div>
                    <h5 className="text-sm mb-1">{achievement.title}</h5>
                    <p className="text-xs text-gray-500">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-3">
                  <Flame className="w-10 h-10 text-white" />
                </div>
                <p className="text-3xl mb-1">15 Days</p>
                <p className="text-sm text-gray-500">Current streak</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Longest Streak</span>
                  <span>22 days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">This Semester</span>
                  <span className="text-green-600">92% attendance</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Tuition Paid</span>
                    <span>$3,800 / $5,000</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    Next payment due:{" "}
                    <span className="font-medium">March 15, 2026</span>
                  </p>
                </div>
                <Button className="w-full" variant="outline">
                  View Payment History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
