import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Zap, Phone, ArrowRight, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container px-4 md:px-6 mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Joy Data Bundles" className="h-9 w-9 rounded-lg" />
            <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:inline-block">
              Joy Data Bundles
            </span>
            <span className="font-bold text-xl tracking-tight text-slate-900 sm:hidden">JoyBundle</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors"
              href="/auth/login"
            >
              Reseller Login
            </Link>
            <Link
              className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors"
              href="/track-order"
            >
              Track Order
            </Link>
            <Link href="/buy">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm">Buy Data Now</Button>
            </Link>
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 mt-8">
                  <Link href="/" className="font-bold text-lg">
                    Home
                  </Link>
                  <Link href="/auth/login" className="font-medium text-lg">
                    Reseller Login
                  </Link>
                  <Link href="/track-order" className="font-medium text-lg">
                    Track Order
                  </Link>
                  <Link href="/buy">
                    <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">Buy Data Now</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/50 to-white -z-10" />
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-cyan-100 text-cyan-800 border-cyan-200">
                <Zap className="h-3.5 w-3.5 mr-2 fill-current" /> Instant Delivery 24/7
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl text-slate-900">
                Premium Data Bundles at <span className="text-cyan-500">Unbeatable Prices</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-slate-600 md:text-xl leading-relaxed">
                Experience the fastest data delivery for MTN, Telecel, and AT. Secure payments, instant processing, and
                reliable support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                <Link href="/buy">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 rounded-lg text-lg bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-200/50 text-white"
                  >
                    Buy Data Bundle <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 rounded-lg border-slate-300 hover:bg-slate-100 text-slate-700 bg-transparent"
                  >
                    Become a Reseller
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-slate-50/50">
                <div className="p-4 bg-cyan-100 rounded-full text-cyan-600">
                  <Zap className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Instant Delivery</h2>
                <p className="text-slate-600 leading-relaxed">
                  Our automated systems ensure your data is delivered within seconds of payment confirmation.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-slate-50/50">
                <div className="p-4 bg-emerald-100 rounded-full text-emerald-600">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Secure Payments</h2>
                <p className="text-slate-600 leading-relaxed">
                  We use official Mobile Money APIs to ensure your transactions are 100% safe and verified.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-slate-50/50">
                <div className="p-4 bg-purple-100 rounded-full text-purple-600">
                  <Phone className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Reliable Support</h2>
                <p className="text-slate-600 leading-relaxed">
                  Our support team is always available to assist you with any inquiries or issues.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* ... existing footer ... */}
      <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="h-6 w-6 opacity-80 rounded" />
          <p className="text-xs text-slate-500">© 2025 Joy Data Bundles. All rights reserved.</p>
        </div>
        {/* ... existing nav ... */}
      </footer>
    </div>
  )
}
