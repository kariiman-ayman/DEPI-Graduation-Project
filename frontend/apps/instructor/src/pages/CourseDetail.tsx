import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useCourseAttendance, useSaveAttendance } from "../hooks/useAttendance";
import { useCourses } from "../hooks/useCourses";
import { useCourseGrades, useUpsertGrade } from "../hooks/useGrades";
import type { InstructorCourseGrade } from "../types/grade.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { Button } from "_core/components/ui/button";
import { Badge } from "_core/components/ui/badge";
import { Input } from "_core/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "_core/components/ui/tabs";
import { Progress } from "_core/components/ui/progress";
import { Checkbox } from "_core/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "_core/components/ui/table";
import { ArrowLeft, Save } from "lucide-react";

function computeTotal(m: number, a: number, p: number, f: number): number {
  return +(m * 0.3 + a * 0.2 + p * 0.25 + f * 0.25).toFixed(1);
}

function toLetterGrade(total: number): string {
  if (total >= 95) return "A+";
  if (total >= 90) return "A";
  if (total >= 87) return "A-";
  if (total >= 83) return "B+";
  if (total >= 80) return "B";
  if (total >= 77) return "B-";
  if (total >= 73) return "C+";
  if (total >= 70) return "C";
  if (total >= 67) return "C-";
  if (total >= 60) return "D";
  return "F";
}

function getGradeColor(grade: string | null): string {
  if (!grade)
    return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
  if (grade.startsWith("A"))
    return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400";
  if (grade.startsWith("B"))
    return "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400";
  if (grade.startsWith("C"))
    return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400";
  return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400";
}

type EditRow = {
  midterm: number;
  assignments: number;
  project: number;
  final: number;
};
type EditsMap = Record<string, EditRow>;

function rowFromGrade(g: InstructorCourseGrade): EditRow {
  return {
    midterm: g.midterm ?? 0,
    assignments: g.assignments ?? 0,
    project: g.project ?? 0,
    final: g.final ?? 0,
  };
}

