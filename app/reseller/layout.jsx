import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, LogOut, User } from "lucide-react"

export default function ResellerLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <Zap className="h-6 w-6 fill-blue-500 text-blue-500" />
            <span>
              JoyBundle <span className="text-slate-400 font-normal text-sm ml-1">Reseller</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/reseller" className="text-blue-600">
                Dashboard
              </Link>
              <Link href="/reseller/earnings" className="hover:text-slate-900">
                Earnings
              </Link>
              <Link href="/reseller/settings" className="hover:text-slate-900">
                Settings
              </Link>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-slate-500">ID: RES-001</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
