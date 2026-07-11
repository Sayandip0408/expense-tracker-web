import { X, ReceiptText } from "lucide-react";
import {
  CATEGORY_ICONS,
  currency,
  formatDate,
  toDate,
} from "../utils/format";
import type { Expense } from "../types";

export default function TransactionDetailModal({
  expense,
  onClose,
}: {
  expense: Expense | null;
  onClose: () => void;
}) {
  if (!expense) return null;

  const debit = expense.type === "Debit";
  const Icon = CATEGORY_ICONS[expense.category] ?? CATEGORY_ICONS.Others;
  const grad = debit ? "from-red-600 to-rose-500" : "from-emerald-700 to-teal-600";

  return (
    <div className="fixed top-0 inset-0 z-50 flex items-end justify-center bg-black/50 p-2 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        <div className={`bg-linear-to-r ${grad} p-5 text-white sm:p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ReceiptText size={22} />
              <h2 className="text-xl font-black sm:text-2xl">
                Transaction
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl bg-white/15 p-2 transition hover:bg-white/25"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3 sm:mt-6 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 sm:h-16 sm:w-16 sm:rounded-2xl">
              <Icon size={24} className="sm:h-8 sm:w-8" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-white/75">
                {debit ? "Paid For" : "Received As"}
              </p>

              <h3 className="truncate text-lg font-bold sm:text-xl">
                {expense.category}
              </h3>
            </div>

            <div className="text-right">
              <div className="break-all text-[clamp(1.2rem,5vw,2rem)] font-black leading-tight">
                {currency(expense.amount)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:space-y-4 sm:p-6">
          {[
            ["Transaction ID", expense.id || "—"],
            ["Product", expense.product || "—"],
            ["Date", formatDate(toDate(expense.transaction_date))],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:p-4"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {label}
              </div>

              <div className="mt-1 break-all text-sm font-semibold text-slate-800 sm:mt-2 sm:text-base">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}