import { useState } from "react";
import { Card, CardContent, CardHeader } from "_core/components/ui/card";
import { Input } from "_core/components/ui/input";
import { Button } from "_core/components/ui/button";
import { Badge } from "_core/components/ui/badge";
import { Search, UserPlus, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "_core/components/ui/table";
import { StudentDetailsModal } from "_core/components/modals/StudentDetailsModal";
import { InviteModal } from "../components/InviteModal";
import { useStudents, useStudentDetails } from "../hooks/useStudents";

function getInitials(name: string | null) {
  if (!name) return "?";
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join("") || "?"
  );
}

function GpaDisplay({ gpa }: { gpa: number | null }) {
  if (gpa === null)
    return <span className="text-gray-400 dark:text-gray-500">—</span>;
  const color =
    gpa >= 3.7
      ? "text-green-600"
      : gpa >= 3.0
        ? "text-blue-600"
        : "text-orange-600";
  return <span className={color}>{gpa.toFixed(2)}</span>;
}

export default function AdminStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: students, isLoading, isError, error } = useStudents();
  const { data: studentDetail, isLoading: loadingDetail } =
    useStudentDetails(selectedStudentId);

  const filtered = (students ?? []).filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      (s.name ?? "").toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
    );
  });

  const handleView = (id: string) => {
    setSelectedStudentId(id);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = (open: boolean) => {
    setIsDetailsOpen(open);
    if (!open) setSelectedStudentId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Student Management
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage student enrollments and information
          </p>
        </div>
        <Button
          className="gap-2 bg-indigo-600 hover:bg-indigo-700"
          onClick={() => setIsInviteOpen(true)}
        >
          <UserPlus className="w-4 h-4" />
          Invite Student
        </Button>
      </div>

      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search by name, email, or ID…"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading && (
            <div className="space-y-3 py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          )}

          {isError && (
            <div className="flex items-center gap-3 text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-sm">
                {error instanceof Error
                  ? error.message
                  : "Failed to load students"}
              </p>
            </div>
          )}

          {!isLoading && !isError && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Year</TableHead>
                  <TableHead className="text-center">Courses</TableHead>
                  <TableHead className="text-center">Avg GPA</TableHead>
                  <TableHead className="text-right">Total Paid</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-12 text-gray-400 dark:text-gray-500"
                    >
                      {searchTerm
                        ? "No students match your search."
                        : "No students found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((student) => (
                    <TableRow
                      key={student.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                              {getInitials(student.name)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {student.name ?? (
                              <span className="text-gray-400 italic">
                                No name
                              </span>
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {student.email}
                      </TableCell>
                      <TableCell className="text-center">
                        {student.academicYear ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full">
                            Year {student.academicYear}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-gray-700 dark:text-gray-200">
                        {student.enrolledCourses}
                      </TableCell>
                      <TableCell className="text-center">
                        <GpaDisplay gpa={student.averageGrade} />
                      </TableCell>
                      <TableCell className="text-right text-gray-700 dark:text-gray-200">
                        ${student.totalPaid.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={
                            student.enrolledCourses > 0
                              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          }
                        >
                          {student.enrolledCourses > 0 ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(student.id)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {!isLoading && !isError && students && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
              {filtered.length} of {students.length} student
              {students.length !== 1 ? "s" : ""}
            </p>
          )}
        </CardContent>
      </Card>

      <InviteModal open={isInviteOpen} onOpenChange={setIsInviteOpen} />

      <StudentDetailsModal
        open={isDetailsOpen}
        onOpenChange={handleCloseDetails}
        studentId={selectedStudentId}
        detail={studentDetail ?? null}
        isLoading={loadingDetail}
      />
    </div>
  );
}
