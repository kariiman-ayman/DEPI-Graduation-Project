import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import {
  Mail,
  Phone,
  BookOpen,
  Award,
  GraduationCap,
  Calendar,
} from "lucide-react";

interface Instructor {
  id: string;
  name: string;
  email: string;
  department: string;
  courses: number;
  experience: string;
  status: string;
}

interface InstructorInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instructor: Instructor | null;
}

export function InstructorInfoModal({ open, onOpenChange, instructor }: InstructorInfoModalProps) {
  if (!instructor) return null;

  const courseList = [
    "Advanced Data Structures",
    "Algorithm Design",
    "Database Systems",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 text-xl">
                  {instructor.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <DialogTitle className="text-2xl">{instructor.name}</DialogTitle>
                <p className="text-sm text-gray-500">{instructor.id}</p>
              </div>
            </div>
            <Badge
              variant={instructor.status === "Active" ? "default" : "secondary"}
              className={instructor.status === "Active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}
            >
              {instructor.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="text-sm">{instructor.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="text-sm">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Department</p>
                      <p className="text-sm">{instructor.department}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Title</p>
                      <p className="text-sm">Professor</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Experience</p>
                      <p className="text-sm">{instructor.experience}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Active Courses</p>
                      <p className="text-sm">{instructor.courses} Courses</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm mb-3">Teaching Assignments</h4>
              <div className="space-y-2">
                {courseList.slice(0, instructor.courses).map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm">{course}</span>
                    </div>
                    <Badge variant="outline">Fall 2026</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm mb-3">Additional Information</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Specialization</p>
                    <p className="text-sm">Data Structures & Algorithms</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Office Hours</p>
                    <p className="text-sm">Tue, Thu 2:00 PM - 4:00 PM</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Office Location</p>
                    <p className="text-sm">CS Building, Room 304</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Joined Date</p>
                    <p className="text-sm">September 2014</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