export default function InstructorCourseDetail() {
  const navigate = useNavigate();
  const { courseId = "" } = useParams();
  const today = new Date().toISOString().split("T")[0];

  // ── course header ─────────────────────────────────────────────────────────
  const { data: courses = [] } = useCourses();
  const course = courses.find((c) => c.id === courseId);

  // ── grades ────────────────────────────────────────────────────────────────
  const [edits, setEdits] = useState<EditsMap>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const { data: gradeData, isFetching: gradesFetching } =
    useCourseGrades(courseId);
  const { mutateAsync: upsertGrade } = useUpsertGrade();

  useEffect(() => {
    if (!gradeData) return;
    const initial: EditsMap = {};
    for (const g of gradeData) initial[g.studentId] = rowFromGrade(g);
    setEdits(initial);
  }, [gradeData]);

  function handleGradeChange(
    studentId: string,
    field: keyof EditRow,
    raw: string,
  ) {
    const value = Math.min(100, Math.max(0, Number(raw) || 0));
    setEdits((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] ?? {
          midterm: 0,
          assignments: 0,
          project: 0,
          final: 0,
        }),
        [field]: value,
      },
    }));
  }

  async function handleSaveGrades() {
    if (!courseId || Object.keys(edits).length === 0) return;
    setIsSaving(true);
    try {
      await Promise.all(
        Object.entries(edits).map(([studentId, row]) =>
          upsertGrade({ studentId, courseId, ...row }),
        ),
      );
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } finally {
      setIsSaving(false);
    }
  }

  // ── attendance ────────────────────────────────────────────────────────────
  const [attendanceDate, setAttendanceDate] = useState(today);
  const [marks, setMarks] = useState<Record<string, "present" | "absent">>({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceSavedMsg, setAttendanceSavedMsg] = useState(false);

  const { data: attendanceData, isLoading: attendanceLoading } =
    useCourseAttendance(courseId, attendanceDate);
  const { mutateAsync: doSave } = useSaveAttendance();

  useEffect(() => {
    if (!attendanceData) return;
    const initial: Record<string, "present" | "absent"> = {};
    attendanceData.students.forEach((s) => {
      initial[s.studentId] = s.todayStatus ?? "present";
    });
    setMarks(initial);
  }, [attendanceData]);

  function toggleAttendanceMark(studentId: string, checked: boolean) {
    setMarks((prev) => ({
      ...prev,
      [studentId]: checked ? "present" : "absent",
    }));
  }

  async function handleSaveAttendance() {
    if (!courseId || !attendanceData) return;
    setSavingAttendance(true);
    try {
      const records = attendanceData.students.map((s) => ({
        studentId: s.studentId,
        status: marks[s.studentId] ?? "absent",
      }));
      await doSave({ courseId, date: attendanceDate, records });
      setAttendanceSavedMsg(true);
      setTimeout(() => setAttendanceSavedMsg(false), 3000);
    } finally {
      setSavingAttendance(false);
    }
  }

  const attendanceStudents = attendanceData?.students ?? [];
  const presentCount = attendanceStudents.filter(
    (s) => marks[s.studentId] === "present",
  ).length;
  const attendanceRate =
    attendanceStudents.length > 0
      ? (presentCount / attendanceStudents.length) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/courses")}
          className="mt-1"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h3 className="text-2xl mb-0.5">
            {course?.title ?? "Course Detail"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {[
              course?.department?.name,
              course?.credits ? `${course.credits} credits` : null,
              course?.lectureTime
                ? `${course.lectureTime.day} ${course.lectureTime.start}–${course.lectureTime.end}`
                : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="grades" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        {/* Grades Tab */}
        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Grade Management</CardTitle>
                <div className="flex items-center gap-3">
                  {savedMsg && (
                    <span className="text-sm text-green-600 font-medium">
                      Saved!
                    </span>
                  )}
                  <Button
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleSaveGrades}
                    disabled={isSaving || Object.keys(edits).length === 0}
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">Midterm (30%)</TableHead>
                    <TableHead className="text-center">
                      Assignments (20%)
                    </TableHead>
                    <TableHead className="text-center">Project (25%)</TableHead>
                    <TableHead className="text-center">Final (25%)</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradesFetching ? (
                    [...Array(4)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={7}>
                          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : gradeData?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-gray-400 dark:text-gray-500 py-12"
                      >
                        No students enrolled in this course
                      </TableCell>
                    </TableRow>
                  ) : (
                    gradeData?.map((student) => {
                      const row = edits[student.studentId] ?? {
                        midterm: 0,
                        assignments: 0,
                        project: 0,
                        final: 0,
                      };
                      const total = computeTotal(
                        row.midterm,
                        row.assignments,
                        row.project,
                        row.final,
                      );
                      const letter = toLetterGrade(total);
                      const initials = student.studentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2);

                      return (
                        <TableRow key={student.studentId}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-indigo-600 dark:text-indigo-400 text-xs">
                                  {initials}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm">{student.studentName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {student.studentEmail}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          {(
                            [
                              "midterm",
                              "assignments",
                              "project",
                              "final",
                            ] as const
                          ).map((field) => (
                            <TableCell key={field} className="text-center">
                              <Input
                                type="number"
                                value={row[field]}
                                onChange={(e) =>
                                  handleGradeChange(
                                    student.studentId,
                                    field,
                                    e.target.value,
                                  )
                                }
                                className="w-16 text-center"
                                min="0"
                                max="100"
                              />
                            </TableCell>
                          ))}
                          <TableCell className="text-center font-medium">
                            {total.toFixed(1)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={getGradeColor(letter)}>
                              {letter}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Attendance</CardTitle>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </CardHeader>
            <CardContent>
              {attendanceLoading ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : attendanceStudents.length === 0 ? (
                <p className="text-center text-gray-400 dark:text-gray-500 py-10">
                  No enrolled students.
                </p>
              ) : (
                <>
                  <div className="mb-6 flex items-center gap-6">
                    <div className="text-4xl text-green-600">
                      {attendanceRate.toFixed(0)}%
                    </div>
                    <div className="flex-1">
                      <Progress value={attendanceRate} className="h-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {presentCount} out of {attendanceStudents.length}{" "}
                        students present
                      </p>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Mark Present</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceStudents.map((student) => {
                        const isPresent =
                          marks[student.studentId] === "present";
                        return (
                          <TableRow
                            key={student.studentId}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <TableCell>
                              <div>
                                <p className="text-sm">{student.name}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                  {student.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  isPresent
                                    ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                    : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                                }
                              >
                                {isPresent ? "Present" : "Absent"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Checkbox
                                checked={isPresent}
                                onCheckedChange={(checked) =>
                                  toggleAttendanceMark(
                                    student.studentId,
                                    checked === true,
                                  )
                                }
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  <div className="flex items-center justify-end gap-3 mt-6">
                    {attendanceSavedMsg && (
                      <span className="text-sm text-green-600 font-medium">
                        Saved!
                      </span>
                    )}
                    <Button
                      onClick={handleSaveAttendance}
                      disabled={savingAttendance}
                      className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Save className="w-4 h-4" />
                      {savingAttendance ? "Saving…" : "Save Attendance"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
