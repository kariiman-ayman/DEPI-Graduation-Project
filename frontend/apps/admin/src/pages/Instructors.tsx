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
import { AddInstructorModal } from "_core/components/modals/AddInstructorModal";
import { InstructorInfoModal } from "_core/components/modals/InstructorInfoModal";

export default function AdminInstructors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<
    (typeof instructors)[0] | null
  >(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const instructors = [
    {
      id: "INS001",
      name: "Dr. Sarah Johnson",
      email: "sarah.j@campus.edu",
      department: "Computer Science",
      courses: 3,
      experience: "12 years",
      status: "Active",
    },
    {
      id: "INS002",
      name: "Prof. Michael Chen",
      email: "michael.c@campus.edu",
      department: "Business",
      courses: 2,
      experience: "8 years",
      status: "Active",
    },
    {
      id: "INS003",
      name: "Dr. Emily Davis",
      email: "emily.d@campus.edu",
      department: "Engineering",
      courses: 4,
      experience: "15 years",
      status: "Active",
    },
    {
      id: "INS004",
      name: "Dr. James Wilson",
      email: "james.w@campus.edu",
      department: "Medicine",
      courses: 2,
      experience: "10 years",
      status: "Active",
    },
    {
      id: "INS005",
      name: "Prof. Sofia Rodriguez",
      email: "sofia.r@campus.edu",
      department: "Arts",
      courses: 3,
      experience: "7 years",
      status: "Active",
    },
    {
      id: "INS006",
      name: "Dr. Daniel Kim",
      email: "daniel.k@campus.edu",
      department: "Sciences",
      courses: 2,
      experience: "9 years",
      status: "On Leave",
    },
    {
      id: "INS007",
      name: "Dr. Amanda Lee",
      email: "amanda.l@campus.edu",
      department: "Mathematics",
      courses: 3,
      experience: "11 years",
      status: "Active",
    },
    {
      id: "INS008",
      name: "Prof. Robert Taylor",
      email: "robert.t@campus.edu",
      department: "Physics",
      courses: 2,
      experience: "14 years",
      status: "Active",
    },
  ];

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Instructor Management</h3>
          <p className="text-sm text-gray-500">
            Manage instructor information and assignments
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
            Add Instructor
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search instructors by name, ID, or email..."
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
                <TableHead>Instructor ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstructors.map((instructor) => (
                <TableRow key={instructor.id}>
                  <TableCell>{instructor.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 text-xs">
                          {instructor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span>{instructor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {instructor.email}
                  </TableCell>
                  <TableCell>{instructor.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {instructor.courses} Courses
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {instructor.experience}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        instructor.status === "Active" ? "default" : "secondary"
                      }
                      className={
                        instructor.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }
                    >
                      {instructor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedInstructor(instructor);
                        setIsInfoModalOpen(true);
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

      <AddInstructorModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
      <InstructorInfoModal
        open={isInfoModalOpen}
        onOpenChange={setIsInfoModalOpen}
        instructor={selectedInstructor}
      />
    </div>
  );
}
