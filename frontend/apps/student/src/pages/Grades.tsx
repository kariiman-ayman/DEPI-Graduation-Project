import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { Badge } from "_core/components/ui/badge";
import { Progress } from "_core/components/ui/progress";
import { Trophy, TrendingUp, Target, Award } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "_core/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function StudentGrades() {
  const currentSemesterCourses = [
    {
      code: "CS401",
      name: "Advanced Data Structures",
      midterm: 85,
      assignments: 88,
      project: 90,
      final: 0,
      current: 87.5,
      grade: "A-",
      credits: 4,
    },
    {
      code: "CS301",
      name: "Database Systems",
      midterm: 82,
      assignments: 85,
      project: 83,
      final: 0,
      current: 83.3,
      grade: "B",
      credits: 3,
    },
    {
      code: "BUS201",
      name: "Business Analytics",
      midterm: 92,
      assignments: 95,
      project: 94,
      final: 0,
      current: 93.5,
      grade: "A",
      credits: 3,
    },
    {
      code: "ENG301",
      name: "Technical Writing",
      midterm: 88,
      assignments: 90,
      project: 87,
      final: 0,
      current: 88.5,
      grade: "A-",
      credits: 3,
    },
    {
      code: "MATH201",
      name: "Statistics",
      midterm: 78,
      assignments: 82,
      project: 80,
      final: 0,
      current: 79.8,
      grade: "B",
      credits: 4,
    },
  ];

  const gpaHistory = [
    { semester: "Fall 2024", gpa: 3.52 },
    { semester: "Spring 2025", gpa: 3.67 },
    { semester: "Summer 2025", gpa: 3.71 },
    { semester: "Fall 2025", gpa: 3.78 },
    { semester: "Spring 2026", gpa: 3.85 },
  ];

  const gradeDistribution = [
    { name: "A/A+", value: 2, color: "#10b981" },
    { name: "A-", value: 2, color: "#3b82f6" },
    { name: "B", value: 2, color: "#6366f1" },
  ];

  const totalCredits = currentSemesterCourses.reduce(
    (sum, course) => sum + course.credits,
    0,
  );
  const weightedGPA =
    currentSemesterCourses.reduce((sum, course) => {
      const gradePoints = course.grade.startsWith("A")
        ? course.grade === "A-"
          ? 3.7
          : 4.0
        : 3.0;
      return sum + gradePoints * course.credits;
    }, 0) / totalCredits;

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-700";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Grades & GPA</h3>
          <p className="text-sm text-gray-500">
            Track your academic performance
          </p>
        </div>
      </div>

      {/* GPA Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current GPA</p>
                <p className="text-2xl">{weightedGPA.toFixed(2)}</p>
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
                <p className="text-sm text-gray-600">Cumulative GPA</p>
                <p className="text-2xl">3.85</p>
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
                <p className="text-sm text-gray-600">Credits Earned</p>
                <p className="text-2xl">87/{totalCredits + 87}</p>
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
                <p className="text-sm text-gray-600">Class Rank</p>
                <p className="text-2xl">Top 10%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">Current Semester</TabsTrigger>
          <TabsTrigger value="history">GPA History</TabsTrigger>
          <TabsTrigger value="distribution">Grade Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {currentSemesterCourses.map((course) => (
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
                        {course.credits} Credits
                      </p>
                    </div>
                    <Badge
                      className={getGradeColor(course.grade)}
                      style={{ fontSize: "1.1rem", padding: "0.5rem 1rem" }}
                    >
                      {course.grade}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Midterm (30%)
                      </p>
                      <p className="text-xl">{course.midterm}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Assignments (20%)
                      </p>
                      <p className="text-xl">{course.assignments}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Project (25%)
                      </p>
                      <p className="text-xl">{course.project}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Final (25%)</p>
                      <p className="text-xl">{course.final || "Pending"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current</p>
                      <p className="text-xl font-medium text-green-600">
                        {course.current.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <Progress value={course.current} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GPA Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={gpaHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="semester" stroke="#6b7280" />
                  <YAxis domain={[3.0, 4.0]} stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="gpa"
                    stroke="#6366f1"
                    strokeWidth={3}
                    name="GPA"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Dean's List</p>
                      <p className="text-sm text-gray-600">
                        Fall 2025, Spring 2026
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Honor Roll</p>
                      <p className="text-sm text-gray-600">
                        3 consecutive semesters
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Most Improved</p>
                      <p className="text-sm text-gray-600">
                        +0.33 GPA increase
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Semester Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gpaHistory
                    .slice(-3)
                    .reverse()
                    .map((sem, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{sem.semester}</p>
                          <p className="text-sm text-gray-600">
                            GPA: {sem.gpa.toFixed(2)}
                          </p>
                        </div>
                        <Badge
                          className={
                            sem.gpa >= 3.7
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        >
                          {sem.gpa >= 3.7 ? "Excellent" : "Good"}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Semester Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">A Grades</span>
                      <span className="text-sm font-medium">
                        2 courses (40%)
                      </span>
                    </div>
                    <Progress
                      value={40}
                      className="h-2 bg-green-100 [&>div]:bg-green-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">A- Grades</span>
                      <span className="text-sm font-medium">
                        2 courses (40%)
                      </span>
                    </div>
                    <Progress
                      value={40}
                      className="h-2 bg-blue-100 [&>div]:bg-blue-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">B Grades</span>
                      <span className="text-sm font-medium">
                        1 course (20%)
                      </span>
                    </div>
                    <Progress
                      value={20}
                      className="h-2 bg-indigo-100 [&>div]:bg-indigo-500"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h5 className="text-sm font-medium mb-3">GPA Scale</h5>
                  <div className="space-y-2 text-sm text-gray-600">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
