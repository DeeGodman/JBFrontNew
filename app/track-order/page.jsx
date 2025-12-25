"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Search,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Home,
  Phone,
  Calendar,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://condescending-charlott-discernible.ngrok-free.dev/api/v1";

// API function to track orders
const trackOrdersByPhone = async (phoneNumber, page = 1) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/track?phoneNumber=${phoneNumber}&page=${page}&limit=10`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to track orders");
  }

  const data = await response.json();
  return data;
};

export default function TrackOrderPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  // Fetch orders using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["trackOrders", searchPhone, page],
    queryFn: () => trackOrdersByPhone(searchPhone, page),
    enabled: !!searchPhone,
    retry: false,
  });

  const handlePhoneSubmit = (e) => {
    e.preventDefault();

    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setSearchPhone(phoneNumber);
    setPage(1);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      delivered: { color: "bg-green-500", icon: CheckCircle },
      processing: { color: "bg-yellow-500", icon: Clock },
      pending: { color: "bg-blue-500", icon: Package },
      failed: { color: "bg-red-500", icon: XCircle },
    };

    const config = statusMap[status] || { color: "bg-gray-500", icon: Package };
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const orderHistory = data?.data?.orders || [];
  const pagination = data?.data?.pagination;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Logo" className="h-8 w-8 rounded-md" />
            <span className="font-bold text-xl text-slate-900 hidden sm:inline-block">
              Joy Data Bundles
            </span>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="mr-2 h-4 w-4" />
              Back Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="text-center max-w-2xl mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-slate-600">
            Enter your Phone Number to check the current status of your data
            bundle delivery.
          </p>
        </div>

        <Card className="w-full max-w-md shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Order Lookup</CardTitle>
            <CardDescription>Search by Phone Number</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="e.g. 0574035088"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isLoading}
                    className="pl-8"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handlePhoneSubmit(e);
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={handlePhoneSubmit}
                  disabled={isLoading || !phoneNumber}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Track"
                  )}
                </Button>
              </div>

              {isError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  {error?.message || "Failed to fetch orders"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {searchPhone && (
          <Card className="w-full max-w-3xl shadow-lg">
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>
                Showing orders for {searchPhone}
                {pagination && ` (${pagination.totalOrders} total)`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 text-cyan-500 mx-auto mb-4 animate-spin" />
                  <p className="text-slate-500">Loading orders...</p>
                </div>
              ) : orderHistory.length > 0 ? (
                <>
                  {orderHistory.map((order) => (
                    <div
                      key={order._id}
                      className="p-4 border rounded-lg hover:border-cyan-500 hover:bg-cyan-50/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 text-lg">
                            {order.bundleName}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            {order.metadata?.bundleData} •{" "}
                            {order.metadata?.network?.toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.deliveryStatus || order.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm border-t pt-3">
                        <div>
                          <p className="text-slate-500">Amount</p>
                          <p className="font-medium text-slate-900">
                            GHS {order.amount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Order Date</p>
                          <p className="font-medium text-slate-900">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        {order.deliveredAt && (
                          <div className="col-span-2">
                            <p className="text-slate-500">Delivered</p>
                            <p className="font-medium text-green-600">
                              {formatDate(order.deliveredAt)}
                            </p>
                          </div>
                        )}
                        {order.failureReason && (
                          <div className="col-span-2">
                            <p className="text-slate-500">Failure Reason</p>
                            <p className="font-medium text-red-600">
                              {order.failureReason}
                            </p>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mt-3">
                        Order ID: {order._id}
                      </p>
                    </div>
                  ))}

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={!pagination.hasPrevPage || isLoading}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>

                      <span className="text-sm text-slate-600">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!pagination.hasNextPage || isLoading}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">
                    No orders found for this phone number
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    Please check your phone number and try again
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="py-6 border-t bg-white text-center text-sm text-slate-500">
        <div className="container mx-auto px-4">
          <p>&copy; 2025 Joy Data Bundles. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
