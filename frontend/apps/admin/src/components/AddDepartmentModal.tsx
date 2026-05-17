import { useCreateDepartment } from "../hooks/useDepartments";
import { Button } from "_core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "_core/components/ui/dialog";
import { Input } from "_core/components/ui/input";
import { Label } from "_core/components/ui/label";
import { useState } from "react";

interface AddDepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDepartmentModal({
  open,
  onOpenChange,
}: AddDepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });
  const { mutateAsync } = useCreateDepartment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onOpenChange(false);
    // Reset form
    setFormData({
      name: "",
      code: "",
    });
    mutateAsync(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add new department</DialogTitle>
          <DialogDescription>
            Enter the department details to add them to the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Computer Science"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Department Code *</Label>
              <Input
                id="code"
                type="code"
                placeholder="CS201"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Add Department
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
