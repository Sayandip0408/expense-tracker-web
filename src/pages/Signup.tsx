import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, User, Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext.js'
import { useState, type SubmitEvent } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { Gender } from '../types'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!gender) {
      setError('Please select a gender.')
      return
    }

    setLoading(true)

    try {
      await signup({ name, email, password, gender })
      navigate('/login', { replace: true })
    } catch {
      setError('Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-100">
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full overflow-hidden rounded-3xl bg-white/70 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
          <div className="hidden flex-col justify-center bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-16 text-white lg:flex">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                <Wallet size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black">TrackStack</h2>
                <p className="text-emerald-100">Smart Expense Management</p>
              </div>
            </div>

            <div className="mt-14">
              <h1 className="text-5xl font-black leading-tight">
                Take control of your finances.
              </h1>

              <p className="mt-6 max-w-md text-lg leading-8 text-emerald-100">
                Create your account and start tracking expenses, income,
                budgets and financial goals from anywhere.
              </p>

              <div className="mt-10 space-y-4 text-lg">
                <p>✓ Track Expenses</p>
                <p>✓ Monitor Income</p>
                <p>✓ Smart Analytics</p>
                <p>✓ Beautiful Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-16">
            <div className="w-full max-w-md">
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                  <Wallet size={22} />
                </div>
                <span className="text-2xl font-black text-emerald-700">
                  TrackStack
                </span>
              </div>

              <h1 className="text-4xl font-black text-gray-900">
                Create your account ✨
              </h1>

              <p className="mt-3 text-gray-500">
                Join TrackStack and start managing your finances smarter.
              </p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                <Field icon={User} label="Full Name" type="text" value={name} onChange={setName} placeholder="John Doe" autoComplete="name" />
                <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
                <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete="new-password" />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Gender
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Male', emoji: '👨' },
                      { label: 'Female', emoji: '👩' },
                    ].map((item) => (
                      <label
                        key={item.label}
                        className={`cursor-pointer rounded-2xl border p-4 transition ${
                          gender === item.label
                            ? 'border-emerald-600 bg-emerald-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-emerald-300'
                        }`}
                      >
                        <input
                          hidden
                          type="radio"
                          value={item.label}
                          checked={gender === item.label}
                          onChange={(e) =>
                            setGender(e.target.value as Gender)
                          }
                        />

                        <div className="text-center">
                          <div className="text-3xl">{item.emoji}</div>
                          <div className="mt-2 font-semibold text-gray-700">
                            {item.label}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-base font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:opacity-60"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Sign In
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
  onChange: (value: string) => void
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
        <Icon size={20} className="mr-3 text-gray-400 group-focus-within:text-emerald-600" />

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
