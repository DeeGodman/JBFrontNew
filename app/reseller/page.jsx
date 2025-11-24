"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, CheckCircle, TrendingUp, Users, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function ResellerDashboard() {
  const [copied, setCopied] = useState(false)
  const referralLink = "https://joybundle.com/buy?ref=RES-001"

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Welcome & Link Section */}
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Track your sales and commissions.</p>
        </div>
        <Card className="w-full md:w-auto min-w-[400px] bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-blue-600 mb-1">Your Referral Link</p>
              <div className="flex items-center gap-2 bg-white rounded-md border px-3 py-2">
                <code className="text-sm flex-1 truncate">{referralLink}</code>
              </div>
            </div>
            <Button size="icon" onClick={copyLink} className={copied ? "bg-green-600 hover:bg-green-700" : ""}>
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(1250.0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-medium">+18%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Orders</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86</div>
            <p className="text-xs text-muted-foreground mt-1">Across all networks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Commission Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5%</div>
            <Badge variant="secondary" className="mt-1">
              Silver Tier
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recent Commissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Commissions</CardTitle>
          <CardDescription>Latest earnings from your referral link.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Bundle</TableHead>
                <TableHead>Order Amount</TableHead>
                <TableHead className="text-right">Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell className="text-slate-500">Oct {20 - i}, 2024</TableCell>
                  <TableCell className="font-medium">ORD-88{i}</TableCell>
                  <TableCell>5GB MTN Bundle</TableCell>
                  <TableCell>{formatCurrency(60)}</TableCell>
                  <TableCell className="text-right font-bold text-green-600">+{formatCurrency(3.0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
