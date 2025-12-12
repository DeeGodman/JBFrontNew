"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, CheckCircle, TrendingUp, Users, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/utils"



//IMPORTS I ADDED MYSELF
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"










export default function ResellerDashboard() {
  const [copied, setCopied] = useState(false)


  // function for actually getting referral link from backend

const fetchResellerLink = async () => {

       const userId = "6939e7a48945df1d67c26f00"; // manually for now

  try {
   
    //I will replace this with the BASE_URL from .env later
    const response = await fetch(`https://2c8186ee0c04.ngrok-free.app/api/v1/users/reseller-link?userId=${userId}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
         "ngrok-skip-browser-warning": "true"
       },


       //doing userID manually for now, will replace with auth token later
   
    });

    // Handle non-2xx errors
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Something went wrong");
    }

    // Parse JSON
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch referral link");
    }

    
    console.log("Fetched Link", data.referralURL);

    return data; 
    //  { success, message, referralURL }
  } catch (error) {
    console.error("Fetch referralLink Error:", error.message);
    toast.error(error.message || "Unexpected error");
    throw error;
  }
};


  // useQuery hook
const {
  data,
  isLoading,
  isError,
  refetch,
} = useQuery({
  queryKey: ["referralLink"],
  queryFn: fetchResellerLink,
});

console.log("This is current data:", data);








  const referralLink = data?.referralURL 

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
        <Card className="w-full md:w-auto min-w-0 bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-blue-600 mb-1">Your Referral Link</p>
              <div className="flex items-center gap-2 bg-white rounded-md border px-3 py-2 w-full">
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
            <CardTitle className="text-sm font-medium text-slate-500">Commission Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">~{formatCurrency(5.0)}</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                Average per bundle
              </p>
              <Button variant="link" className="h-auto p-0 text-xs text-blue-600" asChild>
                <a href="/reseller/pricing">Manage</a>
              </Button>
            </div>
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead className="min-w-[120px]">Bundle</TableHead>
                  <TableHead>Order Amount</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: 1, date: "Oct 19, 2024", orderId: "ORD-881", bundle: "5GB MTN Bundle", amount: 55, commission: 5 },
                  { id: 2, date: "Oct 18, 2024", orderId: "ORD-882", bundle: "2GB Telecel Bundle", amount: 27, commission: 5 },
                  { id: 3, date: "Oct 17, 2024", orderId: "ORD-883", bundle: "10GB MTN Bundle", amount: 105, commission: 10 },
                  { id: 4, date: "Oct 16, 2024", orderId: "ORD-884", bundle: "1GB AT Bundle", amount: 14, commission: 2 },
                  { id: 5, date: "Oct 15, 2024", orderId: "ORD-885", bundle: "5GB AT Bundle", amount: 52, commission: 7 },
                ].map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-slate-500 whitespace-nowrap">{item.date}</TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{item.orderId}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.bundle}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatCurrency(item.amount)}</TableCell>
                    <TableCell className="text-right font-bold text-green-600 whitespace-nowrap">+{formatCurrency(item.commission)}</TableCell>
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
