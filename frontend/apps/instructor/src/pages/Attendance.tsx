import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
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
import { Calendar, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "_core/components/ui/table";

export default function InstructorAttendance() {
  const [selectedCourse, setSelectedCourse] = useState("CS401");
  const [attendanceDate] = useState("2026-02-20");

  const courses = [
    { id: "CS401", name: "Advanced Data Structures" },
    { id: "CS301", name: "Database Systems" },
    { id: "CS201", name: "Data Structures" },
  ];

  const students = [
    {
      id: "STU001",
      name: "Alex Martinez",
      attendance: [true, true, false, true, true, true, true, true],
    },
    {
      id: "STU002",
      name: "Sarah Johnson",
      attendance: [true, true, true, true, true, true, true, true],
    },
    {
      id: "STU003",
      name: "Michael Chen",
      attendance: [true, false, true, true, true, false, true, true],
    },
    {
      id: "STU004",
      name: "Emily Davis",
      attendance: [true, true, true, true, true, true, true, true],
    },
    {
      id: "STU005",
      name: "Daniel Kim",
      attendance: [true, true, true, false, true, true, true, true],
    },
    {
      id: "STU006",
      name: "Sofia Rodriguez",
      attendance: [false, true, true, true, true, true, true, true],
    },
    {
      id: "STU007",
      name: "James Wilson",
      attendance: [true, true, true, true, false, true, true, true],
    },
    {
      id: "STU008",
      name: "Olivia Brown",
      attendance: [true, true, true, true, true, true, true, true],
    },
  ];

  const calculateAttendanceRate = (attendance: boolean[]) => {
    const present = attendance.filter((a) => a).length;
    return ((present / attendance.length) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Attendance Management</h3>
          <p className="text-sm text-gray-500">
            Mark and track student attendance
          </p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Calendar className="w-4 h-4" />
          Mark Today's Attendance
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <CardTitle>Attendance Records</CardTitle>
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
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
          <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Selected Date</p>
              <p className="text-lg">
                {new Date(attendanceDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Badge className="bg-blue-600">Today</Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Present</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Attendance Rate</TableHead>
                <TableHead className="text-center">Last 8 Sessions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const rate = calculateAttendanceRate(student.attendance);
                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox defaultChecked />
                    </TableCell>
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-24">
                          <div
                            className={`h-2 rounded-full ${
                              parseFloat(rate) >= 90
                                ? "bg-green-500"
                                : parseFloat(rate) >= 75
                                  ? "bg-blue-500"
                                  : "bg-orange-500"
                            }`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{rate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        {student.attendance.map((present, index) => (
                          <div
                            key={index}
                            className={`w-6 h-6 rounded flex items-center justify-center ${
                              present
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {present ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Present: <span className="font-medium">42/45</span> students
              (93.3%)
            </p>
            <Button>Save Attendance</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
