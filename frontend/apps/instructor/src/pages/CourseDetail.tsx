import { useState } from "react";
import { useNavigate } from "react-router";
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
import {
  ArrowLeft,
  Search,
  Download,
  Save,
  BookOpen,
  Clock,
  MapPin,
  Calendar,
  Users,
  GraduationCap,
} from "lucide-react";

export default function InstructorCourseDetail() {
  const navigate = useNavigate();
  // const { courseId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock course data
  const course = {
    id: "CS401",
    name: "Advanced Data Structures",
    instructor: "Dr. Sarah Johnson",
    department: "Computer Science",
    enrolled: 45,
    capacity: 50,
    credits: 4,
    schedule: "Mon, Wed 10:00 AM - 11:30 AM",
    room: "Engineering Building, Room 201",
    semester: "Fall 2026",
    status: "Active",
    description:
      "This course covers advanced data structures including trees, graphs, heaps, hash tables, and their applications. Students will learn to analyze algorithm complexity and implement efficient solutions to complex problems. Topics include balanced search trees, graph algorithms, dynamic programming, and advanced sorting techniques.",
  };

  const enrolledStudents = [
    {
      id: "STU001",
      name: "Alex Martinez",
      email: "alex.m@campus.edu",
      year: "3rd Year",
      gpa: 3.85,
      status: "Active",
    },
    {
      id: "STU002",
      name: "Sarah Johnson",
      email: "sarah.j@campus.edu",
      year: "2nd Year",
      gpa: 3.92,
      status: "Active",
    },
    {
      id: "STU003",
      name: "Michael Chen",
      email: "michael.c@campus.edu",
      year: "4th Year",
      gpa: 3.67,
      status: "Active",
    },
    {
      id: "STU005",
      name: "Daniel Kim",
      email: "daniel.k@campus.edu",
      year: "3rd Year",
      gpa: 3.54,
      status: "Active",
    },
    {
      id: "STU008",
      name: "Olivia Brown",
      email: "olivia.b@campus.edu",
      year: "1st Year",
      gpa: 3.95,
      status: "Active",
    },
  ];

  const [grades, setGrades] = useState([
    {
      studentId: "STU001",
      name: "Alex Martinez",
      midterm: 85,
      assignments: 92,
      project: 88,
      final: 90,
    },
    {
      studentId: "STU002",
      name: "Sarah Johnson",
      midterm: 92,
      assignments: 95,
      project: 94,
      final: 93,
    },
    {
      studentId: "STU003",
      name: "Michael Chen",
      midterm: 78,
      assignments: 82,
      project: 85,
      final: 80,
    },
    {
      studentId: "STU005",
      name: "Daniel Kim",
      midterm: 75,
      assignments: 80,
      project: 78,
      final: 76,
    },
    {
      studentId: "STU008",
      name: "Olivia Brown",
      midterm: 95,
      assignments: 98,
      project: 96,
      final: 97,
    },
  ]);

  const [attendance, setAttendance] = useState([
    {
      studentId: "STU001",
      name: "Alex Martinez",
      present: true,
    },
    {
      studentId: "STU002",
      name: "Sarah Johnson",
      present: true,
    },
    {
      studentId: "STU003",
      name: "Michael Chen",
      present: false,
    },
    {
      studentId: "STU005",
      name: "Daniel Kim",
      present: true,
    },
    {
      studentId: "STU008",
      name: "Olivia Brown",
      present: true,
    },
  ]);

  const updateGrade = (studentId: string, field: string, value: string) => {
    setGrades((prev) =>
      prev.map((g) =>
        g.studentId === studentId ? { ...g, [field]: parseInt(value) || 0 } : g,
      ),
    );
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) =>
      prev.map((a) =>
        a.studentId === studentId ? { ...a, present: !a.present } : a,
      ),
    );
  };

  const calculateGrade = (student: (typeof grades)[0]) => {
    const weighted =
      student.midterm * 0.3 +
      student.assignments * 0.2 +
      student.project * 0.25 +
      student.final * 0.25;
    return weighted.toFixed(1);
  };

  const getLetterGrade = (numericGrade: number) => {
    if (numericGrade >= 93) return "A";
    if (numericGrade >= 90) return "A-";
    if (numericGrade >= 87) return "B+";
    if (numericGrade >= 83) return "B";
    if (numericGrade >= 80) return "B-";
    if (numericGrade >= 77) return "C+";
    if (numericGrade >= 73) return "C";
    if (numericGrade >= 70) return "C-";
    if (numericGrade >= 60) return "D";
    return "F";
  };

  const filteredStudents = enrolledStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const enrollmentPercentage = (course.enrolled / course.capacity) * 100;

  const gradeDistribution = grades.reduce(
    (acc, student) => {
      const grade = parseFloat(calculateGrade(student));
      const letter = getLetterGrade(grade);
      if (letter.startsWith("A")) acc.A++;
      else if (letter.startsWith("B")) acc.B++;
      else if (letter.startsWith("C")) acc.C++;
      else if (letter.startsWith("D")) acc.D++;
      else acc.F++;
      return acc;
    },
    { A: 0, B: 0, C: 0, D: 0, F: 0 },
  );

  const presentCount = attendance.filter((a) => a.present).length;
  const attendanceRate = (presentCount / attendance.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
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
            <div className="flex items-center gap-3 mb-2">
              <Badge
                variant="outline"
                className="text-indigo-600 border-indigo-300"
              >
                {course.id}
              </Badge>
              <Badge
                className={
                  course.status === "Full"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
                }
              >
                {course.status}
              </Badge>
            </div>
            <h3 className="text-2xl mb-1">{course.name}</h3>
            <p className="text-sm text-gray-500">{course.instructor}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border-b w-full justify-start rounded-none h-auto p-0">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="students"
            className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none"
          >
            Students
          </TabsTrigger>
          <TabsTrigger
            value="grades"
            className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none"
          >
            Grades
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none"
          >
            Attendance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm">{course.department}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Schedule</p>
                    <p className="text-sm">{course.schedule}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Room</p>
                    <p className="text-sm">{course.room}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Credits</p>
                    <p className="text-sm">{course.credits} Credits</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Capacity</p>
                    <p className="text-sm">
                      {course.enrolled}/{course.capacity} Students
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Semester</p>
                    <p className="text-sm">{course.semester}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Enrollment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Current Enrollment
                </span>
                <span className="text-sm">
                  {course.enrolled}/{course.capacity} (
                  {enrollmentPercentage.toFixed(0)}%)
                </span>
              </div>
              <Progress value={enrollmentPercentage} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Course Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed">
                {course.description}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name or ID..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>GPA</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-gray-50">
                      <TableCell>{student.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 text-xs">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <span>{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {student.email}
                      </TableCell>
                      <TableCell>{student.year}</TableCell>
                      <TableCell>
                        <span
                          className={
                            student.gpa >= 3.7
                              ? "text-green-600"
                              : student.gpa >= 3.0
                                ? "text-blue-600"
                                : "text-orange-600"
                          }
                        >
                          {student.gpa.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            student.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : ""
                          }
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades" className="space-y-6">
          <div className="flex gap-6">
            <Card className="flex-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Grade Management</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                    <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Midterm (30%)</TableHead>
                      <TableHead>Assignments (20%)</TableHead>
                      <TableHead>Project (25%)</TableHead>
                      <TableHead>Final (25%)</TableHead>
                      <TableHead>Current Grade</TableHead>
                      <TableHead>Letter</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grades.map((student) => {
                      const currentGrade = parseFloat(calculateGrade(student));
                      const letter = getLetterGrade(currentGrade);
                      return (
                        <TableRow
                          key={student.studentId}
                          className="hover:bg-gray-50"
                        >
                          <TableCell>
                            <div>
                              <p className="text-sm">{student.name}</p>
                              <p className="text-xs text-gray-500">
                                {student.studentId}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="w-16 h-8"
                              value={student.midterm}
                              onChange={(e) =>
                                updateGrade(
                                  student.studentId,
                                  "midterm",
                                  e.target.value,
                                )
                              }
                              min="0"
                              max="100"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="w-16 h-8"
                              value={student.assignments}
                              onChange={(e) =>
                                updateGrade(
                                  student.studentId,
                                  "assignments",
                                  e.target.value,
                                )
                              }
                              min="0"
                              max="100"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="w-16 h-8"
                              value={student.project}
                              onChange={(e) =>
                                updateGrade(
                                  student.studentId,
                                  "project",
                                  e.target.value,
                                )
                              }
                              min="0"
                              max="100"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="w-16 h-8"
                              value={student.final}
                              onChange={(e) =>
                                updateGrade(
                                  student.studentId,
                                  "final",
                                  e.target.value,
                                )
                              }
                              min="0"
                              max="100"
                            />
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                currentGrade >= 90
                                  ? "text-green-600"
                                  : currentGrade >= 80
                                    ? "text-blue-600"
                                    : currentGrade >= 70
                                      ? "text-orange-600"
                                      : "text-red-600"
                              }
                            >
                              {currentGrade.toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                letter.startsWith("A")
                                  ? "text-green-600 border-green-300"
                                  : letter.startsWith("B")
                                    ? "text-blue-600 border-blue-300"
                                    : letter.startsWith("C")
                                      ? "text-orange-600 border-orange-300"
                                      : "text-red-600 border-red-300"
                              }
                            >
                              {letter}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="w-64">
              <CardHeader>
                <CardTitle className="text-sm">Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">A Grades</span>
                    <Badge className="bg-green-100 text-green-700">
                      {gradeDistribution.A}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">B Grades</span>
                    <Badge className="bg-blue-100 text-blue-700">
                      {gradeDistribution.B}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">C Grades</span>
                    <Badge className="bg-orange-100 text-orange-700">
                      {gradeDistribution.C}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">D Grades</span>
                    <Badge className="bg-yellow-100 text-yellow-700">
                      {gradeDistribution.D}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">F Grades</span>
                    <Badge className="bg-red-100 text-red-700">
                      {gradeDistribution.F}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Today's Attendance - April 13, 2026
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center gap-6">
                <div className="text-4xl text-green-600">
                  {attendanceRate.toFixed(0)}%
                </div>
                <div className="flex-1">
                  <Progress value={attendanceRate} className="h-3" />
                  <p className="text-sm text-gray-600 mt-2">
                    {presentCount} out of {attendance.length} students present
                  </p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Mark Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((student) => (
                    <TableRow
                      key={student.studentId}
                      className="hover:bg-gray-50"
                    >
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            student.present
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {student.present ? "Present" : "Absent"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={student.present}
                            onCheckedChange={() =>
                              toggleAttendance(student.studentId)
                            }
                          />
                          <span className="text-sm text-gray-600">Present</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-end mt-6">
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                  <Save className="w-4 h-4" />
                  Save Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
