import { useState } from "react";
import {
  X,
  CreditCard,
  CheckCircle,
  Landmark,
  Banknote,
  Globe,
} from "lucide-react";
import type { Payment, PaymentMethod } from "../types/payment.types.js";
import { usePayInstallment } from "../hooks/usePayments.js";

const METHODS: {
  id: PaymentMethod;
  label: string;
  icon: React.ElementType;
  desc: string;
}[] = [
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    icon: Landmark,
    desc: "Transfer from your bank account",
  },
  {
    id: "online",
    label: "Online Payment",
    icon: Globe,
    desc: "Pay via online portal",
  },
  {
    id: "cash",
    label: "Cash Payment",
    icon: Banknote,
    desc: "Pay at the finance office",
  },
];

export default function CheckoutModal({
  payment,
  onClose,
}: {
  payment: Payment;
  onClose: () => void;
}) {
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod>("bank_transfer");
  const [result, setResult] = useState<{
    transactionId: string;
    paidAt: string;
  } | null>(null);

  const { mutateAsync: pay, isPending } = usePayInstallment();

  const handlePay = async () => {
    const res = await pay({ paymentId: payment.id, method: selectedMethod });
    setResult({ transactionId: res.transactionId, paidAt: res.paidAt });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Make Payment</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {result ? (
            /* Success state */
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-500 mb-6">
                Your payment of{" "}
                <span className="font-semibold text-gray-800">
                  ${payment.amount.toLocaleString()}
                </span>{" "}
                has been recorded.
              </p>

              <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-mono text-gray-700 text-xs">
                    {result.transactionId}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span className="text-gray-700">
                    {new Date(result.paidAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-semibold text-green-600">
                    ${payment.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Method</span>
                  <span className="text-gray-700 capitalize">
                    {selectedMethod.replace("_", " ")}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold text-white transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Amount summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Amount Due
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ${payment.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {payment.description}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Due:{" "}
                  {new Date(payment.dueDate + "T00:00:00").toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>

              {/* Method selector */}
              <p className="text-sm font-medium text-gray-700 mb-3">
                Select Payment Method
              </p>
              <div className="space-y-2 mb-6">
                {METHODS.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedMethod(id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-colors ${
                      selectedMethod === id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        selectedMethod === id ? "bg-indigo-600" : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${selectedMethod === id ? "text-white" : "text-gray-500"}`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {label}
                      </p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    {selectedMethod === id && (
                      <div className="ml-auto w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={isPending}
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 rounded-lg text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>Confirm Payment</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
