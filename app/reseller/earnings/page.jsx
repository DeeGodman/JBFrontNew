"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Calendar, Download, Wallet, ArrowDownRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Mock data for earnings
const earningsHistory = [
  {
    id: 1,
    date: "2024-01-20",
    orderId: "ORD-895",
    customer: "024***0101",
    bundle: "5GB MTN",
    orderAmount: 60,
    commission: 3.0,
    status: "paid",
  },
  {
    id: 2,
    date: "2024-01-19",
    orderId: "ORD-894",
    customer: "050***4567",
    bundle: "10GB Telecel",
    orderAmount: 100,
    commission: 5.0,
    status: "paid",
  },
  {
    id: 3,
    date: "2024-01-19",
    orderId: "ORD-893",
    customer: "027***2222",
    bundle: "2GB AT",
    orderAmount: 25,
    commission: 1.25,
    status: "paid",
  },
  {
    id: 4,
    date: "2024-01-18",
    orderId: "ORD-892",
    customer: "024***9999",
    bundle: "5GB MTN",
    orderAmount: 60,
    commission: 3.0,
    status: "pending",
  },
  {
    id: 5,
    date: "2024-01-18",
    orderId: "ORD-891",
    customer: "055***5555",
    bundle: "1GB MTN",
    orderAmount: 15,
    commission: 0.75,
    status: "pending",
  },
  {
    id: 6,
    date: "2024-01-17",
    orderId: "ORD-890",
    customer: "024***3333",
    bundle: "20GB Telecel",
    orderAmount: 180,
    commission: 9.0,
    status: "paid",
  },
]

const payoutHistory = [
  { id: 1, date: "2024-01-15", amount: 125.5, method: "Mobile Money", reference: "PAY-001", status: "completed" },
  { id: 2, date: "2024-01-01", amount: 98.75, method: "Mobile Money", reference: "PAY-002", status: "completed" },
]

export default function ResellerEarningsPage() {
  const [activeTab, setActiveTab] = useState("commissions")

  const totalEarnings = earningsHistory.reduce((sum, item) => sum + item.commission, 0)
  const paidEarnings = earningsHistory
    .filter((e) => e.status === "paid")
    .reduce((sum, item) => sum + item.commission, 0)
  const pendingEarnings = earningsHistory
    .filter((e) => e.status === "pending")
    .reduce((sum, item) => sum + item.commission, 0)

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
          <p className="text-slate-500 mt-1">Track your commissions and manage withdrawals</p>
        </div>
        <Button className="bg-cyan-500 hover:bg-cyan-600">
          <Wallet className="mr-2 h-4 w-4" />
          Request Payout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalEarnings)}</div>
            <p className="text-xs text-slate-500 mt-1">Lifetime commissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paidEarnings)}</div>
            <p className="text-xs text-slate-500 mt-1">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingEarnings)}</div>
            <p className="text-xs text-slate-500 mt-1">Processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Commission Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5%</div>
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
          Commission History
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
                <CardTitle>Commission Breakdown</CardTitle>
                <CardDescription>All earnings from your referral link</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => exportData(earningsHistory, "commissions.csv")}>
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
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Bundle</TableHead>
                  <TableHead className="text-right">Order Amount</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earningsHistory.map((earning) => (
                  <TableRow key={earning.id}>
                    <TableCell className="text-slate-500">{earning.date}</TableCell>
                    <TableCell className="font-medium">{earning.orderId}</TableCell>
                    <TableCell className="font-mono text-sm">{earning.customer}</TableCell>
                    <TableCell>{earning.bundle}</TableCell>
                    <TableCell className="text-right">{formatCurrency(earning.orderAmount)}</TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      +{formatCurrency(earning.commission)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={earning.status === "paid" ? "default" : "secondary"}
                        className={
                          earning.status === "paid" ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 text-white"
                        }
                      >
                        {earning.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              <Button variant="outline" size="sm" onClick={() => exportData(payoutHistory, "payouts.csv")}>
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
                {payoutHistory.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="text-slate-500">{payout.date}</TableCell>
                    <TableCell className="font-medium">{payout.reference}</TableCell>
                    <TableCell>{payout.method}</TableCell>
                    <TableCell className="text-right font-bold">
                      <span className="flex items-center justify-end gap-1">
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                        {formatCurrency(payout.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500 hover:bg-green-600">{payout.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
