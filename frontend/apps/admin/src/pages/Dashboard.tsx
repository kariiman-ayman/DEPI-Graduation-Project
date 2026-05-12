import {
  Users,
  BookOpen,
  DollarSign,
  UserCheck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";

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

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconBg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  iconBg: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-3 animate-pulse">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isError) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/30 p-8 text-center shadow-sm max-w-lg">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <p className="font-semibold text-gray-900 dark:text-white">Failed to load dashboard</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {error instanceof Error ? error.message : "An unexpected error occurred."}
        </p>
      </div>
    );
  }

  const stats = data?.stats;
  const recentStudents = data?.recentStudents ?? [];
  const coursesByDept = data?.coursesByDepartment ?? [];

  const totalPayments = stats
    ? stats.totalCollected + stats.totalOutstanding + stats.totalOverdue
    : 0;
  const collectedPct = totalPayments > 0 ? (stats!.totalCollected / totalPayments) * 100 : 0;

  const DEPT_COLORS = [
    "bg-indigo-500",
    "bg-blue-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-sky-500",
    "bg-cyan-500",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Platform overview — real-time data
        </p>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={Users}
              label="Total Students"
              value={stats!.totalStudents.toLocaleString()}
              iconBg="bg-indigo-500"
            />
            <StatCard
              icon={UserCheck}
              label="Total Instructors"
              value={stats!.totalInstructors.toLocaleString()}
              iconBg="bg-purple-500"
            />
            <StatCard
              icon={BookOpen}
              label="Total Courses"
              value={stats!.totalCourses.toLocaleString()}
              iconBg="bg-blue-500"
            />
            <StatCard
              icon={DollarSign}
              label="Revenue Collected"
              value={`$${stats!.totalCollected.toLocaleString()}`}
              sub={
                stats!.totalOverdue > 0
                  ? `$${stats!.totalOverdue.toLocaleString()} overdue`
                  : "No overdue payments"
              }
              iconBg="bg-emerald-500"
            />
          </>
        )}
      </div>

      {/* ── Middle row: payment overview + recent students ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Payment Overview */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-5">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Payment Overview
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Collected</p>
                  <p className="text-base font-bold text-green-600 dark:text-green-400">
                    ${stats!.totalCollected.toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 text-center">
                  <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Outstanding</p>
                  <p className="text-base font-bold text-orange-600 dark:text-orange-400">
                    ${stats!.totalOutstanding.toLocaleString()}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 text-center">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Overdue</p>
                  <p className="text-base font-bold text-red-600 dark:text-red-400">
                    ${stats!.totalOverdue.toLocaleString()}
                  </p>
                </div>
              </div>

              {totalPayments > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Collection rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.round(collectedPct)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${collectedPct}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Recent Students */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
            <Users className="w-4 h-4 text-indigo-500" />
            Recent Students
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-2.5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentStudents.length === 0 ? (
            <div className="py-8 text-center">
              <Users className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400 dark:text-gray-500">No students yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentStudents.map((student, i) => (
                <div
                  key={student.id}
                  className={`flex items-center justify-between ${
                    i < recentStudents.length - 1
                      ? "pb-4 border-b border-gray-100 dark:border-gray-800"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                        {getInitials(student.name)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.name ?? (
                          <span className="text-gray-400 italic">No name</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{student.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3" />
                    {formatDate(student.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Courses by Department ──────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
          <BookOpen className="w-4 h-4 text-blue-500" />
          Courses by Department
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : coursesByDept.length === 0 ? (
          <div className="py-8 text-center">
            <BookOpen className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-400 dark:text-gray-500">No courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {coursesByDept.map((dept, i) => (
              <div
                key={dept.departmentId}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    DEPT_COLORS[i % DEPT_COLORS.length]
                  }`}
                >
                  <span className="text-white text-xs font-bold">{dept.departmentCode}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {dept.departmentName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {dept.courseCount} course{dept.courseCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
