import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import {
  Mail,
  Calendar,
  GraduationCap,
  CreditCard,
  BookOpen,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  BarChart2,
  AlertCircle,
  Layers,
} from "lucide-react";
interface StudentCourse {
  courseId: string;
  enrollmentStatus: "active" | "inactive";
  title: string;
  instructor: string;
  credits: number;
  lectureTime: { day: string; start: string; end: string } | null;
  grade: {
    total: number;
    letterGrade: string;
    gradePoints: number;
    midterm: number;
    assignments: number;
    project: number;
    final: number;
  } | null;
  payment: {
    id: string;
    amount: number;
    status: "paid" | "pending" | "overdue";
    dueDate: string;
    paidAt: string | null;
    transactionId: string | null;
    method: string | null;
  } | null;
  attendance: { present: number; total: number; rate: number };
}

interface StudentPayment {
  id: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  description: string;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  paidAt: string | null;
  transactionId: string | null;
  method: string | null;
}

export interface StudentDetail {
  id: string;
  name: string | null;
  email: string;
  academicYear: number | null;
  createdAt: string | null;
  stats: {
    enrolledCourses: number;
    attendanceRate: number;
    averageGrade: number | null;
    totalPaid: number;
    totalDue: number;
  };
  courses: StudentCourse[];
  payments: StudentPayment[];
}

interface StudentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string | null;
  detail: StudentDetail | null;
  isLoading: boolean;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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

function PaymentStatusBadge({ status }: { status: "paid" | "pending" | "overdue" }) {
  if (status === "paid")
    return (
      <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 gap-1">
        <CheckCircle className="w-3 h-3" /> Paid
      </Badge>
    );
  if (status === "overdue")
    return (
      <Badge className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 gap-1">
        <XCircle className="w-3 h-3" /> Overdue
      </Badge>
    );
  return (
    <Badge className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 gap-1">
      <Clock className="w-3 h-3" /> Pending
    </Badge>
  );
}

function GradeLetterBadge({ grade }: { grade: string }) {
  const color =
    grade.startsWith("A")
      ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
      : grade.startsWith("B")
      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
      : grade.startsWith("C")
      ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
      : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400";
  return <Badge className={color}>{grade}</Badge>;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}

