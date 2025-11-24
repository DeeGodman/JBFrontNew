import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
  }).format(amount)
}

export const NETWORKS = [
  { id: 'mtn', name: 'MTN', logo: '/mtn.png', color: 'bg-yellow-400 text-slate-900' },
  { id: 'telecel', name: 'Telecel', logo: '/telecel.png', color: 'bg-red-600 text-white' },
  { id: 'at', name: 'AirtelTigo', logo: '/AT.png', color: 'bg-blue-700 text-white' },
]
