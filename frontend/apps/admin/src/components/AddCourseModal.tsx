import { useInstructors } from "../hooks/useInstructor";
import { useCreateCourse } from "../hooks/useCourses";
import { useDepartments } from "../hooks/useDepartments";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "_core/components/ui/select";
import { useState } from "react";

interface AddCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCourseModal({ open, onOpenChange }: AddCourseModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    departmentId: "",
    instructorId: "",
    credits: 0,
    lectureTime: {
      day: "",
      start: "",
      end: "",
    },
    minYear: null as number | null,
    capacity: "" as number | "",
  });

  const { data: departments } = useDepartments();
  const { data: instructors } = useInstructors();
  const { mutateAsync } = useCreateCourse();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutateAsync({
      ...formData,
      capacity: formData.capacity !== "" ? (formData.capacity as number) : null,
    });

    onOpenChange(false);

    setFormData({
      title: "",
      departmentId: "",
      instructorId: "",
      credits: 0,
      lectureTime: { day: "", start: "", end: "" },
      minYear: null,
      capacity: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Enter the course details to add it to the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name *</Label>
              <Input
                id="courseName"
                placeholder="Advanced Data Structures"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, departmentId: value })
                  }
                  required
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments?.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Credits *</Label>
                <Input
                  id="credits"
                  type="number"
                  placeholder="4"
                  value={formData.credits}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credits: Number.parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor *</Label>
              <Select
                value={formData.instructorId}
                onValueChange={(value) =>
                  setFormData({ ...formData, instructorId: value })
                }
                required
              >
                <SelectTrigger id="instructor">
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors?.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule *</Label>
                <Select
                  required
                  value={formData.lectureTime.day}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      lectureTime: {
                        ...formData.lectureTime,
                        day: value,
                      },
                    })
                  }
                >
                  <SelectTrigger id="schedule">
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.lectureTime.start}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lectureTime: {
                        ...formData.lectureTime,
                        start: e.target.value,
                      },
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.lectureTime.end}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lectureTime: {
                        ...formData.lectureTime,
                        end: e.target.value,
                      },
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Min. Academic Year{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </Label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[null, 1, 2, 3, 4].map((yr) => (
                    <button
                      key={yr ?? "none"}
                      type="button"
                      onClick={() => setFormData({ ...formData, minYear: yr })}
                      className={`py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                        formData.minYear === yr
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      {yr === null ? "Any" : `Yr ${yr}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">
                  Max Students{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  placeholder="e.g. 40"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity:
                        e.target.value === "" ? "" : parseInt(e.target.value),
                    })
                  }
                />
              </div>
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
              Add Course
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