export function StudentDetailsModal({
  open,
  onOpenChange,
  detail,
  isLoading,
}: StudentDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          {isLoading || !detail ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-indigo-600 dark:text-indigo-400 text-xl font-bold">
                    {getInitials(detail.name)}
                  </span>
                </div>
                <div>
                  <DialogTitle className="text-xl dark:text-white">
                    {detail.name ?? "Unknown Student"}
                  </DialogTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5" />
                    {detail.email}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {detail.academicYear && (
                      <span className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full font-medium">
                        <Layers className="w-3 h-3" />
                        Year {detail.academicYear}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {formatDate(detail.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <Badge
                className={
                  detail.stats.enrolledCourses > 0
                    ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }
              >
                {detail.stats.enrolledCourses > 0 ? "Active" : "Inactive"}
              </Badge>
            </div>
          )}
        </DialogHeader>

        {isLoading && (
          <div className="space-y-3 py-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && !detail && (
          <div className="py-10 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Failed to load student data.</p>
          </div>
        )}

        {!isLoading && detail && (
          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="grid w-full grid-cols-3 dark:bg-gray-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            {/* ── Overview ── */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                {detail.academicYear && (
                  <StatCard
                    icon={Layers}
                    label="Academic Year"
                    value={`Year ${detail.academicYear}`}
                    color="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                  />
                )}
                <StatCard
                  icon={BookOpen}
                  label="Enrolled Courses"
                  value={String(detail.stats.enrolledCourses)}
                  color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                />
                <StatCard
                  icon={Users}
                  label="Attendance Rate"
                  value={`${detail.stats.attendanceRate}%`}
                  color="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Average GPA"
                  value={
                    detail.stats.averageGrade !== null
                      ? detail.stats.averageGrade.toFixed(2)
                      : "—"
                  }
                  color="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                />
                <StatCard
                  icon={CreditCard}
                  label="Total Paid"
                  value={`$${detail.stats.totalPaid.toLocaleString()}`}
                  sub={
                    detail.stats.totalDue > 0
                      ? `$${detail.stats.totalDue.toLocaleString()} outstanding`
                      : "No outstanding balance"
                  }
                  color="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                />
              </div>

              {/* Payment progress bar */}
              {detail.stats.totalPaid + detail.stats.totalDue > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Payment progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.round(
                        (detail.stats.totalPaid /
                          (detail.stats.totalPaid + detail.stats.totalDue)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (detail.stats.totalPaid /
                        (detail.stats.totalPaid + detail.stats.totalDue)) *
                      100
                    }
                    className="h-2"
                  />
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Paid: ${detail.stats.totalPaid.toLocaleString()}
                    </span>
                    {detail.stats.totalDue > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-500" />
                        Due: ${detail.stats.totalDue.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ── Courses ── */}
            <TabsContent value="courses" className="mt-4">
              {detail.courses.length === 0 ? (
                <div className="py-12 text-center">
                  <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No courses enrolled.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {detail.courses.map((course) => (
                    <div
                      key={course.courseId}
                      className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{course.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {course.instructor} · {course.credits} credits
                            {course.lectureTime &&
                              ` · ${course.lectureTime.day} ${course.lectureTime.start}–${course.lectureTime.end}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            className={
                              course.enrollmentStatus === "active"
                                ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            }
                          >
                            {course.enrollmentStatus}
                          </Badge>
                          {course.grade && (
                            <GradeLetterBadge grade={course.grade.letterGrade} />
                          )}
                          {course.payment && (
                            <PaymentStatusBadge status={course.payment.status} />
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-xs">
                        {/* Attendance */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5">
                          <p className="text-gray-500 dark:text-gray-400 mb-1">Attendance</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {course.attendance.rate}%
                          </p>
                          <p className="text-gray-400 dark:text-gray-500">
                            {course.attendance.present}/{course.attendance.total} sessions
                          </p>
                        </div>

                        {/* Grade breakdown */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5">
                          <p className="text-gray-500 dark:text-gray-400 mb-1">Grade</p>
                          {course.grade ? (
                            <>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {course.grade.total}/100
                              </p>
                              <p className="text-gray-400 dark:text-gray-500">
                                GPA: {course.grade.gradePoints.toFixed(1)}
                              </p>
                            </>
                          ) : (
                            <p className="text-gray-400 dark:text-gray-500 italic">Not graded</p>
                          )}
                        </div>

                        {/* Payment */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5">
                          <p className="text-gray-500 dark:text-gray-400 mb-1">Payment</p>
                          {course.payment ? (
                            <>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                ${course.payment.amount.toLocaleString()}
                              </p>
                              <p className="text-gray-400 dark:text-gray-500">
                                Due {course.payment.dueDate}
                              </p>
                            </>
                          ) : (
                            <p className="text-gray-400 dark:text-gray-500 italic">No payment</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ── Payments ── */}
            <TabsContent value="payments" className="mt-4 space-y-4">
              {/* Summary row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Transactions</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {detail.payments.length}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Paid</p>
                  <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                    ${detail.stats.totalPaid.toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Outstanding</p>
                  <p className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                    ${detail.stats.totalDue.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Payment list */}
              {detail.payments.length === 0 ? (
                <div className="py-12 text-center">
                  <BarChart2 className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No payment records found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {detail.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center shrink-0">
                          <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.courseTitle}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            <span>Due: {payment.dueDate}</span>
                            {payment.method && <span>· {payment.method}</span>}
                            {payment.transactionId && (
                              <span className="font-mono">{payment.transactionId}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          ${payment.amount.toLocaleString()}
                        </p>
                        <div className="mt-1">
                          <PaymentStatusBadge status={payment.status} />
                        </div>
                        {payment.paidAt && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Paid {formatDate(payment.paidAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
