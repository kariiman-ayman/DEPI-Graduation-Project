import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  CreditCard,
  BookOpen,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  gpa: number;
  status: string;
}

interface StudentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

export function StudentDetailsModal({ open, onOpenChange, student }: StudentDetailsModalProps) {
  if (!student) return null;

  const paymentHistory = [
    {
      id: "PAY001",
      semester: "Fall 2026",
      amount: 12500,
      dueDate: "2026-08-15",
      paidDate: "2026-08-10",
      status: "Paid",
      method: "Credit Card",
    },
    {
      id: "PAY002",
      semester: "Spring 2026",
      amount: 12500,
      dueDate: "2026-01-15",
      paidDate: "2026-01-14",
      status: "Paid",
      method: "Bank Transfer",
    },
    {
      id: "PAY003",
      semester: "Fall 2025",
      amount: 12000,
      dueDate: "2025-08-15",
      paidDate: "2025-08-20",
      status: "Paid (Late)",
      method: "Credit Card",
    },
  ];

  const enrolledCourses = [
    { id: "CS401", name: "Advanced Data Structures", credits: 4, grade: "A" },
    { id: "BUS301", name: "Business Analytics", credits: 3, grade: "A-" },
    { id: "ENG201", name: "Thermodynamics", credits: 4, grade: "B+" },
    { id: "MED101", name: "Human Anatomy", credits: 5, grade: "A" },
  ];

  const totalTuition = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPaid = paymentHistory
    .filter((p) => p.status.includes("Paid"))
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 text-xl">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <DialogTitle className="text-2xl">{student.name}</DialogTitle>
                <p className="text-sm text-gray-500">{student.id}</p>
              </div>
            </div>
            <Badge
              variant={student.status === "Active" ? "default" : "secondary"}
              className={student.status === "Active" ? "bg-green-100 text-green-700" : ""}
            >
              {student.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Academic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Department</p>
                      <p className="text-sm">{student.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Academic Year</p>
                      <p className="text-sm">{student.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Current GPA</p>
                      <p className="text-sm">{student.gpa.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Enrollment Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Current Semester</p>
                    <p className="text-sm">Fall 2026</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Enrolled Courses</p>
                    <p className="text-sm">{enrolledCourses.length} courses</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Credits</p>
                    <p className="text-sm">
                      {enrolledCourses.reduce((sum, course) => sum + course.credits, 0)} credits
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Payment Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Tuition (All Time)</span>
                    <span className="text-lg">${totalTuition.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Paid</span>
                    <span className="text-lg text-green-600">${totalPaid.toLocaleString()}</span>
                  </div>
                  <Progress value={(totalPaid / totalTuition) * 100} className="h-2" />
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">All payments up to date</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Current Courses - Fall 2026</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        <div>
                          <p className="text-sm">{course.name}</p>
                          <p className="text-xs text-gray-500">{course.id} • {course.credits} Credits</p>
                        </div>
                      </div>
                      <Badge variant="outline">{course.grade}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Attendance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-green-600">94%</div>
                  <Progress value={94} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl">23/25</div>
                  <p className="text-xs text-gray-500 mt-1">Completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Academic Standing</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-green-100 text-green-700">Good Standing</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Payment Summary</CardTitle>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Outstanding Balance</p>
                    <p className="text-xl text-green-600">$0.00</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Total Tuition</p>
                    <p className="text-lg">${totalTuition.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Total Paid</p>
                    <p className="text-lg text-green-600">${totalPaid.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Payment History</p>
                    <p className="text-lg">{paymentHistory.length} Transactions</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm">Payment History</h4>
                  {paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm">{payment.semester}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">ID: {payment.id}</span>
                            <span className="text-xs text-gray-500">Method: {payment.method}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">${payment.amount.toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {payment.status.includes("Paid") ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : payment.status === "Pending" ? (
                            <Clock className="w-3 h-3 text-orange-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-600" />
                          )}
                          <Badge
                            variant="outline"
                            className={
                              payment.status === "Paid"
                                ? "text-green-600 border-green-300"
                                : payment.status.includes("Late")
                                ? "text-orange-600 border-orange-300"
                                : "text-gray-600"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Payment Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm">Spring 2027 Tuition</p>
                      <p className="text-xs text-gray-500">Due: January 15, 2027</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">$12,500</p>
                      <Badge variant="outline" className="mt-1">Upcoming</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="text-sm">{student.email}</p>
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
                    <MapPin className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm">123 Campus Drive, University City, ST 12345</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm">Jane Martinez (Parent)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm">+1 (555) 987-6543</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Student Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm">May 15, 2002</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Nationality</p>
                    <p className="text-sm">United States</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Enrollment Date</p>
                    <p className="text-sm">August 2023</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Expected Graduation</p>
                    <p className="text-sm">May 2027</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
