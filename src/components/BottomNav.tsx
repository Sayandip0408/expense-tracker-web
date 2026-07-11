import { NavLink } from 'react-router-dom'
import {
  CirclePlus,
  History,
  LayoutGrid,
  PieChart,
  User,
} from 'lucide-react'

interface BottomNavProps {
  onAddTransaction: () => void
}

const item =
  'flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-3 text-[11px] font-semibold transition-all duration-300'

export default function BottomNav({
  onAddTransaction,
}: BottomNavProps) {
  return (
    <div className="sticky bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)]">
      <nav className="flex items-end rounded-[30px] border border-white/60 bg-white/90 px-3 py-2 shadow-2xl backdrop-blur-xl">
        <NavItem
          to="/"
          label="Home"
          icon={LayoutGrid}
        />

        <NavItem
          to="/reports"
          label="Reports"
          icon={PieChart}
        />

        {/* Floating Add */}
        <button
          onClick={onAddTransaction}
          className="flex flex-1 flex-col items-center"
        >
          <div className="-mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl ring-4 ring-white transition duration-300 hover:scale-110 active:scale-95">
            <CirclePlus size={30} strokeWidth={2.5} />
          </div>

          <span className="mt-2 text-[11px] font-semibold text-emerald-700">
            Add
          </span>
        </button>

        <NavItem
          to="/history"
          label="History"
          icon={History}
        />

        <NavItem
          to="/profile"
          label="Profile"
          icon={User}
        />
      </nav>
    </div>
  )
}

interface NavItemProps {
  to: string
  label: string
  icon: React.ElementType
}

function NavItem({
  to,
  label,
  icon: Icon,
}: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `${item} ${isActive
          ? 'bg-emerald-50 text-emerald-700'
          : 'text-gray-400 hover:text-emerald-600'
        }`
      }
    >
      <Icon
        size={22}
        strokeWidth={2.2}
      />

      <span>{label}</span>
    </NavLink>
  )
}