"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingCart, CreditCard, Activity, RefreshCw, AlertTriangle, Lock } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTransactions } from "../contexts/TransactionContext"

export default function AdminDashboard() {
  const {
    transactions,
    analytics,
    pagination,
    isLoadingTransactions,
    isErrorTransactions,
    refetchTransactions,
    fetchTransactions
  } = useTransactions()

  // Calculate success rate from analytics
  const successRate = analytics?.totalOrders > 0 
    ? ((analytics.totalOrders / (analytics.totalOrders + (pagination?.totalItems - analytics.totalOrders || 0))) * 100).toFixed(1)
    : "0.0"

  // Calculate your take (80% of total profit) and developer take (20% of total profit)
  const yourTake = analytics?.totalJBProfit ? (analytics.totalJBProfit - analytics.developersProfit) : 0
  const developerTake = analytics?.developersProfit || 0

  const stats = [
    {
      title: "Total Revenue",
      value: analytics?.totalRevenue || 0,
      icon: CreditCard,
      isCurrency: true,
    },
    {
      title: "Active Orders",
      value: analytics?.activeOrders || 0,
      icon: ShoppingCart,
      isCurrency: false,
    },
    {
      title: "Total Orders",
      value: analytics?.totalOrders || 0,
      icon: Users,
      isCurrency: false,
    },
    {
      title: "Total Profit",
      value: analytics?.totalJBProfit || 0,
      subtitle: `JBP: ${formatCurrency(yourTake)} | DevP: ${formatCurrency(developerTake)}`,
      icon: Activity,
      isCurrency: true,
    },
  ]

  // Get latest 5 successful transactions
  const latestTransactions = transactions?.filter(txn => txn.status === 'success').slice(0, 5) || []

  // Network colors
  const getNetworkColor = (network) => {
    const colors = {
      MTN: "bg-yellow-100 text-yellow-600",
      AT: "bg-red-100 text-red-600",
      VODAFONE: "bg-red-100 text-red-600",
      TELECEL: "bg-blue-100 text-blue-600",
    }
    return colors[network?.toUpperCase()] || "bg-gray-100 text-gray-600"
  }

  // Status colors
  const getStatusColor = (status) => {
    const colors = {
      success: "text-green-600",
      pending: "text-yellow-600",
      failed: "text-red-600",
    }
    return colors[status?.toLowerCase()] || "text-gray-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex bg-transparent"
            onClick={() => refetchTransactions()}
            disabled={isLoadingTransactions}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingTransactions ? 'animate-spin' : ''}`} /> 
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="space-y-2">
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                  {stat.subtitle && <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />}
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {stat.isCurrency ? formatCurrency(stat.value) : stat.value}
                  </div>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.subtitle}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 transactions from customers</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                      <div>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-32 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-20 bg-gray-200 rounded mb-2 ml-auto" />
                      <div className="h-3 w-16 bg-gray-200 rounded ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isErrorTransactions ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-sm text-slate-500 mb-4">Failed to load transactions</p>
                <Button onClick={() => refetchTransactions()} variant="outline" size="sm">
                  Try Again
                </Button>
              </div>
            ) : latestTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShoppingCart className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-sm text-slate-500">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {latestTransactions.map((transaction) => (
                  <div 
                    key={transaction.transactionId} 
                    className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${getNetworkColor(transaction.network)}`}>
                        {transaction.network}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{transaction.customer}</p>
                        <p className="text-xs text-slate-500">{transaction.bundleName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(transaction.amount)}</p>
                      <p className={`text-xs capitalize ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="col-span-3 space-y-4">
          <Card className="relative">
            <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <Lock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">Coming Soon</p>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                <AlertTriangle className="mr-2 h-4 w-4" /> Resolve New Complaints
              </Button>
            </CardContent>
          </Card>

          <Card className="relative">
            <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <Lock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">Coming Soon</p>
              </div>
            </div>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>API & Service Status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">MTN API</span>
                <span className="flex h-2 w-2 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Telecel API</span>
                <span className="flex h-2 w-2 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AT API</span>
                <span className="flex h-2 w-2 rounded-full bg-yellow-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">SMS Service</span>
                <span className="flex h-2 w-2 rounded-full bg-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}