"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, RefreshCw, CheckCircle, XCircle, Eye, Download } from "lucide-react"

// Mock Data
const initialOrders = [
  {
    id: "ORD-001",
    customer: "024 555 0101",
    bundle: "5GB MTN",
    amount: "GHS 60.00",
    status: "pending",
    date: "2 mins ago",
  },
  {
    id: "ORD-002",
    customer: "050 123 4567",
    bundle: "10GB Telecel",
    amount: "GHS 100.00",
    status: "completed",
    date: "5 mins ago",
  },
  {
    id: "ORD-003",
    customer: "024 987 6543",
    bundle: "1GB MTN",
    amount: "GHS 15.00",
    status: "failed",
    date: "10 mins ago",
  },
  {
    id: "ORD-004",
    customer: "027 111 2222",
    bundle: "2GB AT",
    amount: "GHS 25.00",
    status: "completed",
    date: "15 mins ago",
  },
  {
    id: "ORD-005",
    customer: "055 555 5555",
    bundle: "5GB MTN",
    amount: "GHS 60.00",
    status: "pending",
    date: "20 mins ago",
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders)

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)))
  }

  const exportCSV = () => {
    const headers = ["Order ID", "Customer", "Bundle", "Amount", "Status", "Time"]
    const csvContent = [
      headers.join(","),
      ...orders.map((o) => [o.id, o.customer, o.bundle, o.amount, o.status, o.date].join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "orders-export.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Order Fulfillment</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>All Transactions</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search phone or order ID" className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Bundle Details</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.bundle}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "failed"
                            ? "destructive"
                            : "secondary" // Pending
                      }
                      className={
                        order.status === "completed"
                          ? "bg-green-500 hover:bg-green-600"
                          : order.status === "pending"
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : ""
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === "pending" && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Mark Fulfilled"
                            onClick={() => handleStatusChange(order.id, "completed")}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Mark Failed"
                            onClick={() => handleStatusChange(order.id, "failed")}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {order.status === "failed" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-blue-600"
                          title="Retry"
                          onClick={() => handleStatusChange(order.id, "pending")}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
