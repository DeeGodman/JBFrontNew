"use client"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, X, MoreHorizontal, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

// Mock Data
const initialResellers = [
  { id: "RES-001", name: "John Doe", email: "john@example.com", status: "active", sales: 1500, joined: "2024-01-15" },
  { id: "RES-002", name: "Jane Smith", email: "jane@example.com", status: "pending", sales: 0, joined: "2024-02-20" },
  {
    id: "RES-003",
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "active",
    sales: 3200,
    joined: "2023-12-10",
  },
  {
    id: "RES-004",
    name: "Sarah Williams",
    email: "sarah@example.com",
    status: "suspended",
    sales: 450,
    joined: "2024-01-05",
  },
]

export default function ResellersPage() {
  const [resellers, setResellers] = useState(initialResellers)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const { toast } = useToast()

  const updateStatus = (id, newStatus) => {
    setResellers(resellers.map((r) => (r.id === id ? { ...r, status: newStatus } : r)))
  }

  const handleInvite = () => {
    toast({
      title: "Invitation Sent",
      description: `An invite has been sent to ${inviteEmail}`,
    })
    setInviteEmail("")
    setIsInviteOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Reseller Management</h2>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite Reseller
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[420px] bg-white/95 shadow-2xl border border-slate-200">
            <DialogHeader>
              <DialogTitle>Invite New Reseller</DialogTitle>
              <DialogDescription>Send an invitation email to add a new reseller to your platform.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="reseller@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="mt-2 flex flex-row justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsInviteOpen(false)}
                className="min-w-[90px] justify-center"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInvite}
                className="min-w-[130px] justify-center"
              >
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Resellers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {resellers.filter((r) => r.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Sales Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS 5,150</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Resellers</CardTitle>
          <CardDescription>Manage reseller accounts and approvals.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resellers.map((reseller) => (
                <TableRow key={reseller.id}>
                  <TableCell className="font-medium">{reseller.name}</TableCell>
                  <TableCell>{reseller.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        reseller.status === "active"
                          ? "default"
                          : reseller.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className={
                        reseller.status === "active"
                          ? "bg-green-500 hover:bg-green-600"
                          : reseller.status === "pending"
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : ""
                      }
                    >
                      {reseller.status}
                    </Badge>
                  </TableCell>
                  <TableCell>GHS {reseller.sales}</TableCell>
                  <TableCell>{reseller.joined}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {reseller.status === "pending" && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-green-600 hover:bg-green-50"
                            title="Approve"
                            onClick={() => updateStatus(reseller.id, "active")}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:bg-red-50"
                            title="Reject"
                            onClick={() => updateStatus(reseller.id, "suspended")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
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
