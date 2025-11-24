"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  AlertCircle,
  LogOut,
  Shield,
  FileText,
  Settings,
} from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: FileText, label: "Transactions", href: "/admin/transactions" }, // Added Transactions link
  { icon: Users, label: "Resellers", href: "/admin/resellers" },
  { icon: Package, label: "Bundles", href: "/admin/bundles" },
  { icon: AlertCircle, label: "Complaints", href: "/admin/complaints" },
  { icon: Shield, label: "Users & Roles", href: "/admin/users" },
  { icon: Settings, label: "Settings", href: "/admin/settings" }, // Added Settings link
]

export function AdminSidebar({ className }) {
  // Added className prop for flexibility
  const pathname = usePathname()

  return (
    <div
      className={cn("hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-slate-800", className)}
    >
      <div className="p-6 flex items-center gap-3 font-bold text-xl text-white">
        <div className="relative w-8 h-8 rounded-md overflow-hidden bg-white p-0.5">
          <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
        </div>
        JoyBundle
      </div>

      <div className="flex-1 py-6 flex flex-col gap-1 px-3 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 hover:text-white",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <Link
          href="/auth/login"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Link>
      </div>
    </div>
  )
}
