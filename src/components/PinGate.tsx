import { useState, type SubmitEvent } from 'react'
import { ShieldCheck, LockKeyhole } from 'lucide-react'

const APP_PIN: string = import.meta.env.VITE_APP_PIN

interface PinGateProps {
  onUnlock: () => void
}

export default function PinGate({ onUnlock }: PinGateProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    if (pin === APP_PIN) {
      sessionStorage.setItem('trackstack_pin_ok', '1')
      onUnlock()
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-100">
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-3xl border border-white/50 bg-white/70 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-xl">
            <ShieldCheck size={38} />
          </div>

          <div className="mt-8 text-center">
            <h1 className="text-3xl font-black text-gray-900">
              Secure Access
            </h1>

            <p className="mt-3 text-gray-500">
              Enter your application password to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                App Password
              </label>

              <div className="group flex h-14 items-center rounded-2xl border border-gray-200 bg-white px-4 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                <LockKeyhole
                  size={20}
                  className="mr-3 text-gray-400 transition group-focus-within:text-emerald-600"
                />

                <input
                  autoFocus
                  required
                  type="password"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-base font-semibold text-white shadow-lg transition duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.99]"
            >
              Unlock App
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Protected access to your personal finance data.
          </p>
        </div>
      </div>
    </div>
  )
}