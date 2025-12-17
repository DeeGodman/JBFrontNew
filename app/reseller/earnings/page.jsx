"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Calendar, Download, Wallet, ArrowDownRight, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { PayoutPopup } from "@/components/reseller/payout-popup"


//MY OWN IMPORTs 
import { useUser } from "@/app/contexts/UserContext"
import { useQuery } from "@tanstack/react-query"





export default function ResellerEarningsPage() {
  const [activeTab, setActiveTab] = useState("commissions")
  const { Reseller, isLoadingReseller, isErrorReseller } = useUser();

  console.log("Earnings Page Picking up reseller:", Reseller)



  //TEST 
  const BASE_URL = "https://2c8186ee0c04.ngrok-free.app/api/v1"
  const CURRENT_USER_ID = "6939e7a48945df1d67c26f00"


  //FETCH COMMISION QUERY
  const fetchRecentCommissions = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/commissions/my-commissions?resellerId=${CURRENT_USER_ID}&page=1&limit=5`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
          },
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch commissions");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch commissions");
      }

      return data; // { success, commissions: [...], pagination: {...} }
    } catch (error) {
      console.error("Fetch commissions error:", error.message);
      toast.error(error.message || "Failed to load commissions");
      throw error;
    }
  }




  const {
    data: commissionsData,
    isLoading: isLoadingCommissions,
    isError: isErrorCommissions,
  } = useQuery({
    queryKey: ["recentCommissions", CURRENT_USER_ID],
    queryFn: fetchRecentCommissions,
  })


  const commissions = commissionsData?.commissions || []

  console.log("COMMISSIONS:", commissions)


  ///PAYOUT HISTORY CALL -- I HAVE TO MOVE THESE ALL LATER INTO AN API FILE 


  // Fetch recent payouts
  const fetchRecentPayouts = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/payout/my-payouts?resellerId=${CURRENT_USER_ID}&page=1&limit=5`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",

            "ngrok-skip-browser-warning": "true",
          },
        }
      )

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Failed to fetch payouts")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch payouts")
      }

      return data.data
    } catch (error) {
      console.error("Fetch payouts error:", error.message)
      toast.error(error.message || "Failed to load payouts")
      throw error
    }
  }

  const {
    data: payoutData,
    isLoading: isLoadingPayouts,
    isError: isErrorPayout,
  } = useQuery({
    queryKey: ["recentPayouts", CURRENT_USER_ID],
    queryFn: fetchRecentPayouts,
  })

  const payouts = payoutData?.payouts || []

  console.log("PAYOUTSSSS:", payouts)






  ///PAYOUT HISTORY CALL -- I HAVE TO MOVE THESE ALL LATER INTO AN API FILE





  const exportData = (data, filename) => {
    if (!data.length) return

    const headers = Object.keys(data[0]).join(",")
    const csvContent = [headers, ...data.map((row) => Object.values(row).join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Earnings & Payouts</h1>
          <p className="text-slate-500 mt-1">Track your profits and manage withdrawals</p>
        </div>
        <PayoutPopup availableBalance={Reseller?.totalCommissionsEarned - Reseller?.totalCommissionsPaidOut} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(Reseller?.totalCommissionsEarned
            )}</div>
            <p className="text-xs text-slate-500 mt-1">Lifetime Profit Made</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(Reseller?.totalCommissionsEarned - (Reseller?.
              totalCommissionsPaidOut
            ))}</div>
            <p className="text-xs text-slate-500 mt-1">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Payout</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(Reseller?.totalCommissionsPaidOut)}</div>
            <p className="text-xs text-slate-500 mt-1">Hurray!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Payout In Queue</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(payoutData?.pendingAmount)}</div>
            <Badge variant="secondary" className="mt-1">
              Silver Tier
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === "commissions" ? "default" : "ghost"}
          onClick={() => setActiveTab("commissions")}
          className={activeTab === "commissions" ? "bg-cyan-500 hover:bg-cyan-600" : ""}
        >
          Profit History
        </Button>
        <Button
          variant={activeTab === "payouts" ? "default" : "ghost"}
          onClick={() => setActiveTab("payouts")}
          className={activeTab === "payouts" ? "bg-cyan-500 hover:bg-cyan-600" : ""}
        >
          Payout History
        </Button>
      </div>

      {/* Commission History Table */}
      {activeTab === "commissions" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profit Breakdown</CardTitle>
                <CardDescription>All earnings from your referral link</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => exportData(commissions, "commissions.csv")}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead className="min-w-[120px]">Bundle</TableHead>
                    <TableHead>Order Amount</TableHead>
                    <TableHead className="text-right">Profits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingCommissions ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                          <span className="text-slate-500">Loading commissions...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : commissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No commissions yet. Share your referral link to start earning!
                      </TableCell>
                    </TableRow>
                  ) : (
                    commissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell className="text-slate-500 whitespace-nowrap">
                          {new Date(commission.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">{commission.orderId}</TableCell>
                        <TableCell className="whitespace-nowrap">{commission.bundle}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatCurrency(commission.orderAmount)}</TableCell>
                        <TableCell className="text-right font-bold text-green-600 whitespace-nowrap">
                          +{formatCurrency(commission.commission)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout History Table */}
      {activeTab === "payouts" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Withdrawal History</CardTitle>
                <CardDescription>All payouts to your account</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => exportData(payouts, "payouts.csv")}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingPayouts ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        <span className="text-slate-500">Loading Payouts...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : payouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      You've not made any payouts yet
                    </TableCell>
                  </TableRow>
                ) : (payouts.map((payout) => (
                  <TableRow key={payout._id}>
                    <TableCell className="text-slate-500">
                      {new Date(payout.requestedAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="font-medium">
                      {payout.transactionReference || '—'}
                    </TableCell>

                    <TableCell>{payout.network}</TableCell>

                    <TableCell className="text-right font-bold">
                      <span className="flex items-center justify-end gap-1">
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                        {formatCurrency(payout.netAmount ?? payout.amount)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={
                          payout.status === "completed"
                            ? "bg-green-500 hover:bg-green-600 text-white/90"
                            : payout.status === "pending"
                              ? "bg-yellow-500 hover:bg-yellow-600 text-white/90"
                              : "bg-red-500 hover:bg-red-600 text-white/90" // rejected
                        }
                      >
                        {payout.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
