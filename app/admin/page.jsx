"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingCart, CreditCard, Activity, RefreshCw, AlertTriangle } from "lucide-react" // Added icons
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button" // Added Button
import Link from "next/link" // Added Link

// Mock Stats
const stats = [
  {
    title: "Total Revenue",
    value: 24500,
    change: "+12%",
    icon: CreditCard,
  },
  {
    title: "Active Orders",
    value: 145,
    change: "+5%",
    icon: ShoppingCart,
  },
  {
    title: "Active Resellers",
    value: 32,
    change: "+2",
    icon: Users,
  },
  {
    title: "Success Rate",
    value: "98.5%",
    change: "+0.5%",
    icon: Activity,
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex bg-transparent">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
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
              <div className="text-2xl font-bold">
                {typeof stat.value === "number" ? formatCurrency(stat.value) : stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 font-medium">{stat.change}</span> from last month
              </p>
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
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                      MTN
                    </div>
                    <div>
                      <p className="text-sm font-medium">024 555 010{i}</p>
                      <p className="text-xs text-slate-500">5GB Data Bundle</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">GHS 60.00</p>
                    <p className="text-xs text-green-600">Completed</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/admin/orders">
                  <RefreshCw className="mr-2 h-4 w-4" /> Retry Failed Orders
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/admin/complaints">
                  <AlertTriangle className="mr-2 h-4 w-4" /> Resolve New Complaints
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
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
