import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount)
}

export const NETWORKS = [
  { id: "mtn", name: "MTN", color: "bg-yellow-400 text-yellow-950" },
  { id: "telecel", name: "Telecel", color: "bg-red-500 text-white" },
  { id: "at", name: "AT", color: "bg-blue-600 text-white" },
]
