import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "_core/components/ui/card";
import { Button } from "_core/components/ui/button";
import { Badge } from "_core/components/ui/badge";
import { Progress } from "_core/components/ui/progress";
import {
  DollarSign,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "_core/components/ui/table";
import { useMyPayments } from "../hooks/usePayments";
import CheckoutModal from "../components/CheckoutModal";
import type { Payment } from "../types/payment.types";

function statusBadge(status: Payment["status"]) {
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

function statusIcon(status: Payment["status"]) {
  if (status === "paid")
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === "overdue")
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  return <Clock className="w-4 h-4 text-orange-500" />;
}

function cardBg(status: Payment["status"]) {
  if (status === "paid")
    return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
  if (status === "overdue")
    return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900";
  return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
}

function StatCard({
  icon,
  color,
  label,
  value,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={`${color} w-12 h-12 rounded-lg flex items-center justify-center`}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            <p className="text-2xl">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentPayments() {
  const { data, isLoading } = useMyPayments();
  const [activePayment, setActivePayment] = useState<Payment | null>(null);

  const payments = data?.payments ?? [];
  const totalFee = data?.totalFee ?? 0;
  const totalPaid = data?.totalPaid ?? 0;
  const totalOutstanding = data?.totalOutstanding ?? 0;
  const progressPct = totalFee > 0 ? (totalPaid / totalFee) * 100 : 0;

  const paidPayments = payments.filter((p) => p.status === "paid");
  const unpaidPayments = payments.filter((p) => p.status !== "paid");
  const nextDue = unpaidPayments[0] ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Payment Management</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track tuition fees and payment history
          </p>
        </div>
        {nextDue && (
          <Button
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setActivePayment(nextDue)}
          >
            <CreditCard className="w-4 h-4" />
            Pay Next Due
          </Button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          label="Total Fee"
          value={isLoading ? "—" : `$${totalFee.toLocaleString()}`}
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          color="bg-green-500"
          label="Amount Paid"
          value={isLoading ? "—" : `$${totalPaid.toLocaleString()}`}
        />
        <StatCard
          icon={<AlertCircle className="w-6 h-6 text-white" />}
          color="bg-orange-500"
          label="Outstanding"
          value={isLoading ? "—" : `$${totalOutstanding.toLocaleString()}`}
        />
      </div>

      {/* Progress + next due alert */}
      {!isLoading && totalFee > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Progress
                </span>
                <span className="font-medium">
                  ${totalPaid.toLocaleString()} / ${totalFee.toLocaleString()} (
                  {progressPct.toFixed(1)}%)
                </span>
              </div>
              <Progress value={progressPct} className="h-3" />
            </div>

            {nextDue && (
              <div
                className={`p-4 rounded-lg border flex items-start gap-3 ${
                  nextDue.status === "overdue"
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900"
                    : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                }`}
              >
                <AlertCircle
                  className={`w-5 h-5 mt-0.5 ${
                    nextDue.status === "overdue"
                      ? "text-red-600"
                      : "text-orange-600"
                  }`}
                />
                <div>
                  <p
                    className={`text-sm font-medium ${
                      nextDue.status === "overdue"
                        ? "text-red-900"
                        : "text-orange-900"
                    }`}
                  >
                    {nextDue.status === "overdue"
                      ? "Overdue Payment"
                      : "Next Payment Due"}
                  </p>
                  <p
                    className={`text-sm ${
                      nextDue.status === "overdue"
                        ? "text-red-700"
                        : "text-orange-700"
                    }`}
                  >
                    ${nextDue.amount.toLocaleString()} — {nextDue.courseName} —
                    due{" "}
                    {new Date(nextDue.dueDate + "T00:00:00").toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="ml-auto shrink-0 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setActivePayment(nextDue)}
                >
                  Pay Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Per-course payment cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : payments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-400 dark:text-gray-500">
            No payment records found. Enroll in a course to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {payments.map((payment) => (
            <Card
              key={payment.id}
              className={`border ${cardBg(payment.status)}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {statusIcon(payment.status)}
                    <div>
                      <p className="font-medium text-sm">
                        {payment.courseName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {payment.description}
                      </p>
                    </div>
                  </div>
                  {statusBadge(payment.status)}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold">
                      ${payment.amount.toLocaleString()}
                    </p>
                    {payment.status === "paid" ? (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Paid{" "}
                        {new Date(payment.paidAt!).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        · {payment.method?.replace("_", " ")}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Due{" "}
                        {new Date(
                          payment.dueDate + "T00:00:00",
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                  {payment.status !== "paid" && (
                    <Button
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => setActivePayment(payment)}
                    >
                      Pay Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payment history table */}
      {paidPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paidPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs">
                      {payment.transactionId}
                    </TableCell>
                    <TableCell>
                      {new Date(payment.paidAt!).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell className="capitalize">
                      {payment.method?.replace("_", " ") ?? "—"}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700">
                        Completed
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activePayment && (
        <CheckoutModal
          payment={activePayment}
          onClose={() => setActivePayment(null)}
        />
      )}
    </div>
  );
}
