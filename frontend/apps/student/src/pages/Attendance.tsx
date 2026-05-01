import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { Badge } from "_core/components/ui/badge";
import { Progress } from "_core/components/ui/progress";
import { Calendar, Check, X, Flame, TrendingUp } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "_core/components/ui/tabs";

export default function StudentAttendance() {
  const courses = [
    {
      code: "CS401",
      name: "Advanced Data Structures",
      present: 22,
      total: 24,
      percentage: 91.7,
      lastAttended: "Today",
      status: "present",
    },
    {
      code: "CS301",
      name: "Database Systems",
      present: 18,
      total: 20,
      percentage: 90.0,
      lastAttended: "Yesterday",
      status: "present",
    },
    {
      code: "BUS201",
      name: "Business Analytics",
      present: 19,
      total: 20,
      percentage: 95.0,
      lastAttended: "2 days ago",
      status: "present",
    },
    {
      code: "ENG301",
      name: "Technical Writing",
      present: 16,
      total: 19,
      percentage: 84.2,
      lastAttended: "3 days ago",
      status: "absent",
    },
    {
      code: "MATH201",
      name: "Statistics",
      present: 17,
      total: 18,
      percentage: 94.4,
      lastAttended: "1 day ago",
      status: "present",
    },
  ];

  const monthlyCalendar = [
    { date: 1, status: "present" },
    { date: 3, status: "present" },
    { date: 5, status: "present" },
    { date: 8, status: "present" },
    { date: 10, status: "present" },
    { date: 12, status: "absent" },
    { date: 15, status: "present" },
    { date: 17, status: "present" },
    { date: 19, status: "present" },
    { date: 20, status: "present" },
  ];

  const overallStats = {
    totalPresent: 92,
    totalClasses: 101,
    percentage: 91.1,
    streak: 15,
    longestStreak: 22,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Attendance Tracking</h3>
          <p className="text-sm text-gray-500">
            Monitor your attendance across all courses
          </p>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Attendance</p>
                <p className="text-2xl">{overallStats.percentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Classes Attended</p>
                <p className="text-2xl">
                  {overallStats.totalPresent}/{overallStats.totalClasses}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl">{overallStats.streak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Longest Streak</p>
                <p className="text-2xl">{overallStats.longestStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">By Course</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
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
                        Last: {course.lastAttended}
                      </p>
                    </div>
                    <Badge
                      className={
                        course.percentage >= 90
                          ? "bg-green-100 text-green-700"
                          : course.percentage >= 75
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                      }
                    >
                      {course.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Classes Attended
                    </span>
                    <span className="text-sm">
                      {course.present} / {course.total}
                    </span>
                  </div>
                  <Progress value={course.percentage} className="h-3" />

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Present</p>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-lg">{course.present}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Absent</p>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span className="text-lg">
                          {course.total - course.present}
                        </span>
                      </div>
                    </div>
                  </div>

                  {course.percentage < 75 && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-xs text-orange-800">
                        ⚠️ Attendance below 75% requirement
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>February 2026 - Attendance Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-600 py-2"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 29 }, (_, i) => {
                  const date = i + 1;
                  const attendance = monthlyCalendar.find(
                    (a) => a.date === date,
                  );
                  const isToday = date === 20;

                  return (
                    <div
                      key={date}
                      className={`aspect-square flex items-center justify-center rounded-lg border-2 relative ${
                        attendance?.status === "present"
                          ? "bg-green-100 border-green-300"
                          : attendance?.status === "absent"
                            ? "bg-red-100 border-red-300"
                            : "border-gray-200"
                      } ${isToday ? "ring-2 ring-indigo-500" : ""}`}
                    >
                      <span className="text-sm">{date}</span>
                      {attendance && (
                        <div className="absolute top-1 right-1">
                          {attendance.status === "present" ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <X className="w-3 h-3 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center gap-6 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded" />
                  <span className="text-sm text-gray-600">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded" />
                  <span className="text-sm text-gray-600">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-200 rounded" />
                  <span className="text-sm text-gray-600">No Class</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
