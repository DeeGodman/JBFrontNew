"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Search, Package, CheckCircle, Clock, XCircle, Home, Phone, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState(null)
  const [error, setError] = useState("")

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!orderId.trim()) return

    setIsSearching(true)
    setError("")
    setSearchResult(null)

    // Simulate API call
    setTimeout(() => {
      setIsSearching(false)

      // Mock matching logic
      if (orderId.toUpperCase() === "ORD-001") {
        setSearchResult({
          id: "ORD-001",
          status: "completed",
          date: "Oct 22, 2024 - 10:30 AM",
          bundle: "5GB MTN Data Bundle",
          phone: "024 555 0101",
          amount: 60.0,
          network: "MTN",
        })
      } else if (orderId.toUpperCase() === "ORD-002") {
        setSearchResult({
          id: "ORD-002",
          status: "pending",
          date: "Oct 22, 2024 - 10:45 AM",
          bundle: "10GB Telecel Data Bundle",
          phone: "050 123 4567",
          amount: 100.0,
          network: "Telecel",
        })
      } else {
        setError("Order not found. Please check your Order ID and try again.")
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Logo" className="h-8 w-8 rounded-md" />
            <span className="font-bold text-xl text-slate-900 hidden sm:inline-block">Joy Data Bundles</span>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="mr-2 h-4 w-4" />
              Back Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="text-center max-w-2xl mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">Track Your Order</h1>
          <p className="text-lg text-slate-600">
            Enter your Order ID below to check the current status of your data bundle delivery.
          </p>
        </div>

        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle>Order Lookup</CardTitle>
            <CardDescription>Your Order ID was sent to your email or phone.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="e.g. ORD-001"
                    className="pl-9"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isSearching || !orderId}>
                  {isSearching ? "Searching..." : "Track"}
                </Button>
              </div>
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {searchResult && (
          <Card className="w-full max-w-md mt-8 shadow-lg border-t-4 border-t-cyan-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="pb-4 border-b bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Order Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {searchResult.status === "completed" && (
                      <Badge className="bg-green-500 hover:bg-green-600 text-base px-3 py-1">
                        <CheckCircle className="mr-1.5 h-4 w-4" /> Completed
                      </Badge>
                    )}
                    {searchResult.status === "pending" && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-base px-3 py-1">
                        <Clock className="mr-1.5 h-4 w-4" /> Processing
                      </Badge>
                    )}
                    {searchResult.status === "failed" && (
                      <Badge variant="destructive" className="text-base px-3 py-1">
                        <XCircle className="mr-1.5 h-4 w-4" /> Failed
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-medium">Order ID</p>
                  <p className="font-mono font-bold text-lg">{searchResult.id}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-0.5">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Bundle Details</p>
                    <p className="font-semibold text-slate-900">{searchResult.bundle}</p>
                    <p className="text-sm text-slate-600">{formatCurrency(searchResult.amount)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-full text-purple-600 mt-0.5">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Recipient Number</p>
                    <p className="font-semibold text-slate-900">{searchResult.phone}</p>
                    <p className="text-xs text-slate-500 uppercase">{searchResult.network}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-full text-slate-600 mt-0.5">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Date & Time</p>
                    <p className="text-sm text-slate-900">{searchResult.date}</p>
                  </div>
                </div>
              </div>

              {searchResult.status === "pending" && (
                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 border border-blue-100">
                  <p className="font-medium mb-1">Your order is being processed.</p>
                  <p>This usually takes 1-5 minutes. You will receive an SMS once the bundle is delivered.</p>
                </div>
              )}

              {searchResult.status === "failed" && (
                <div className="bg-red-50 p-4 rounded-lg text-sm text-red-700 border border-red-100">
                  <p className="font-medium mb-1">Delivery failed.</p>
                  <p>
                    Please check if the recipient number is correct. If money was deducted, it will be refunded to your
                    wallet automatically.
                  </p>
                  <Link href="/support" className="font-medium underline mt-2 inline-block">
                    Contact Support
                  </Link>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t p-4">
              <Button className="w-full bg-transparent" variant="outline" onClick={() => setSearchResult(null)}>
                Check Another Order
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>

      <footer className="py-6 border-t bg-white text-center text-sm text-slate-500">
        <div className="container mx-auto px-4">
          <p>&copy; 2025 Joy Data Bundles. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
