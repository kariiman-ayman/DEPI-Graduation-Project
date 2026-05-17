import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { Button } from "_core/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "_core/components/ui/select";
import { Input } from "_core/components/ui/input";
import { Skeleton } from "_core/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "_core/components/ui/table";
import { Badge } from "_core/components/ui/badge";
import { Save } from "lucide-react";
import { useCourses } from "../hooks/useCourses";
import { useCourseGrades, useUpsertGrade } from "../hooks/useGrades";
import type { InstructorCourseGrade } from "../types/grade.types";

// ── grade computation helpers ──────────────────────────────────────────────
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

// ── types ──────────────────────────────────────────────────────────────────
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

// ── stat helpers ───────────────────────────────────────────────────────────
function computeStats(edits: EditsMap) {
  const totals = Object.values(edits).map(
    ({ midterm, assignments, project, final }) =>
      computeTotal(midterm, assignments, project, final),
  );
  if (totals.length === 0) return null;
  const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
  const highest = Math.max(...totals);
  const lowest = Math.min(...totals);
  const passCount = totals.filter((t) => t >= 60).length;
  const passRate = Math.round((passCount / totals.length) * 100);
  return { avg, highest, lowest, passRate };
}

function buildDistribution(edits: EditsMap) {
  const counts: Record<string, number> = {};
  for (const row of Object.values(edits)) {
    const total = computeTotal(
      row.midterm,
      row.assignments,
      row.project,
      row.final,
    );
    const lg = toLetterGrade(total);
    counts[lg] = (counts[lg] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([grade, count]) => ({ grade, count }));
}

// ── skeleton rows ──────────────────────────────────────────────────────────
function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div>
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </TableCell>
          {Array.from({ length: 6 }).map((_, j) => (
            <TableCell key={j} className="text-center">
              <Skeleton className="h-8 w-16 mx-auto" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ── main component ─────────────────────────────────────────────────────────
export default function InstructorGrades() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [edits, setEdits] = useState<EditsMap>({});
  const [isSaving, setIsSaving] = useState(false);

  const { data: courses = [] } = useCourses();
  const { data: gradeData, isFetching } = useCourseGrades(selectedCourseId);
  const { mutateAsync } = useUpsertGrade();

  // Sync fetched data into local edits state
  useEffect(() => {
    if (!gradeData) return;
    const initial: EditsMap = {};
    for (const g of gradeData) {
      initial[g.studentId] = rowFromGrade(g);
    }
    setEdits(initial);
  }, [gradeData]);

  // Reset edits when course changes
  useEffect(() => {
    setEdits({});
  }, [selectedCourseId]);

  function handleChange(studentId: string, field: keyof EditRow, raw: string) {
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

  async function handleSave() {
    if (!selectedCourseId || Object.keys(edits).length === 0) return;
    setIsSaving(true);
    try {
      await Promise.all(
        Object.entries(edits).map(([studentId, row]) =>
          mutateAsync({
            studentId,
            courseId: selectedCourseId,
            midterm: row.midterm,
            assignments: row.assignments,
            project: row.project,
            final: row.final,
          }),
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  const stats = computeStats(edits);
  const distribution = buildDistribution(edits);
  const totalStudents = Object.keys(edits).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Grade Management</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter and manage student grades
          </p>
        </div>
        <Button
          className="gap-2 bg-indigo-600 hover:bg-indigo-700"
          onClick={handleSave}
          disabled={isSaving || !selectedCourseId || totalStudents === 0}
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Class Average
            </p>
            <p className="text-3xl mb-2">
              {stats ? stats.avg.toFixed(1) : "—"}
            </p>
            {stats && (
              <Badge className={getGradeColor(toLetterGrade(stats.avg))}>
                {toLetterGrade(stats.avg)}
              </Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Highest Grade
            </p>
            <p className="text-3xl mb-2">
              {stats ? stats.highest.toFixed(1) : "—"}
            </p>
            {stats && (
              <Badge className={getGradeColor(toLetterGrade(stats.highest))}>
                {toLetterGrade(stats.highest)}
              </Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Lowest Grade
            </p>
            <p className="text-3xl mb-2">
              {stats ? stats.lowest.toFixed(1) : "—"}
            </p>
            {stats && (
              <Badge className={getGradeColor(toLetterGrade(stats.lowest))}>
                {toLetterGrade(stats.lowest)}
              </Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Pass Rate
            </p>
            <p className="text-3xl mb-2">
              {stats ? `${stats.passRate}%` : "—"}
            </p>
            {stats && (
              <Badge
                className={
                  stats.passRate >= 80
                    ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                    : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                }
              >
                {stats.passRate >= 80 ? "Excellent" : "Needs Attention"}
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editable grade table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Grades</CardTitle>
                <Select
                  value={selectedCourseId}
                  onValueChange={setSelectedCourseId}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select a course…" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {!selectedCourseId ? (
                <div className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">
                  Select a course to view grades
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead className="text-center">
                        Midterm (30%)
                      </TableHead>
                      <TableHead className="text-center">
                        Assignments (20%)
                      </TableHead>
                      <TableHead className="text-center">
                        Project (25%)
                      </TableHead>
                      <TableHead className="text-center">Final (25%)</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isFetching ? (
                      <SkeletonRows />
                    ) : gradeData && gradeData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-gray-400 dark:text-gray-500 text-sm py-12"
                        >
                          No students found for this course
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
                                  <p className="text-sm">
                                    {student.studentName}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {student.studentEmail}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                value={row.midterm}
                                onChange={(e) =>
                                  handleChange(
                                    student.studentId,
                                    "midterm",
                                    e.target.value,
                                  )
                                }
                                className="w-16 text-center"
                                min="0"
                                max="100"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                value={row.assignments}
                                onChange={(e) =>
                                  handleChange(
                                    student.studentId,
                                    "assignments",
                                    e.target.value,
                                  )
                                }
                                className="w-16 text-center"
                                min="0"
                                max="100"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                value={row.project}
                                onChange={(e) =>
                                  handleChange(
                                    student.studentId,
                                    "project",
                                    e.target.value,
                                  )
                                }
                                className="w-16 text-center"
                                min="0"
                                max="100"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                value={row.final}
                                onChange={(e) =>
                                  handleChange(
                                    student.studentId,
                                    "final",
                                    e.target.value,
                                  )
                                }
                                className="w-16 text-center"
                                min="0"
                                max="100"
                              />
                            </TableCell>
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
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {distribution.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                {selectedCourseId
                  ? "No grades to display yet"
                  : "Select a course to see distribution"}
              </p>
            ) : (
              <div className="space-y-4">
                {distribution.map((item) => (
                  <div key={item.grade}>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getGradeColor(item.grade)}>
                        {item.grade}
                      </Badge>
                      <span className="text-sm">{item.count} students</span>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                          width:
                            totalStudents > 0
                              ? `${(item.count / totalStudents) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-6 border-t space-y-3">
              <h4 className="text-sm">Grading Scale</h4>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>A+ (4.0)</span>
                  <span>95-100</span>
                </div>
                <div className="flex justify-between">
                  <span>A (4.0)</span>
                  <span>90-94</span>
                </div>
                <div className="flex justify-between">
                  <span>A- (3.7)</span>
                  <span>87-89</span>
                </div>
                <div className="flex justify-between">
                  <span>B+ (3.3)</span>
                  <span>83-86</span>
                </div>
                <div className="flex justify-between">
                  <span>B (3.0)</span>
                  <span>80-82</span>
                </div>
                <div className="flex justify-between">
                  <span>B- (2.7)</span>
                  <span>77-79</span>
                </div>
                <div className="flex justify-between">
                  <span>C+ (2.3)</span>
                  <span>73-76</span>
                </div>
                <div className="flex justify-between">
                  <span>C (2.0)</span>
                  <span>70-72</span>
                </div>
                <div className="flex justify-between">
                  <span>C- (1.7)</span>
                  <span>67-69</span>
                </div>
                <div className="flex justify-between">
                  <span>D (1.0)</span>
                  <span>60-66</span>
                </div>
                <div className="flex justify-between">
                  <span>F (0.0)</span>
                  <span>Below 60</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
