"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // Added Alert import
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react" // Added AlertTriangle icon
import { cn, NETWORKS, formatCurrency } from "@/lib/utils"
import Link from "next/link" // Added Link import

// Mock API function
const fetchBundles = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    { id: 1, name: "1GB Data", price: 15, network: "mtn" },
    { id: 2, name: "2GB Data", price: 28, network: "mtn" },
    { id: 3, name: "5GB Data", price: 60, network: "mtn" },
    { id: 4, name: "1GB Data", price: 14, network: "telecel" },
    { id: 5, name: "5GB Data", price: 55, network: "telecel" },
    { id: 6, name: "10GB Data", price: 100, network: "at" },
  ]
}

export default function BuyPage() {
  const [step, setStep] = useState(1) // 1: Network, 2: Bundle, 3: Details, 4: Payment, 5: Success
  const [selectedNetwork, setSelectedNetwork] = useState(null)
  const [selectedBundle, setSelectedBundle] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [processing, setProcessing] = useState(false)

  const { data: bundles, isLoading } = useQuery({
    queryKey: ["bundles"],
    queryFn: fetchBundles,
  })

  const filteredBundles = bundles?.filter((b) => b.network === selectedNetwork) || []

  const handleNetworkSelect = (networkId) => {
    setSelectedNetwork(networkId)
    setStep(2)
  }

  const handleBundleSelect = (bundle) => {
    setSelectedBundle(bundle)
    setStep(3)
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    setProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setProcessing(false)
    setStep(5)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.jpg" alt="Joy Data" className="h-8 w-8 rounded border border-slate-100" />
            <span className="font-bold text-lg text-slate-900">Joy Data</span>
          </Link>
          <Button variant="ghost" size="sm" asChild className="text-slate-500">
            <Link href="/">Cancel</Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md py-8">
          {/* Progress Steps */}
          <div className="flex justify-between mb-8 px-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                    step >= i ? "bg-primary text-primary-foreground" : "bg-slate-200 text-slate-500",
                  )}
                >
                  {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {i === 1 ? "Network" : i === 2 ? "Bundle" : "Checkout"}
                </span>
              </div>
            ))}
          </div>

          <Card className="shadow-xl border-slate-100 ring-0">
            <CardHeader>
              <CardTitle>
                {step === 1 && "Select Network"}
                {step === 2 && "Choose Package"}
                {step === 3 && "Enter Details"}
                {step === 5 && "Order Confirmed"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Which network do you want to top up?"}
                {step === 2 && `Available bundles for ${NETWORKS.find((n) => n.id === selectedNetwork)?.name}`}
                {step === 3 && "Enter the recipient phone number"}
                {step === 5 && "Your data is on its way!"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {step === 1 && (
                <div className="grid grid-cols-1 gap-3">
                  {NETWORKS.map((net) => (
                    <button
                      key={net.id}
                      onClick={() => handleNetworkSelect(net.id)}
                      className={cn(
                        "flex items-center p-4 rounded-xl border-2 border-transparent transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm",
                        net.color,
                      )}
                    >
                      <img
                        src={net.logo}
                        alt={net.name}
                        className="h-8 w-8 rounded-full border border-white/60 mr-3 bg-white object-contain"
                      />
                      <span className="font-bold text-lg">{net.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {filteredBundles.map((bundle) => (
                        <button
                          key={bundle.id}
                          onClick={() => handleBundleSelect(bundle)}
                          className="flex items-center justify-between p-4 rounded-lg border hover:border-primary hover:bg-blue-50 transition-all bg-white group"
                        >
                          <span className="font-medium group-hover:text-primary">{bundle.name}</span>
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {formatCurrency(bundle.price)}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}
                  <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>
                    Back to Networks
                  </Button>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2 border">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Network</span>
                      <span className="flex items-center gap-2 font-medium">
                        {NETWORKS.find((n) => n.id === selectedNetwork)?.logo && (
                          <img
                            src={NETWORKS.find((n) => n.id === selectedNetwork)?.logo}
                            alt={NETWORKS.find((n) => n.id === selectedNetwork)?.name}
                            className="h-5 w-5 rounded-full border border-slate-200 bg-white object-contain"
                          />
                        )}
                        {NETWORKS.find((n) => n.id === selectedNetwork)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Bundle</span>
                      <span className="font-medium">{selectedBundle?.name}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary text-lg">{formatCurrency(selectedBundle?.price)}</span>
                    </div>
                  </div>

                  <Alert variant="destructive" className="bg-amber-50 text-amber-900 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Important Warning</AlertTitle>
                    <AlertDescription className="text-xs leading-relaxed mt-1">
                      Please double-check the phone number below. The platform is <strong>not responsible</strong> for
                      bundles sent to the wrong number due to user error. Transactions cannot be reversed once
                      processed.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="024 XXX XXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="text-lg tracking-widest"
                      required
                      pattern="[0-9]{10}"
                    />
                    <p className="text-xs text-slate-500">Please ensure this number is registered on Mobile Money.</p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={!phoneNumber || processing}>
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : (
                        "Pay Now"
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {step === 5 && (
                <div className="flex flex-col items-center text-center space-y-4 py-6">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl">Payment Successful!</h3>
                    <p className="text-slate-500 max-w-[260px] mx-auto">
                      Your {selectedBundle?.name} bundle is being processed and will be delivered to {phoneNumber}{" "}
                      shortly.
                    </p>
                  </div>
                  <div className="pt-4 w-full">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setStep(1)
                        setPhoneNumber("")
                        setSelectedNetwork(null)
                        setSelectedBundle(null)
                      }}
                    >
                      Buy Another
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
