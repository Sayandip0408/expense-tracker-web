import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Loader from './components/Loader.jsx'
import PinGate from './components/PinGate.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import History from './pages/History.jsx'
import Reports from './pages/Reports.jsx'
import Profile from './pages/Profile.jsx'

const APP_PIN = import.meta.env.VITE_APP_PIN

export default function App() {
  const { user, authLoading } = useAuth()
  const [pinOk, setPinOk] = useState(
    () => !APP_PIN || sessionStorage.getItem('trackstack_pin_ok') === '1',
  )

  // Reset the gate if the app pin isn't configured.
  useEffect(() => {
    if (!APP_PIN) setPinOk(true)
  }, [])

  if (authLoading) {
    return <Loader label="Loading TrackStack…" />
  }

  // Returning, already-authenticated users see the PIN gate first —
  // mirrors the Flutter SplashScreen's app-password dialog.
  if (user && APP_PIN && !pinOk) {
    return <PinGate onUnlock={() => setPinOk(true)} />
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <Signup />}
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
