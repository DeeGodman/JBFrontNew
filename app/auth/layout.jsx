import Link from "next/link"

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <Link href="/" className="flex flex-col items-center gap-2 transition-opacity hover:opacity-90">
          <img src="/logo.jpg" alt="Joy Data Bundles" className="h-16 w-16 rounded-xl shadow-md" />
          <span className="text-2xl font-bold text-slate-900">Joy Data Bundles</span>
        </Link>
        {children}
      </div>
    </div>
  )
}
