import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Course {
  id: string;
  name: string;
  instructor: string;
  department: string;
  credits: number;
  capacity: number;
  schedule: string;
  room: string;
  semester: string;
  description: string;
}

interface EditCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
}

export function EditCourseModal({
  open,
  onOpenChange,
  course,
}: EditCourseModalProps) {
  const [formData, setFormData] = useState({
    courseId: "",
    courseName: "",
    department: "",
    instructor: "",
    credits: "",
    capacity: "",
    schedule: "",
    room: "",
    description: "",
    semester: "",
  });

  useEffect(() => {
    if (course) {
      setFormData({
        courseId: course.id,
        courseName: course.name,
        department: course.department.toLowerCase().replace(" ", "-"),
        instructor: course.instructor
          .toLowerCase()
          .replace(/\.\s+/g, "-")
          .replace(" ", "-"),
        credits: course.credits.toString(),
        capacity: course.capacity.toString(),
        schedule: course.schedule,
        room: course.room,
        description: course.description,
        semester: course.semester.toLowerCase().replace(" ", "-"),
      });
    }
  }, [course]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated course data:", formData);
    // Handle form submission
    onOpenChange(false);
  };

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>
            Update the course details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseId">Course ID *</Label>
                <Input
                  id="courseId"
                  placeholder="CS401"
                  value={formData.courseId}
                  onChange={(e) =>
                    setFormData({ ...formData, courseId: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Credits *</Label>
                <Input
                  id="credits"
                  type="number"
                  placeholder="4"
                  value={formData.credits}
                  onChange={(e) =>
                    setFormData({ ...formData, credits: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name *</Label>
              <Input
                id="courseName"
                placeholder="Advanced Data Structures"
                value={formData.courseName}
                onChange={(e) =>
                  setFormData({ ...formData, courseName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Course description and objectives..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    setFormData({ ...formData, department: value })
                  }
                  required
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="sciences">Sciences</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="computer-science">
                      Computer Science
                    </SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value) =>
                    setFormData({ ...formData, semester: value })
                  }
                  required
                >
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fall-2026">Fall 2026</SelectItem>
                    <SelectItem value="spring-2026">Spring 2026</SelectItem>
                    <SelectItem value="summer-2026">Summer 2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor *</Label>
              <Select
                value={formData.instructor}
                onValueChange={(value) =>
                  setFormData({ ...formData, instructor: value })
                }
                required
              >
                <SelectTrigger id="instructor">
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dr-sarah-johnson">
                    Dr. Sarah Johnson
                  </SelectItem>
                  <SelectItem value="prof-michael-chen">
                    Prof. Michael Chen
                  </SelectItem>
                  <SelectItem value="dr-emily-davis">
                    Dr. Emily Davis
                  </SelectItem>
                  <SelectItem value="dr-james-wilson">
                    Dr. James Wilson
                  </SelectItem>
                  <SelectItem value="prof-sofia-rodriguez">
                    Prof. Sofia Rodriguez
                  </SelectItem>
                  <SelectItem value="dr-daniel-kim">Dr. Daniel Kim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule *</Label>
              <Input
                id="schedule"
                placeholder="Mon, Wed 10:00 AM - 11:30 AM"
                value={formData.schedule}
                onChange={(e) =>
                  setFormData({ ...formData, schedule: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room">Room *</Label>
                <Input
                  id="room"
                  placeholder="Engineering Building, Room 201"
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({ ...formData, room: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Maximum Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="50"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  required
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
