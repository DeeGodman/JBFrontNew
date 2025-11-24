"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"

// Mock Complaints
const initialComplaints = [
  { id: "TICKET-1", user: "Reseller: John Doe", issue: "Payment not verified", status: "open", date: "1 hour ago" },
  { id: "TICKET-2", user: "Customer: 024...", issue: "Data not received", status: "resolved", date: "1 day ago" },
]

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState(initialComplaints)

  const resolveTicket = (id) => {
    setComplaints(complaints.map((c) => (c.id === id ? { ...c, status: "resolved" } : c)))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Complaints Center</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {complaints.map((ticket) => (
            <Card key={ticket.id} className="cursor-pointer hover:border-blue-500 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{ticket.id}</CardTitle>
                    <CardDescription>
                      {ticket.date} • {ticket.user}
                    </CardDescription>
                  </div>
                  <Badge variant={ticket.status === "resolved" ? "default" : "destructive"}>{ticket.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{ticket.issue}</p>
                {ticket.status === "open" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-4 w-full bg-transparent"
                    onClick={() => resolveTicket(ticket.id)}
                  >
                    Mark Resolved
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
            <CardDescription>Select a ticket to view conversation.</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-slate-500 py-12">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No ticket selected</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
