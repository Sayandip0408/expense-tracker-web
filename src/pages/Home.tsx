import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import {
  ArrowDownCircle, ArrowUpCircle, BarChart3, History as HistoryIcon, Wallet, ChevronRight
} from 'lucide-react'
import { collection, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.js'
import { CATEGORY_ICONS, currency, formatDate, toDate } from '../utils/format.js'
import Loader from '../components/Loader.js'
import TransactionDetailModal from '../components/TransactionDetailModal.js'
import type { Expense, TransactionType } from '../types'
import type { LucideIcon } from 'lucide-react'

export default function Home() {
  const { user, userDoc } = useAuth()
  const [creditSum, setCreditSum] = useState(0)
  const [debitSum, setDebitSum] = useState(0)
  const [recent, setRecent] = useState<Expense[] | null>(null)
  const [selected, setSelected] = useState<Expense | null>(null)
  const { openModal } = useOutletContext<{ openModal: (t: TransactionType) => void }>()

  useEffect(() => {
    if (!user?.email) return
    const d = new Date(); d.setDate(d.getDate() - 30)
    const q = query(collection(db, 'expenses'), where('owner', '==', user.email), where('transaction_date', '>=', Timestamp.fromDate(d)))
    return onSnapshot(q, s => {
      let c = 0, b = 0
      s.docs.forEach(x => { const t = x.data(); if (t.type === 'Credit') c += t.amount; else b += t.amount })
      setCreditSum(c); setDebitSum(b)
    })
  }, [user?.email])

  useEffect(() => {
    if (!user?.email) return
    const q = query(collection(db, 'expenses'), where('owner', '==', user.email), orderBy('transaction_date', 'desc'))
    return onSnapshot(q, s => setRecent(s.docs.slice(0, 5).map(d => ({ id: d.id, ...d.data() as Omit<Expense, 'id'> }))))
  }, [user?.email])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-5 sm:px-6 lg:px-8 py-6">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {userDoc?.dp ? <img src={userDoc.dp} className="h-14 w-14 rounded-2xl object-cover" /> : <div className="h-14 w-14 rounded-2xl bg-emerald-200" />}
          <div>
            <p className="text-sm text-gray-500">Welcome back 👋</p>
            <h1 className="text-2xl font-black text-gray-900">{userDoc?.name ?? 'Loading...'}</h1>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-700 to-teal-600 p-7 text-white shadow-2xl">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="flex items-center gap-2 text-white/80"><Wallet size={18} /><span>Total Balance</span></div>
        <h2 className="mt-3 break-all text-3xl font-black leading-tight sm:mt-4 sm:text-5xl">
          {userDoc ? currency(userDoc.balance) : "..."}
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Mini label="Income" value={currency(creditSum)} green />
          <Mini label="Expense" value={currency(debitSum)} />
        </div>
      </section>

      <section className="mt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Action
            icon={ArrowDownCircle}
            title="Deposit"
            bg="from-emerald-500 to-green-600"
            onClick={() => openModal("Credit")}
          />

          <Action
            icon={ArrowUpCircle}
            title="Expense"
            bg="from-rose-500 to-red-600"
            onClick={() => openModal("Debit")}
          />

          <Action
            icon={HistoryIcon}
            title="History"
            bg="from-amber-500 to-orange-500"
            href="/history"
          />

          <Action
            icon={BarChart3}
            title="Reports"
            bg="from-sky-500 to-indigo-600"
            href="/reports"
          />
        </div>
      </section>

      <section className="mt-8 rounded-[28px] bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">Recent Transactions</h3>
          <Link to="/history" className="flex items-center gap-1 text-emerald-600 font-semibold text-sm">View All<ChevronRight size={16} /></Link>
        </div>
        {recent === null && <Loader />}
        {recent?.length === 0 && <div className="py-16 text-center"><div className="text-5xl">🧾</div><p className="mt-4 text-gray-500">No transactions yet</p></div>}
        <div className="space-y-4">
          {recent?.map((e) => {
            const Icon = CATEGORY_ICONS[e.category] ?? CATEGORY_ICONS.Others;
            const debit = e.type === "Debit";

            return (
              <button
                key={e.id}
                onClick={() => setSelected(e)}
                className="group flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-md sm:gap-4 sm:p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:h-14 sm:w-14 sm:rounded-2xl">
                  <Icon size={20} className="sm:h-6 sm:w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-semibold text-slate-800 sm:text-base">
                    {e.product || "Unnamed Product"}
                  </h4>

                  <p className="truncate text-xs text-slate-500 sm:text-sm">
                    {e.category} • {formatDate(toDate(e.transaction_date))}
                  </p>
                </div>

                <div className={`shrink-0 text-right text-base font-bold sm:text-lg ${debit ? "text-rose-500" : "text-emerald-600"}`}>
                  {debit ? "-" : "+"}
                  {currency(e.amount)}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {selected && <TransactionDetailModal expense={selected} onClose={() => setSelected(null)} />}
    </div>)
}

function Mini({ label, value, green, }: { label: string; value: string; green?: boolean; }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 sm:p-4 backdrop-blur">
      <div className="text-xs text-white/70 sm:text-sm">
        {label}
      </div>

      <div className={"mt-1 break-all text-lg font-bold leading-tight sm:mt-2 sm:text-2xl " + (green ? "text-green-200" : "text-red-200")}>
        {value}
      </div>
    </div>
  );
}

function Action({
  icon: Icon,
  title,
  bg,
  onClick,
  href,
}: {
  icon: LucideIcon;
  title: string;
  bg: string;
  onClick?: () => void;
  href?: string;
}) {
  const content = (
    <>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${bg} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon size={22} strokeWidth={2.3} />
      </div>

      <span className="mt-3 text-sm font-semibold text-slate-700">
        {title}
      </span>
    </>
  );

  const className =
    "group flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white/80 p-4 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl active:scale-95";

  if (href) {
    return (
      <Link to={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}