import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "_core/components/ui/table";
import { Badge } from "_core/components/ui/badge";
import { Save, Download } from "lucide-react";

export default function InstructorGrades() {
  const [selectedCourse, setSelectedCourse] = useState("CS401");

  const courses = [
    { id: "CS401", name: "Advanced Data Structures" },
    { id: "CS301", name: "Database Systems" },
    { id: "CS201", name: "Data Structures" },
  ];

  const students = [
    {
      id: "STU001",
      name: "Alex Martinez",
      midterm: 85,
      assignments: 88,
      project: 90,
      final: 87,
      total: 87.5,
      grade: "A-",
    },
    {
      id: "STU002",
      name: "Sarah Johnson",
      midterm: 92,
      assignments: 95,
      project: 94,
      final: 93,
      total: 93.5,
      grade: "A",
    },
    {
      id: "STU003",
      name: "Michael Chen",
      midterm: 78,
      assignments: 82,
      project: 80,
      final: 79,
      total: 79.8,
      grade: "B",
    },
    {
      id: "STU004",
      name: "Emily Davis",
      midterm: 88,
      assignments: 90,
      project: 87,
      final: 89,
      total: 88.5,
      grade: "A-",
    },
    {
      id: "STU005",
      name: "Daniel Kim",
      midterm: 75,
      assignments: 78,
      project: 76,
      final: 77,
      total: 76.5,
      grade: "B-",
    },
    {
      id: "STU006",
      name: "Sofia Rodriguez",
      midterm: 95,
      assignments: 97,
      project: 96,
      final: 95,
      total: 95.8,
      grade: "A+",
    },
  ];

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-700";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-700";
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-700";
    return "bg-orange-100 text-orange-700";
  };

  const gradeDistribution = [
    { grade: "A+", count: 1 },
    { grade: "A", count: 1 },
    { grade: "A-", count: 2 },
    { grade: "B", count: 1 },
    { grade: "B-", count: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Grade Management</h3>
          <p className="text-sm text-gray-500">
            Enter and manage student grades
          </p>
        </div>
        <div className="flex gap-3">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Class Average</p>
            <p className="text-3xl mb-2">85.3</p>
            <Badge className="bg-green-100 text-green-700">B+</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Highest Grade</p>
            <p className="text-3xl mb-2">95.8</p>
            <Badge className="bg-green-100 text-green-700">A+</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Lowest Grade</p>
            <p className="text-3xl mb-2">76.5</p>
            <Badge className="bg-blue-100 text-blue-700">B-</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
            <p className="text-3xl mb-2">100%</p>
            <Badge className="bg-green-100 text-green-700">Excellent</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Grades</CardTitle>
                <Select
                  value={selectedCourse}
                  onValueChange={setSelectedCourse}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.id} - {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  {students.map((student) => (
                    <TableRow key={student.id}>
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
                          <div>
                            <p className="text-sm">{student.name}</p>
                            <p className="text-xs text-gray-500">
                              {student.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          defaultValue={student.midterm}
                          className="w-16 text-center"
                          min="0"
                          max="100"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          defaultValue={student.assignments}
                          className="w-16 text-center"
                          min="0"
                          max="100"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          defaultValue={student.project}
                          className="w-16 text-center"
                          min="0"
                          max="100"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          defaultValue={student.final}
                          className="w-16 text-center"
                          min="0"
                          max="100"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        {student.total.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getGradeColor(student.grade)}>
                          {student.grade}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gradeDistribution.map((item) => (
                <div key={item.grade}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getGradeColor(item.grade)}>
                      {item.grade}
                    </Badge>
                    <span className="text-sm">{item.count} students</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${(item.count / students.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t space-y-3">
              <h4 className="text-sm">Grading Scale</h4>
              <div className="space-y-2 text-xs text-gray-600">
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
                  <span>75-79</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
