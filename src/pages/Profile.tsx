import { useNavigate, useOutletContext } from 'react-router-dom'
import { BarChart3, History, LogOut, Minus, Plus, User as UserIcon, ChevronRight, Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext.js'
import { currency } from '../utils/format.js'
import type { LucideIcon } from 'lucide-react'
import type { TransactionType } from '../types'

export default function Profile() {
  const { userDoc, logout } = useAuth()
  const { openModal } = useOutletContext<{ openModal: (type: TransactionType) => void }>()
  const navigate = useNavigate()
  async function handleLogout() { await logout(); navigate('/login', { replace: true }) }
  if (!userDoc) {
    return <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-teal-50"><p className="text-gray-500">Loading...</p></div>
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl bg-linear-to-br from-emerald-700 to-teal-600 text-white shadow-2xl">
        <div className="p-5 text-center sm:p-8">
          <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border-4 border-white/40 bg-white/20 sm:h-28 sm:w-28">
            {userDoc.dp ? <img src={userDoc.dp} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><UserIcon size={40} className="sm:h-14 sm:w-14" /></div>}
          </div>
          <h1 className="mt-4 text-2xl font-black sm:text-3xl">{userDoc.name || 'User'}</h1>
          <p className="mt-1 break-all text-sm text-white/80">{userDoc.email}</p>
          <div className="mt-6 rounded-3xl bg-white/10 p-4 backdrop-blur sm:mt-8 sm:p-6">
            <div className="flex items-center justify-center gap-2 text-white/80"><Wallet size={18} />Total Balance</div>
            <div className="mt-2 text-[clamp(2rem,8vw,3rem)] font-black leading-tight break-all">{currency(userDoc.balance)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4">
        <Quick icon={Plus} title="Deposit" color="from-green-500 to-emerald-600" onClick={() => openModal('Credit')} />
        <Quick icon={Minus} title="Deduct" color="from-red-500 to-rose-600" onClick={() => openModal('Debit')} />
      </div>

      <div className="mt-6 rounded-3xl bg-white p-2 shadow-lg sm:mt-8 sm:p-4">
        <Menu icon={History} label="Transaction History" color="text-amber-600" bg="bg-amber-100" onClick={() => navigate('/history')} />
        <Menu icon={BarChart3} label="Analytics & Reports" color="text-sky-600" bg="bg-sky-100" onClick={() => navigate('/reports')} />
        <Menu icon={LogOut} label="Log Out" color="text-red-600" bg="bg-red-100" textColor="text-red-600" onClick={handleLogout} />
      </div>

      <div className="mt-6 text-center text-xs text-gray-500 sm:mt-8 sm:text-sm">
        Crafted with ❤️ by{' '}
        <a href="https://sayandip-adhikary.vercel.app" target="_blank" rel="noreferrer" className="font-semibold text-emerald-700 hover:text-emerald-800">
          SayanDip Adhikary
        </a>
      </div>
    </div>)
}

function Quick({
  icon: Icon,
  title,
  color,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:rounded-3xl sm:p-5"
    >
      <div
        className={
          "mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br " +
          color +
          " text-white sm:h-16 sm:w-16 sm:rounded-2xl"
        }
      >
        <Icon size={20} className="sm:h-7 sm:w-7" />
      </div>

      <div className="mt-3 text-sm font-semibold text-slate-800 sm:mt-4 sm:text-base">
        {title}
      </div>
    </button>
  );
}

function Menu({
  icon: Icon,
  label,
  onClick,
  color,
  bg,
  textColor,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void | Promise<void>;
  color: string;
  bg: string;
  textColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl p-3 transition hover:bg-slate-50 sm:gap-4 sm:p-4"
    >
      <div
        className={
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl " +
          bg +
          " sm:h-14 sm:w-14 sm:rounded-2xl"
        }
      >
        <Icon size={20} className={color} />
      </div>

      <div
        className={
          "flex-1 text-left text-sm font-semibold sm:text-base " +
          (textColor || "text-slate-800")
        }
      >
        {label}
      </div>

      <ChevronRight
        size={18}
        className="shrink-0 text-slate-400"
      />
    </button>
  );
}
