import { useState, type SubmitEvent } from "react";
import { X, Wallet, ReceiptText, CalendarDays, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { addDoc, collection, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { useAuth } from "../context/AuthContext.js";
import { CATEGORIES } from "../utils/format.js";
import type { Category, TransactionType } from "../types.js";

interface Props {
  defaultType?: TransactionType;
  lockType?: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function TransactionModal({
  defaultType = "Debit",
  lockType = false,
  onClose,
  onSaved,
}: Props) {
  const { user, userDoc, userDocId } = useAuth();

  const [type, setType] = useState<TransactionType>(defaultType);
  const [category, setCategory] = useState<Category>("Food");
  const [amount, setAmount] = useState("");
  const [product, setProduct] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const debit = type === "Debit";
  const grad = debit ? "from-rose-600 via-red-500 to-orange-500" : "from-emerald-700 via-emerald-600 to-teal-500";

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError("");
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return setError("Please enter a valid amount.");
    if (!product.trim()) return setError("Please enter a description.");
    setSaving(true);
    try {
      const now = new Date();
      const tx = new Date(date);
      tx.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

      const ref = await addDoc(collection(db, "expenses"), {
        type, category, amount: value, product: product.trim(),
        transaction_date: Timestamp.fromDate(tx),
        owner: user?.email ?? "",
        created_at: serverTimestamp(),
      });
      await updateDoc(ref, { id: ref.id });
      if (userDocId) {
        const bal = userDoc?.balance ?? 0;
        await updateDoc(doc(db, "users", userDocId), {
          balance: debit ? bal - value : bal + value,
        });
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save transaction.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-md sm:items-center">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">

        <div className={"relative overflow-hidden bg-linear-to-br " + grad + " px-5 pt-5 pb-6 sm:px-6 sm:pt-7 sm:pb-8 text-white"}>
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
          <div className="mx-auto flex h-12 sm:h-14 w-14 sm:w-16 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
            <Wallet size={26} className="sm:h-8 sm:w-8" />
          </div>

          <h2 className="mt-4 text-center text-2xl font-black sm:text-3xl">
            {debit ? "Add Expense" : "Add Income"}
          </h2>
          <p className="mt-1 text-center text-sm text-white/80">
            Track every transaction effortlessly
          </p>

          {!lockType && (
            <div className="mt-5 grid grid-cols-2 rounded-2xl bg-white/10 p-1 backdrop-blur">
              <button type="button" onClick={() => setType("Debit")}
                className={"flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition " + (type === "Debit" ? "bg-white text-red-600 shadow" : "text-white")}>
                <ArrowUpCircle size={18} />Expense
              </button>
              <button type="button" onClick={() => setType("Credit")}
                className={"flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition " + (type === "Credit" ? "bg-white text-emerald-700 shadow" : "text-white")}>
                <ArrowDownCircle size={18} />Income
              </button>
            </div>
          )}

          <button onClick={onClose} className="absolute right-5 top-5 rounded-xl bg-white/15 p-2 hover:bg-white/25">
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6"
        >

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Amount</label>
            <div className="rounded-3xl border-2 border-emerald-100 bg-emerald-50 p-4 text-center sm:p-5">
              <div className="text-sm text-gray-500">Amount</div>
              <div className="mt-2 flex items-center justify-center">
                <span className="mr-1 text-2xl font-bold text-gray-500 sm:text-3xl">₹</span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full max-w-37.5 sm:max-w-45 bg-transparent text-center text-4xl sm:text-5xl font-black" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Category</label>
              <div className="relative">
                <select value={category} onChange={e => setCategory(e.target.value as Category)}
                  className="h-12 sm:h-14 w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-4 font-medium outline-none focus:border-emerald-500">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Date</label>
              <div className="relative">
                <CalendarDays className="absolute left-4 top-4 text-gray-400" size={18} />
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="h-12 sm:h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 outline-none focus:border-emerald-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Description</label>
            <div className="relative">
              <ReceiptText className="absolute left-4 top-4 text-gray-400" size={18} />
              <input value={product} onChange={e => setProduct(e.target.value)}
                placeholder="Dinner, Salary, Shopping..."
                className="h-12 sm:h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 outline-none focus:border-emerald-500" />
            </div>
          </div>

          {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">{error}</div>}

          <button disabled={saving}
            className={"h-12 sm:h-14 w-full rounded-2xl bg-linear-to-r " + grad + " text-base font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-60"}>
            {saving ? "Saving Transaction..." : "Save Transaction"}
          </button>

        </form>
      </div>
    </div>);
}
