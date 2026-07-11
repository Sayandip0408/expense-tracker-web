import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps): ReactNode {
  const { user, authLoading } = useAuth()

  if (authLoading) return <Loader />

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}