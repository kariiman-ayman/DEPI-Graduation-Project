import { Badge } from "_core/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { Input } from "_core/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "_core/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "_core/components/ui/table";
import { AlertCircle, Clock, DollarSign, Search, Users } from "lucide-react";
import { useState } from "react";
import type { AdminPayment, PaymentStatus } from "../api/payments";
import { useAllPayments } from "../hooks/usePayments";

function statusBadge(status: PaymentStatus) {
  if (status === "paid")
    return (
      <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700">
        Paid
      </Badge>
    );
  if (status === "overdue")
    return (
      <Badge className="bg-red-100 dark:bg-red-900/20 text-red-700">
        Overdue
      </Badge>
    );
  return (
    <Badge className="bg-orange-100 dark:bg-orange-900/20 text-orange-700">
      Pending
    </Badge>
  );
}

function StatCard({
  icon,
  color,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={`${color} w-12 h-12 rounded-lg flex items-center justify-center shrink-0`}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-semibold">{value}</p>
            {sub && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {sub}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPayments() {
  const { data, isLoading } = useAllPayments();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>(
    "all",
  );

  const payments: AdminPayment[] = data?.payments ?? [];

  const filtered = payments.filter((p) => {
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.studentName.toLowerCase().includes(q) ||
      p.studentEmail.toLowerCase().includes(q) ||
      p.courseName.toLowerCase().includes(q) ||
      (p.transactionId ?? "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalCollected = data?.totalCollected ?? 0;
  const totalOutstanding = data?.totalOutstanding ?? 0;
  const totalOverdue = data?.totalOverdue ?? 0;
  const totalStudents = data?.totalStudents ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl">Payments</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of all student tuition payments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-green-500"
          label="Total Collected"
          value={isLoading ? "—" : `$${totalCollected.toLocaleString()}`}
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          label="Outstanding"
          value={isLoading ? "—" : `$${totalOutstanding.toLocaleString()}`}
        />
        <StatCard
          icon={<AlertCircle className="w-6 h-6 text-white" />}
          color="bg-red-500"
          label="Overdue"
          value={isLoading ? "—" : `$${totalOverdue.toLocaleString()}`}
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-indigo-500"
          label="Students with Fees"
          value={isLoading ? "—" : `${totalStudents}`}
          sub={`${payments.filter((p) => p.status === "paid").length} paid of ${payments.length} total`}
        />
      </div>

      {/* Collection rate bar */}
      {!isLoading && totalCollected + totalOutstanding + totalOverdue > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Collection Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const grand = totalCollected + totalOutstanding + totalOverdue;
              const paidPct = (totalCollected / grand) * 100;
              const pendingPct = (totalOutstanding / grand) * 100;
              const overduePct = (totalOverdue / grand) * 100;
              return (
                <div className="space-y-4">
                  <div className="flex h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 transition-all"
                      style={{ width: `${paidPct}%` }}
                      title={`Collected ${paidPct.toFixed(1)}%`}
                    />
                    <div
                      className="bg-orange-400 transition-all"
                      style={{ width: `${pendingPct}%` }}
                      title={`Pending ${pendingPct.toFixed(1)}%`}
                    />
                    <div
                      className="bg-red-500 transition-all"
                      style={{ width: `${overduePct}%` }}
                      title={`Overdue ${overduePct.toFixed(1)}%`}
                    />
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-green-500" />
                      Collected ({paidPct.toFixed(1)}%)
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-orange-400" />
                      Pending ({pendingPct.toFixed(1)}%)
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-red-500" />
                      Overdue ({overduePct.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search student, course, or transaction…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-12">
              No payments match your filter.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Transaction ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{p.studentName}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {p.studentEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{p.courseName}</p>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${p.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{statusBadge(p.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(p.dueDate + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {p.paidAt
                        ? new Date(p.paidAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm capitalize text-gray-600 dark:text-gray-400">
                      {p.method ? p.method.replace("_", " ") : "—"}
                    </TableCell>
                    <TableCell>
                      {p.transactionId ? (
                        <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                          {p.transactionId}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          —
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && filtered.length > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
              Showing {filtered.length} of {payments.length} records
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
