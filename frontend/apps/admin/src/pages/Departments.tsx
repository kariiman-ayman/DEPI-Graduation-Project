import { AddDepartmentModal } from "../components/AddDepartmentModal";
import { Button } from "_core/components/ui/button";
import { Card, CardContent, CardHeader } from "_core/components/ui/card";
import { Input } from "_core/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "_core/components/ui/table";
import { PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import { useDeleteDepartment, useDepartments } from "../hooks/useDepartments";

const Departments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: departments, isLoading } = useDepartments();
  const { mutateAsync, isPending } = useDeleteDepartment();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!departments) {
    return <div>No departments found</div>;
  }

  const filteredDepartments = departments.filter(
    (department) =>
      department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteUser = async (id: string) => {
    await mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Departments Management</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Add and manage departments</p>
        </div>
        <div className="flex gap-3">
          <Button
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle className="w-4 h-4" />
            Add New Department
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search departments by name or code..."
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
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead></TableHead>
                {/* <TableHead>Created At</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>{department.name}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {department.code}
                  </TableCell>
                  <TableCell>
                    <Button
                      disabled={isPending}
                      variant="destructive"
                      className="gap-2 bg-red-600 hover:bg-red-700"
                      onClick={() => handleDeleteUser(department.id)}
                    >
                      {isPending ? "Deleting..." : "Delete"}
                    </Button>
                  </TableCell>
                  {/* <TableCell className="text-gray-600">
                    {department.createdAt.toDateString()}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddDepartmentModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default Departments;
