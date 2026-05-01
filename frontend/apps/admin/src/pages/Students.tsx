import { useState } from "react";
import { Card, CardContent, CardHeader } from "_core/components/ui/card";
import { Input } from "_core/components/ui/input";
import { Button } from "_core/components/ui/button";
import { Badge } from "_core/components/ui/badge";
import { Search, UserPlus, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "_core/components/ui/table";
import { AddStudentModal } from "_core/components/modals/AddStudentModal";
import { StudentDetailsModal } from "_core/components/modals/StudentDetailsModal";

export default function AdminStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<
    (typeof students)[0] | null
  >(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const students = [
    {
      id: "STU001",
      name: "Alex Martinez",
      email: "alex.m@campus.edu",
      department: "Engineering",
      year: "3rd Year",
      gpa: 3.85,
      status: "Active",
    },
    {
      id: "STU002",
      name: "Sarah Johnson",
      email: "sarah.j@campus.edu",
      department: "Business",
      year: "2nd Year",
      gpa: 3.92,
      status: "Active",
    },
    {
      id: "STU003",
      name: "Michael Chen",
      email: "michael.c@campus.edu",
      department: "Sciences",
      year: "4th Year",
      gpa: 3.67,
      status: "Active",
    },
    {
      id: "STU004",
      name: "Emily Davis",
      email: "emily.d@campus.edu",
      department: "Arts",
      year: "1st Year",
      gpa: 3.78,
      status: "Active",
    },
    {
      id: "STU005",
      name: "Daniel Kim",
      email: "daniel.k@campus.edu",
      department: "Engineering",
      year: "3rd Year",
      gpa: 3.54,
      status: "Active",
    },
    {
      id: "STU006",
      name: "Sofia Rodriguez",
      email: "sofia.r@campus.edu",
      department: "Medicine",
      year: "2nd Year",
      gpa: 3.89,
      status: "Inactive",
    },
    {
      id: "STU007",
      name: "James Wilson",
      email: "james.w@campus.edu",
      department: "Business",
      year: "4th Year",
      gpa: 3.45,
      status: "Active",
    },
    {
      id: "STU008",
      name: "Olivia Brown",
      email: "olivia.b@campus.edu",
      department: "Sciences",
      year: "1st Year",
      gpa: 3.95,
      status: "Active",
    },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Student Management</h3>
          <p className="text-sm text-gray-500">
            Manage student enrollments and information
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setIsAddModalOpen(true)}
          >
            <UserPlus className="w-4 h-4" />
            Add Student
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search students by name, ID, or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
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
                  <TableCell>{student.department}</TableCell>
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
                        student.status === "Active" ? "default" : "secondary"
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
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsDetailsModalOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddStudentModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
      <StudentDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        student={selectedStudent}
      />
    </div>
  );
}
