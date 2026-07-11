import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext.js'
import type { SubmitEvent } from 'react'
import type { LucideIcon } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-100">
      {/* Background */}
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full overflow-hidden rounded-3xl bg-white/70 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
          {/* Left */}
          <div className="hidden flex-col justify-center bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-16 text-white lg:flex">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Wallet size={32} />
              </div>

              <div>
                <h2 className="text-3xl font-black">TrackStack</h2>
                <p className="text-emerald-100">
                  Smart Expense Management
                </p>
              </div>
            </div>

            <div className="mt-14 space-y-6">
              <h1 className="text-5xl font-black leading-tight">
                Track your money with confidence.
              </h1>

              <p className="max-w-md text-lg leading-8 text-emerald-100">
                Manage income, expenses, budgets and analytics in one beautiful
                dashboard. Stay on top of your finances wherever you go.
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-16">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg">
                  <Wallet size={22} />
                </div>

                <span className="text-2xl font-black text-emerald-700">
                  TrackStack
                </span>
              </div>

              <h1 className="text-4xl font-black text-gray-900">
                Welcome Back 👋
              </h1>

              <p className="mt-3 text-gray-500">
                Sign in to continue managing your finances.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-6"
              >
                <Field
                  icon={Mail}
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  autoComplete="email"
                />

                <Field
                  icon={Lock}
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-14 w-full items-center justify-center rounded-2xl cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 text-base font-semibold text-white shadow-lg transition duration-300 hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-emerald-600 transition hover:text-emerald-700"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FieldProps {
  icon: LucideIcon
  label: string
  type: React.HTMLInputTypeAttribute
  value: string
  onChange: React.Dispatch<React.SetStateAction<string>>
  placeholder?: string
  autoComplete?: string
}

function Field({
  icon: Icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="group flex h-14 items-center rounded-2xl border border-gray-200 bg-white px-4 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
        <Icon
          size={20}
          className="mr-3 text-gray-400 transition group-focus-within:text-emerald-600"
        />

        <input
          required
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
        />
      </div>
    </div>
  )
}