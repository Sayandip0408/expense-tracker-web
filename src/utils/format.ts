import type { Timestamp } from 'firebase/firestore'
import {
  Gift,
  Laptop,
  MoreHorizontal,
  Plane,
  Receipt,
  Scissors,
  Shirt,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { Category } from '../types'

export const CATEGORIES: Category[] = [
  'Food',
  'Electronics',
  'Travel',
  'Services',
  'Outfits',
  'Grooming',
  'Gift',
  'Fees',
  'Others',
]

export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  Food: UtensilsCrossed,
  Electronics: Laptop,
  Travel: Plane,
  Services: Wrench,
  Outfits: Shirt,
  Grooming: Scissors,
  Gift: Gift,
  Fees: Receipt,
  Others: MoreHorizontal,
}

export function currency(amount: number | null | undefined): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0)
}

export function currencyWhole(amount: number | null | undefined): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

// Converts a Firestore Timestamp OR a JS Date/string into a JS Date.
export function toDate(
  value: Timestamp | Date | string | null | undefined,
): Date | null {
  if (!value) return null
  if (typeof (value as Timestamp).toDate === 'function') {
    return (value as Timestamp).toDate()
  }
  return new Date(value as Date | string)
}
