import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "_core/components/ui/card";
import { Badge } from "_core/components/ui/badge";
import { Progress } from "_core/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "_core/components/ui/tabs";
import { Calendar, Check, X } from "lucide-react";
import { useMyAttendance } from "../hooks/useAttendance";

function StatCard({
  icon,
  color,
  label,
  value,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            <p className="text-2xl">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse mb-2" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

export default function StudentAttendance() {
  const { data, isLoading } = useMyAttendance();
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const overall = data?.overall ?? { present: 0, total: 0, percentage: 0 };
  const courses = data?.courses ?? [];
  const calendarRecords = data?.calendar ?? [];

  // Build a set of date→status for quick calendar lookup
  const calendarMap = new Map(calendarRecords.map((r) => [r.date, r.status]));

  const daysInMonth = new Date(calendarMonth.year, calendarMonth.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarMonth.year, calendarMonth.month, 1).getDay();

  const monthLabel = new Date(calendarMonth.year, calendarMonth.month).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  const prevMonth = () =>
    setCalendarMonth((m) => {
      const d = new Date(m.year, m.month - 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const nextMonth = () =>
    setCalendarMonth((m) => {
      const d = new Date(m.year, m.month + 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl">Attendance Tracking</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Monitor your attendance across all courses</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Check className="w-6 h-6 text-white" />}
          color="bg-green-500"
          label="Overall Attendance"
          value={isLoading ? "—" : `${overall.percentage}%`}
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          label="Classes Attended"
          value={isLoading ? "—" : `${overall.present}/${overall.total}`}
        />
        <StatCard
          icon={<X className="w-6 h-6 text-white" />}
          color="bg-red-400"
          label="Classes Missed"
          value={isLoading ? "—" : `${overall.total - overall.present}`}
        />
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">By Course</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        {/* By Course */}
        <TabsContent value="courses" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : courses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-gray-400 dark:text-gray-500">
                No enrolled courses found.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card key={course.courseId}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{course.courseName}</CardTitle>
                      <Badge
                        className={
                          course.percentage >= 90
                            ? "bg-green-100 dark:bg-green-900/20 text-green-700"
                            : course.percentage >= 75
                              ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700"
                              : "bg-orange-100 dark:bg-orange-900/20 text-orange-700"
                        }
                      >
                        {course.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Classes Attended</span>
                      <span>{course.present} / {course.total}</span>
                    </div>
                    <Progress value={course.percentage} className="h-3" />

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Present</p>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span className="text-lg">{course.present}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Absent</p>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <span className="text-lg">{course.total - course.present}</span>
                        </div>
                      </div>
                    </div>

                    {course.total > 0 && course.percentage < 75 && (
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                        <p className="text-xs text-orange-800">
                          ⚠️ Attendance below 75% requirement
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{monthLabel} — Attendance Calendar</CardTitle>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevMonth}
                    className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-600 dark:text-gray-400"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextMonth}
                    className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-600 dark:text-gray-400"
                  >
                    ›
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day labels */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells before first day */}
                {[...Array(firstDayOfWeek)].map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const status = calendarMap.get(dateStr);
                  const isToday = dateStr === new Date().toISOString().split("T")[0];

                  return (
                    <div
                      key={day}
                      className={`aspect-square flex items-center justify-center rounded-lg border-2 relative text-sm
                        ${status === "present" ? "bg-green-100 dark:bg-green-900/20 border-green-300" : ""}
                        ${status === "absent" ? "bg-red-100 dark:bg-red-900/20 border-red-300" : ""}
                        ${!status ? "border-gray-200 dark:border-gray-700" : ""}
                        ${isToday ? "ring-2 ring-indigo-500" : ""}
                      `}
                    >
                      {day}
                      {status && (
                        <div className="absolute top-0.5 right-0.5">
                          {status === "present" ? (
                            <Check className="w-2.5 h-2.5 text-green-600" />
                          ) : (
                            <X className="w-2.5 h-2.5 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center gap-6 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 border-2 border-green-300 rounded" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 dark:bg-red-900/20 border-2 border-red-300 rounded" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-200 dark:border-gray-700 rounded" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">No Class</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
