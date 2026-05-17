import { useNavigate } from "react-router";
import {
  BookOpen,
  ClipboardCheck,
  Award,
  DollarSign,
  AlertCircle,
  Calendar,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { Button } from "_core/components/ui/button";
import { Badge } from "_core/components/ui/badge";
import { useProfile } from "../hooks/useProfile.js";
import { useEnrolledCourses } from "../hooks/useCourses.js";
import { useMyPayments } from "../hooks/usePayments.js";

function gradeColor(letter: string | null) {
  if (!letter)
    return "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400";
  if (letter.startsWith("A"))
    return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400";
  if (letter.startsWith("B"))
    return "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400";
  if (letter.startsWith("C"))
    return "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400";
  return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400";
}

function paymentStatusColor(status: string) {
  if (status === "paid")
    return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400";
  if (status === "overdue")
    return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400";
  return "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400";
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
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4 shadow-sm">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-700 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-20" />
          <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const navigate = useNavigate();

  const {
    data: profile,
    isLoading: loadingProfile,
    isError: errorProfile,
  } = useProfile();
  const { data: enrolled, isLoading: loadingEnrolled } = useEnrolledCourses();
  const { data: payments, isLoading: loadingPayments } = useMyPayments();

  const overdueCount = (payments?.payments ?? []).filter(
    (p) => p.status === "overdue",
  ).length;
  const pendingPayments = (payments?.payments ?? []).filter(
    (p) => p.status !== "paid",
  );
  const paidRatio =
    payments && payments.totalFee > 0
      ? Math.round((payments.totalPaid / payments.totalFee) * 100)
      : 0;

  if (errorProfile) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/30 p-8 text-center shadow-sm">
        <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          Failed to load dashboard
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Please refresh the page
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {loadingProfile ? (
            <span className="inline-block h-7 w-48 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            `Welcome, ${profile?.name?.split(" ")[0] ?? "Student"}`
          )}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Here's an overview of your academic progress
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingProfile ? (
          [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={BookOpen}
              label="Enrolled Courses"
              value={String(profile?.stats.enrolledCourses ?? 0)}
              color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            />
            <StatCard
              icon={Award}
              label="Average Grade"
              value={
                profile?.stats.averageGrade !== null &&
                profile?.stats.averageGrade !== undefined
                  ? String(profile.stats.averageGrade)
                  : "—"
              }
              color="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
            />
            <StatCard
              icon={ClipboardCheck}
              label="Attendance Rate"
              value={`${profile?.stats.attendanceRate ?? 0}%`}
              color="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
            />
            <StatCard
              icon={DollarSign}
              label="Outstanding"
              value={`$${(payments?.totalOutstanding ?? 0).toLocaleString()}`}
              sub={overdueCount > 0 ? `${overdueCount} overdue` : undefined}
              color={
                overdueCount > 0
                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  : "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
              }
            />
          </>
        )}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrolled courses */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Enrolled Courses
            </h2>
            <button
              onClick={() => navigate("/courses")}
              className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              View all
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loadingEnrolled && (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="px-6 py-4 animate-pulse flex items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-14" />
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                  <div className="h-6 w-14 bg-gray-100 dark:bg-gray-700 rounded-full shrink-0" />
                </div>
              ))}
            </div>
          )}

          {!loadingEnrolled && (enrolled ?? []).length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No enrolled courses yet
              </p>
              <Button
                size="sm"
                className="mt-3 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate("/courses?tab=available")}
              >
                Browse courses
              </Button>
            </div>
          )}

          {!loadingEnrolled && enrolled && enrolled.length > 0 && (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {enrolled.slice(0, 5).map((course) => (
                <div
                  key={course.enrollmentId}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full">
                        {course.department?.code ?? "—"}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {course.lectureTime?.day} {course.lectureTime?.start}–
                      {course.lectureTime?.end}
                    </p>
                  </div>
                  <Badge
                    className={`shrink-0 text-xs ${gradeColor(course.grade?.letterGrade ?? null)}`}
                  >
                    {course.grade?.letterGrade ?? "Enrolled"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment summary */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-500" />
              Payments
            </h2>
            <button
              onClick={() => navigate("/payments")}
              className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              View all
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loadingPayments && (
            <div className="p-6 space-y-4 animate-pulse">
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full" />
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-full" />
              <div className="space-y-3 mt-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {!loadingPayments && (
            <div className="p-6 space-y-5">
              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span>
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      ${(payments?.totalPaid ?? 0).toLocaleString()}
                    </span>{" "}
                    paid
                  </span>
                  <span>
                    ${(payments?.totalFee ?? 0).toLocaleString()} total
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${paidRatio}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
                  {paidRatio}% paid
                </p>
              </div>

              {/* Outstanding/overdue summary */}
              {(payments?.totalOutstanding ?? 0) > 0 && (
                <div
                  className={`rounded-xl px-4 py-3 text-xs ${
                    overdueCount > 0
                      ? "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400"
                      : "bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400"
                  }`}
                >
                  {overdueCount > 0
                    ? `${overdueCount} payment${overdueCount > 1 ? "s" : ""} overdue — $${payments!.totalOutstanding.toLocaleString()} due`
                    : `$${payments!.totalOutstanding.toLocaleString()} outstanding`}
                </div>
              )}

              {/* Pending payment list */}
              {pendingPayments.length === 0 ? (
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-2">
                  All payments up to date
                </p>
              ) : (
                <div className="space-y-2">
                  {pendingPayments.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 dark:bg-gray-800 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                          {p.courseName}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Due{" "}
                          {new Date(p.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                          ${p.amount.toLocaleString()}
                        </span>
                        <Badge
                          className={`text-xs ${paymentStatusColor(p.status)}`}
                        >
                          {p.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate("/payments")}
              >
                Manage Payments
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
