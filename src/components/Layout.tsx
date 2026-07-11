import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import BottomNav from './BottomNav'
import TransactionModal from './TransactionModal'

import type { TransactionType } from '../types'

export default function Layout() {
  const [modalType, setModalType] = useState<TransactionType | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  function openModal(type: TransactionType = 'Debit'): void {
    setModalType(type)
  }

  function handleSaved(): void {
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col bg-canvas">
      <main className="flex-1 pb-4">
        <Outlet context={{ openModal, refreshKey }} />
      </main>

      <BottomNav onAddTransaction={() => openModal('Debit')} />

      {modalType && (
        <TransactionModal
          defaultType={modalType}
          onClose={() => setModalType(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}