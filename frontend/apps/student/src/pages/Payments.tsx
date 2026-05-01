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
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "_core/components/ui/table";

export default function StudentPayments() {
  const paymentSummary = {
    totalFee: 5000,
    paid: 3800,
    outstanding: 1200,
    nextDueDate: "March 15, 2026",
    nextAmount: 600,
  };

  const installments = [
    {
      id: 1,
      dueDate: "2025-09-15",
      amount: 1250,
      status: "Paid",
      paidDate: "2025-09-12",
      method: "Credit Card",
    },
    {
      id: 2,
      dueDate: "2025-11-15",
      amount: 1250,
      status: "Paid",
      paidDate: "2025-11-10",
      method: "Bank Transfer",
    },
    {
      id: 3,
      dueDate: "2026-01-15",
      amount: 1300,
      status: "Paid",
      paidDate: "2026-01-14",
      method: "Credit Card",
    },
    {
      id: 4,
      dueDate: "2026-03-15",
      amount: 600,
      status: "Pending",
      paidDate: null,
      method: null,
    },
    {
      id: 5,
      dueDate: "2026-05-15",
      amount: 600,
      status: "Upcoming",
      paidDate: null,
      method: null,
    },
  ];

  const paymentHistory = [
    {
      id: "PAY-2025-001",
      date: "2025-09-12",
      description: "Tuition Fee - Fall 2025",
      amount: 1250,
      method: "Credit Card",
      status: "Completed",
    },
    {
      id: "PAY-2025-002",
      date: "2025-11-10",
      description: "Tuition Fee - Fall 2025",
      amount: 1250,
      method: "Bank Transfer",
      status: "Completed",
    },
    {
      id: "PAY-2026-001",
      date: "2026-01-14",
      description: "Tuition Fee - Spring 2026",
      amount: 1300,
      method: "Credit Card",
      status: "Completed",
    },
  ];

  const feeBreakdown = [
    { category: "Tuition Fee", amount: 4200 },
    { category: "Lab Fees", amount: 400 },
    { category: "Library Fee", amount: 150 },
    { category: "Technology Fee", amount: 150 },
    { category: "Activity Fee", amount: 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">Payment Management</h3>
          <p className="text-sm text-gray-500">
            Track tuition fees and payment history
          </p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <CreditCard className="w-4 h-4" />
          Make Payment
        </Button>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Fee</p>
                <p className="text-2xl">
                  ${paymentSummary.totalFee.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="text-2xl">
                  ${paymentSummary.paid.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Outstanding</p>
                <p className="text-2xl">
                  ${paymentSummary.outstanding.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Payment</p>
                <p className="text-xl">${paymentSummary.nextAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Total Payment Progress
                </span>
                <span className="text-sm font-medium">
                  ${paymentSummary.paid.toLocaleString()} / $
                  {paymentSummary.totalFee.toLocaleString()} (
                  {(
                    (paymentSummary.paid / paymentSummary.totalFee) *
                    100
                  ).toFixed(1)}
                  %)
                </span>
              </div>
              <Progress
                value={(paymentSummary.paid / paymentSummary.totalFee) * 100}
                className="h-3"
              />
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-900">
                    Next Payment Due
                  </p>
                  <p className="text-sm text-orange-700">
                    ${paymentSummary.nextAmount} due on{" "}
                    {paymentSummary.nextDueDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Installment Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Installment Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {installments.map((installment) => (
                <div
                  key={installment.id}
                  className={`p-4 border rounded-lg ${
                    installment.status === "Paid"
                      ? "bg-green-50 border-green-200"
                      : installment.status === "Pending"
                        ? "bg-orange-50 border-orange-200"
                        : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">
                        Installment {installment.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        Due:{" "}
                        {new Date(installment.dueDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </p>
                    </div>
                    <Badge
                      className={
                        installment.status === "Paid"
                          ? "bg-green-600"
                          : installment.status === "Pending"
                            ? "bg-orange-600"
                            : "bg-gray-400"
                      }
                    >
                      {installment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">
                      ${installment.amount}
                    </span>
                    {installment.paidDate && (
                      <span className="text-xs text-gray-500">
                        Paid:{" "}
                        {new Date(installment.paidDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fee Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feeBreakdown.map((fee, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between pb-4 border-b last:border-0"
                >
                  <span className="text-sm text-gray-700">{fee.category}</span>
                  <span className="font-medium">${fee.amount}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-4 border-t-2">
                <span className="font-medium">Total</span>
                <span className="text-xl font-medium">
                  ${paymentSummary.totalFee.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment History</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download Receipt
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">
                    {payment.id}
                  </TableCell>
                  <TableCell>
                    {new Date(payment.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell className="font-medium">
                    ${payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700">
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
