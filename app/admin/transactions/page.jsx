"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Mock Transaction Data
const mockTransactions = [
  {
    id: "TXN-782930",
    date: "2023-11-22 10:45 AM",
    customer: "024 555 0199",
    amount: 15.0,
    method: "MTN MoMo",
    type: "Purchase",
    status: "successful",
    reference: "MOMO-123456789",
  },
  {
    id: "TXN-782931",
    date: "2023-11-22 11:12 AM",
    customer: "050 555 0200",
    amount: 28.0,
    method: "Vodafone Cash",
    type: "Purchase",
    status: "successful",
    reference: "VODA-987654321",
  },
  {
    id: "TXN-782932",
    date: "2023-11-22 11:30 AM",
    customer: "027 555 0300",
    amount: 100.0,
    method: "AirtelTigo Money",
    type: "Purchase",
    status: "failed",
    reference: "AIR-456123789",
  },
  {
    id: "TXN-782933",
    date: "2023-11-22 12:05 PM",
    customer: "Reseller: John Doe",
    amount: 500.0,
    method: "Wallet Top-up",
    type: "Credit",
    status: "successful",
    reference: "SYS-99887766",
  },
]

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">Immutable ledger of all payments and wallet movements.</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="w-4 h-4" />
          Export Ledger
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View and search across all network transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search reference, phone, or ID..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Customer/Entity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                    <TableCell className="text-xs text-slate-500">{txn.date}</TableCell>
                    <TableCell>{txn.customer}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{txn.type}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{txn.method}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(txn.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          txn.status === "successful"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }
                        variant="secondary"
                      >
                        {txn.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
