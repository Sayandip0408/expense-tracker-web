import type { Timestamp } from 'firebase/firestore'

export type TransactionType = 'Debit' | 'Credit'

export type Category =
  | 'Food'
  | 'Electronics'
  | 'Travel'
  | 'Services'
  | 'Outfits'
  | 'Grooming'
  | 'Gift'
  | 'Fees'
  | 'Others'

export type Gender = 'Male' | 'Female'

export interface UserDoc {
  name: string
  email: string
  password?: string
  gender: Gender
  balance: number
  user_id: string
  dp: string
}

export interface Expense {
  id?: string
  type: TransactionType
  category: Category
  amount: number
  product: string
  transaction_date: Timestamp
  owner: string
  created_at?: Timestamp
}
