import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { Search, SlidersHorizontal, X, CalendarDays, Receipt } from 'lucide-react'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.js'
import { CATEGORY_ICONS, currency, formatDate, toDate } from '../utils/format.js'
import Loader from '../components/Loader.js'
import TransactionDetailModal from '../components/TransactionDetailModal.js'
import type { Expense } from '../types'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'last7Days', label: 'Last 7 Days' },
  { id: 'lastWeek', label: 'Last Week' },
  { id: 'thisMonth', label: 'This Month' },
  { id: 'lastMonth', label: 'Last Month' },
  { id: 'thisYear', label: 'This Year' },
  { id: 'lastYear', label: 'Last Year' },
]

function filterRange(id: string) {
  const n = new Date()
  switch (id) {
    case 'last7Days': { const s = new Date(n); s.setDate(s.getDate() - 7); return [s, n] }
    case 'thisMonth': return [new Date(n.getFullYear(), n.getMonth(), 1), n]
    case 'lastMonth': return [new Date(n.getFullYear(), n.getMonth() - 1, 1), new Date(n.getFullYear(), n.getMonth(), 0, 23, 59, 59)]
    case 'thisYear': return [new Date(n.getFullYear(), 0, 1), n]
    case 'lastYear': return [new Date(n.getFullYear() - 1, 0, 1), new Date(n.getFullYear() - 1, 11, 31, 23, 59, 59)]
    case 'lastWeek': { const s = new Date(n); s.setDate(n.getDate() - n.getDay() - 6); const e = new Date(n); e.setDate(n.getDate() - n.getDay()); return [s, e] }
    default: return null
  }
}

export default function History() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filter, setFilter] = useState('all')
  const [searching, setSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selected, setSelected] = useState<Expense | null>(null)

  useEffect(() => {
    if (!user?.email) return
    return onSnapshot(query(collection(db, 'expenses'), where('owner', '==', user.email), orderBy('transaction_date', 'desc')), snap => {
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() as Omit<Expense, 'id'> })))
    })
  }, [user?.email])

  const filtered = useMemo(() => {
    let list = expenses
    const r = filterRange(filter)
    if (r) {
      const [s, e] = r
      list = list.filter(x => { const d = toDate(x.transaction_date); return d && d >= s && d <= e })
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(x => (x.product || '').toLowerCase().includes(q) || String(x.amount).includes(q))
    }
    return list
  }, [expenses, filter, searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-5 sm:px-6 lg:px-8 py-6">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Transactions</h1>
          <p className="mt-1 text-gray-500">Browse and search your transaction history.</p>
        </div>

        <div className="flex items-center gap-3">
          {searching ? (
            <div className="flex h-12 w-full sm:w-80 items-center rounded-2xl border bg-white px-4 shadow">
              <Search size={18} className="text-gray-400" />
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search product or amount..." className="ml-3 w-full bg-transparent outline-none" />
            </div>
          ) : null}

          <button onClick={() => { if (searching) setSearchQuery(''); setSearching(!searching) }} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-xl">
            {searching ? <X size={18} /> : <Search size={18} />}
          </button>

          <details className="relative">
            <summary className="flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-2xl bg-white shadow-lg">
              <SlidersHorizontal size={18} />
            </summary>
            <div className="absolute right-0 z-20 mt-3 w-52 rounded-2xl border bg-white p-2 shadow-2xl">
              {FILTERS.map(f => (
                <button key={f.id} onClick={e => { setFilter(f.id); e.currentTarget.closest('details')?.removeAttribute('open') }} className={"flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm transition " + (filter === f.id ? "bg-emerald-50 font-semibold text-emerald-700" : "hover:bg-gray-50")}>
                  <CalendarDays size={16} />{f.label}
                </button>
              ))}
            </div>
          </details>
        </div>
      </div>

      <div className="mb-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-2xl">
        <div className="text-sm text-white/80">Showing</div>
        <div className="mt-2 text-4xl font-black">{filtered.length}</div>
        <div className="text-white/80">{filtered.length == 1 ? "Transaction" : "Transactions"}</div>
      </div>

      {expenses === null && <Loader />}

      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-white py-20 text-center shadow-xl">
          <Receipt className="mx-auto h-14 w-14 text-emerald-500" />
          <h3 className="mt-5 text-xl font-bold">No Transactions Found</h3>
          <p className="mt-2 text-gray-500">{searchQuery ? "Try another keyword." : "Your transactions will appear here."}</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filtered.map((item) => {
            const Icon = CATEGORY_ICONS[item.category] ?? CATEGORY_ICONS.Others;
            const debit = item.type === "Debit";

            return (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="group flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-md sm:gap-4 sm:rounded-3xl sm:p-4"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl ${debit
                      ? "bg-gradient-to-br from-red-50 to-rose-100 text-red-600"
                      : "bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-700"
                    }`}
                >
                  <Icon size={20} className="sm:h-6 sm:w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-slate-800 sm:text-base">
                    {item.product || "Unnamed Product"}
                  </h3>

                  <p className="truncate text-xs text-slate-500 sm:text-sm">
                    {item.category} • {formatDate(toDate(item.transaction_date))}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className={`text-base font-bold sm:text-lg ${debit ? "text-rose-500" : "text-emerald-600"
                      }`}
                  >
                    {debit ? "-" : "+"}
                    {currency(item.amount)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && <TransactionDetailModal expense={selected} onClose={() => setSelected(null)} />}
    </div>)
}
