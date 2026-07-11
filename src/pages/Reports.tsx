import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.js'
import { currencyWhole, toDate } from '../utils/format.js'
import Loader from '../components/Loader.js'
import type { Expense, TransactionType, Category } from '../types'
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts'
import { TrendingUp, TrendingDown, CalendarDays, Receipt } from 'lucide-react'

const FILTERS = [
  { id: 'all', label: 'All' }, { id: 'last7Days', label: 'Last 7 Days' }, { id: 'lastWeek', label: 'Last Week' },
  { id: 'thisMonth', label: 'This Month' }, { id: 'lastMonth', label: 'Last Month' },
  { id: 'thisYear', label: 'This Year' }, { id: 'lastYear', label: 'Last Year' }
]
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function range(id: string) {
  const n = new Date(); switch (id) {
    case 'last7Days': { const s = new Date(n); s.setDate(s.getDate() - 7); return [s, n] }
    case 'thisMonth': return [new Date(n.getFullYear(), n.getMonth(), 1), n]
    case 'lastMonth': return [new Date(n.getFullYear(), n.getMonth() - 1, 1), new Date(n.getFullYear(), n.getMonth(), 0, 23, 59, 59)]
    case 'thisYear': return [new Date(n.getFullYear(), 0, 1), n]
    case 'lastYear': return [new Date(n.getFullYear() - 1, 0, 1), new Date(n.getFullYear() - 1, 11, 31, 23, 59, 59)]
    case 'lastWeek': { const s = new Date(n); s.setDate(n.getDate() - n.getDay() - 6); const e = new Date(n); e.setDate(n.getDate() - n.getDay()); return [s, e] }
    default: return null
  }
}

export default function Reports() {
  const { user } = useAuth()
  const [tab, setTab] = useState<TransactionType>('Debit')
  const [filter, setFilter] = useState('all')
  const [expenses, setExpenses] = useState<Expense[] | null>(null)

  useEffect(() => {
    if (!user?.email) return
    return onSnapshot(query(collection(db, 'expenses'), where('owner', '==', user.email)), s => {
      setExpenses(s.docs.map(d => ({ id: d.id, ...d.data() as Omit<Expense, 'id'> })))
    })
  }, [user?.email])

  const filtered = useMemo(() => {
    if (!expenses) return []
    const r = range(filter)
    if (!r) return expenses
    const [a, b] = r
    return expenses.filter(e => { const d = toDate(e.transaction_date); return d && d >= a && d <= b })
  }, [expenses, filter])

  const totals = useMemo(() => {
    const map: Partial<Record<Category, number>> = {}
    let sum = 0
    filtered.filter(e => e.type === tab).forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; sum += e.amount })
    return { map, sum }
  }, [filtered, tab])

  const chart = useMemo(() => {
    const by: any = {}
    DAYS.forEach(d => by[d] = { day: d, Debit: 0, Credit: 0 })
      ; (expenses || []).forEach(e => { const d = toDate(e.transaction_date); if (!d) return; const diff = (Date.now() - d.getTime()) / 86400000; if (diff > 7) return; by[DAYS[d.getDay()]][e.type] += e.amount })
    return DAYS.map(d => by[d])
  }, [expenses])

  const accent = tab === 'Debit' ? 'from-red-500 to-rose-600' : 'from-emerald-600 to-teal-600'

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-5 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900">Analytics</h1>
        <p className="text-gray-500">Understand your spending and income trends.</p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className={"rounded-3xl bg-gradient-to-r " + accent + " p-6 text-white shadow-2xl"}>
          <div className="flex items-center gap-2">{tab === 'Debit' ? <TrendingDown /> : <TrendingUp />}<span>Total {tab}</span></div>
          <div className="mt-3 text-5xl font-black">{currencyWhole(totals.sum)}</div>
          <div className="mt-2 text-white/80">{Object.keys(totals.map).length} Categories</div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"><CalendarDays size={16} />Time Range</label>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="h-12 w-full rounded-2xl border border-gray-200 px-4 outline-none focus:border-emerald-500">
            {FILTERS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {(['Debit', 'Credit'] as TransactionType[]).map(t =>
              <button key={t} onClick={() => setTab(t)} className={"rounded-2xl py-3 font-semibold transition " + (tab === t ? "bg-emerald-600 text-white shadow-lg" : "bg-gray-100 hover:bg-gray-200")}>{t}</button>)}
          </div>
        </div>
      </div>

      {expenses === null && <Loader />}

      {expenses && <>
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-xl">
          <div className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-900"><Receipt />Category Breakdown</div>

          {Object.keys(totals.map).length === 0 ?
            <div className="py-14 text-center text-gray-500">No {tab.toLowerCase()} transactions in this period.</div>
            :
            <div className="space-y-3">
              {Object.entries(totals.map).map(([k, v]) =>
                <div key={k} className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 hover:shadow-md">
                  <div className="font-semibold text-gray-800">{k}</div>
                  <div className="text-lg font-bold text-emerald-600">{currencyWhole(v || 0)}</div>
                </div>)}
            </div>}
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-xl">
          <div className="mb-5 text-xl font-bold text-gray-900">Last 7 Days Overview</div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(v) => currencyWhole(Number(v || 0))} />
              <Legend />
              <Bar dataKey="Debit" fill="#ef4444" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Credit" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>}
    </div>)
}
