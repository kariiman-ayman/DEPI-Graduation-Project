import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { Badge } from "_core/components/ui/badge";
import { Progress } from "_core/components/ui/progress";
import { Skeleton } from "_core/components/ui/skeleton";
import { Trophy, TrendingUp, Target, Award } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "_core/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useMyGrades } from "../hooks/useGrades";
import type { StudentGrade } from "../types/grade.types";

function getGradeColor(grade: string | null): string {
  if (!grade) return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
  if (grade.startsWith("A")) return "bg-green-100 dark:bg-green-900/20 text-green-700";
  if (grade.startsWith("B")) return "bg-blue-100 dark:bg-blue-900/20 text-blue-700";
  if (grade.startsWith("C")) return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700";
  return "bg-red-100 dark:bg-red-900/20 text-red-700";
}

function buildGradeDistribution(grades: StudentGrade[]) {
  const buckets: Record<string, { name: string; value: number; color: string }> = {
    A: { name: "A / A+", value: 0, color: "#10b981" },
    "A-": { name: "A-", value: 0, color: "#34d399" },
    B: { name: "B / B+", value: 0, color: "#3b82f6" },
    "B-": { name: "B-", value: 0, color: "#60a5fa" },
    C: { name: "C / C+", value: 0, color: "#f59e0b" },
    "C-": { name: "C-", value: 0, color: "#fbbf24" },
    D: { name: "D", value: 0, color: "#f97316" },
    F: { name: "F", value: 0, color: "#ef4444" },
  };

  for (const g of grades) {
    if (!g.letterGrade) continue;
    const lg = g.letterGrade;
    if (lg === "A+" || lg === "A") buckets["A"].value++;
    else if (lg === "A-") buckets["A-"].value++;
    else if (lg === "B+" || lg === "B") buckets["B"].value++;
    else if (lg === "B-") buckets["B-"].value++;
    else if (lg === "C+" || lg === "C") buckets["C"].value++;
    else if (lg === "C-") buckets["C-"].value++;
    else if (lg === "D") buckets["D"].value++;
    else buckets["F"].value++;
  }

  return Object.values(buckets).filter((b) => b.value > 0);
}

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j}>
                  <Skeleton className="h-3 w-16 mb-2" />
                  <Skeleton className="h-6 w-10" />
                </div>
              ))}
            </div>
            <Skeleton className="h-2 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function StudentGrades() {
  const { data, isLoading } = useMyGrades();

  const grades = data?.grades ?? [];
  const gpa = data?.gpa ?? 0;
  const totalCredits = data?.totalCredits ?? 0;
  const gradedCredits = data?.gradedCredits ?? 0;
  const gradeCount = grades.filter((g) => g.hasGrade).length;

  const gradeDistribution = buildGradeDistribution(grades);

  const gradedGrades = grades.filter((g) => g.hasGrade && g.total !== null);
  const totals = gradedGrades.map((g) => g.total as number);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Grades & GPA</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track your academic performance
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current GPA</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl">{gpa.toFixed(2)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Credits Enrolled</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl">{totalCredits}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Graded Credits</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl">{gradedCredits}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Grade Count</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl">{gradeCount}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">Current Semester</TabsTrigger>
          <TabsTrigger value="distribution">Grade Distribution</TabsTrigger>
        </TabsList>

        {/* Current Semester tab */}
        <TabsContent value="current" className="space-y-6">
          {isLoading ? (
            <SkeletonCards />
          ) : grades.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-gray-500 dark:text-gray-400">
                No grades found for your enrolled courses.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {grades.map((course) => (
                <Card key={course.courseId}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-1">
                          {course.courseName}
                        </CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {course.credits} Credits
                        </p>
                      </div>
                      <Badge
                        className={getGradeColor(course.letterGrade)}
                        style={{ fontSize: "1.1rem", padding: "0.5rem 1rem" }}
                      >
                        {course.letterGrade ?? "—"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!course.hasGrade ? (
                      <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                        No grades recorded yet
                      </p>
                    ) : (
                      <>
                        <div className="grid grid-cols-5 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Midterm (30%)
                            </p>
                            <p className="text-xl">
                              {course.midterm ?? "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Assignments (20%)
                            </p>
                            <p className="text-xl">
                              {course.assignments ?? "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Project (25%)
                            </p>
                            <p className="text-xl">
                              {course.project ?? "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Final (25%)
                            </p>
                            <p className="text-xl">
                              {course.final ?? "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Total
                            </p>
                            <p className="text-xl font-medium text-green-600">
                              {course.total !== null
                                ? course.total.toFixed(1)
                                : "—"}
                            </p>
                          </div>
                        </div>
                        <Progress
                          value={course.total ?? 0}
                          className="h-2"
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Grade Distribution tab */}
        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Semester Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {gradeDistribution.length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic text-center py-8">
                    No graded courses yet
                  </p>
                ) : (
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={gradeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {gradeDistribution.length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                    No graded courses yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {gradeDistribution.map((bucket) => {
                      const pct = Math.round(
                        (bucket.value / grades.length) * 100,
                      );
                      return (
                        <div key={bucket.name}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {bucket.name}
                            </span>
                            <span className="text-sm font-medium">
                              {bucket.value}{" "}
                              {bucket.value === 1 ? "course" : "courses"} (
                              {pct}%)
                            </span>
                          </div>
                          <Progress value={pct} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t">
                  <h5 className="text-sm font-medium mb-3">GPA Scale</h5>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>A+ / A (4.0)</span>
                      <span>90-100</span>
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
                      <span>D (1.0)</span>
                      <span>60-69</span>
                    </div>
                    <div className="flex justify-between">
                      <span>F (0.0)</span>
                      <span>Below 60</span>
                    </div>
                  </div>
                </div>

                {totals.length > 0 && (
                  <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Average Score</span>
                      <span className="font-medium">
                        {(
                          totals.reduce((a, b) => a + b, 0) / totals.length
                        ).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Highest Score</span>
                      <span className="font-medium">
                        {Math.max(...totals).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lowest Score</span>
                      <span className="font-medium">
                        {Math.min(...totals).toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
