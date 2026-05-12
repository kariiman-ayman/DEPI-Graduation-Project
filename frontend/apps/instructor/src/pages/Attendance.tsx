import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "_core/components/ui/card";
import { Button } from "_core/components/ui/button";
import { Badge } from "_core/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "_core/components/ui/select";
import { Checkbox } from "_core/components/ui/checkbox";
import { Check, X, Save } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "_core/components/ui/table";
import { useCourses } from "../hooks/useCourses";
import { useCourseAttendance, useSaveAttendance } from "../hooks/useAttendance";

export default function InstructorAttendance() {
  const today = new Date().toISOString().split("T")[0];

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedDate, setSelectedDate] = useState(today);
  // Local state: studentId → "present" | "absent"
  const [marks, setMarks] = useState<Record<string, "present" | "absent">>({});
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  const { data: attendanceData, isLoading: attendanceLoading, isFetching } = useCourseAttendance(
    selectedCourseId,
    selectedDate
  );
  const { mutateAsync: doSave } = useSaveAttendance();

  // Seed marks from fetched data whenever course/date/data changes
  useEffect(() => {
    if (!attendanceData) return;
    const initial: Record<string, "present" | "absent"> = {};
    attendanceData.students.forEach((s) => {
      initial[s.studentId] = s.todayStatus ?? "present";
    });
    setMarks(initial);
  }, [attendanceData]);

  const toggle = (studentId: string, checked: boolean) => {
    setMarks((prev) => ({ ...prev, [studentId]: checked ? "present" : "absent" }));
  };

  const handleSave = async () => {
    if (!selectedCourseId || !attendanceData) return;
    setSaving(true);
    try {
      const records = attendanceData.students.map((s) => ({
        studentId: s.studentId,
        status: marks[s.studentId] ?? "absent",
      }));
      await doSave({ courseId: selectedCourseId, date: selectedDate, records });
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const students = attendanceData?.students ?? [];
  const presentCount = students.filter((s) => marks[s.studentId] === "present").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Attendance Management</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Mark and track student attendance</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-4">
            <CardTitle className="flex-1">Attendance Records</CardTitle>

            {/* Course selector */}
            <Select
              value={selectedCourseId}
              onValueChange={setSelectedCourseId}
              disabled={coursesLoading}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a course…" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date picker */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </CardHeader>

        <CardContent>
          {/* Date summary bar */}
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Selected Date</p>
              <p className="text-base font-medium">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {selectedDate === today && <Badge className="bg-blue-600">Today</Badge>}
          </div>

          {/* Empty / loading states */}
          {!selectedCourseId ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-16">
              Select a course to view and mark attendance.
            </p>
          ) : attendanceLoading || isFetching ? (
            <div className="space-y-2 py-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : students.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-16">
              No enrolled students found for this course.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Present</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Overall Rate</TableHead>
                    <TableHead className="text-center">Last Sessions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    const isPresent = marks[student.studentId] === "present";
                    return (
                      <TableRow key={student.studentId}>
                        <TableCell>
                          <Checkbox
                            checked={isPresent}
                            onCheckedChange={(checked) =>
                              toggle(student.studentId, checked === true)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center shrink-0">
                              <span className="text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{student.name}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">{student.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {student.total === 0 ? (
                            <span className="text-xs text-gray-400 dark:text-gray-500">No data</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-24">
                                <div
                                  className={`h-2 rounded-full ${
                                    student.attendanceRate >= 90
                                      ? "bg-green-500"
                                      : student.attendanceRate >= 75
                                        ? "bg-blue-500"
                                        : "bg-orange-500"
                                  }`}
                                  style={{ width: `${student.attendanceRate}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {student.attendanceRate.toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            {student.lastSessions.length === 0 ? (
                              <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
                            ) : (
                              student.lastSessions.map((session, idx) => (
                                <div
                                  key={idx}
                                  title={session.date}
                                  className={`w-6 h-6 rounded flex items-center justify-center ${
                                    session.status === "present"
                                      ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                      : session.status === "absent"
                                        ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                                  }`}
                                >
                                  {session.status === "present" ? (
                                    <Check className="w-3.5 h-3.5" />
                                  ) : session.status === "absent" ? (
                                    <X className="w-3.5 h-3.5" />
                                  ) : (
                                    <span className="text-[10px]">–</span>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Present:{" "}
                  <span className="font-medium">
                    {presentCount}/{students.length}
                  </span>{" "}
                  students (
                  {students.length > 0
                    ? ((presentCount / students.length) * 100).toFixed(1)
                    : 0}
                  %)
                </p>
                <div className="flex items-center gap-3">
                  {savedMsg && (
                    <span className="text-sm text-green-600 font-medium">Saved!</span>
                  )}
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving…" : "Save Attendance"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
