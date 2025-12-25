"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  TrendingUp,
  ArrowUpDown,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useTransactions } from "../../contexts/TransactionContext";

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isConfirmDeliveryDialogOpen, setIsConfirmDeliveryDialogOpen] =
    useState(false);
  const [isMarkFailedDialogOpen, setIsMarkFailedDialogOpen] = useState(false);
  const [failureReason, setFailureReason] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const queryClient = useQueryClient();
  const itemsPerPage = 10;

  // Get data from context
  const {
    transactions: contextTransactions,
    analytics,
    isLoadingTransactions,
    isErrorTransactions,
    refetchTransactions,
  } = useTransactions();

  // Mark as delivered mutation
  const deliveredMutation = useMutation({
    mutationFn: async (transactionId) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/${transactionId}/delivery`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          credentials: "include",
          body: JSON.stringify({
            deliveryStatus: "delivered",
          }),
        },
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to mark as delivered");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to mark as delivered");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);
      refetchTransactions();
      toast.success("Transaction marked as delivered");
      setIsConfirmDeliveryDialogOpen(false);
      setSelectedTransaction(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark as delivered");
    },
  });

  // Mark as failed mutation
  const failedMutation = useMutation({
    mutationFn: async ({ transactionId, reason }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/${transactionId}/delivery`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          credentials: "include",
          body: JSON.stringify({
            deliveryStatus: "failed",
            failureReason: reason,
          }),
        },
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to mark as failed");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to mark as failed");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);
      refetchTransactions();
      toast.success("Transaction marked as failed");
      setIsMarkFailedDialogOpen(false);
      setSelectedTransaction(null);
      setFailureReason("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark as failed");
    },
  });

  // Frontend filtering
  const filteredTransactions = contextTransactions.filter((txn) => {
    // Only show successful transactions with valid delivery statuses
    if (txn.status !== "success") return false;
    if (
      txn.deliveryStatus !== "pending" &&
      txn.deliveryStatus !== "delivered" &&
      txn.deliveryStatus !== "processing"
    )
      return false;

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        txn.transactionId?.toLowerCase().includes(searchLower) ||
        txn.customer?.includes(searchQuery) ||
        txn.bundleName?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Network filter
    if (
      networkFilter !== "all" &&
      txn.network?.toUpperCase() !== networkFilter.toUpperCase()
    ) {
      return false;
    }

    // Delivery status filter
    if (
      deliveryStatusFilter !== "all" &&
      txn.deliveryStatus !== deliveryStatusFilter
    ) {
      return false;
    }

    return true;
  });

  // Frontend sorting
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case "date":
        compareValue = new Date(b.dateTime) - new Date(a.dateTime);
        break;
      case "amount":
        compareValue = b.amount - a.amount;
        break;
      case "profit":
        compareValue = b.JBProfit - a.JBProfit;
        break;
      default:
        compareValue = new Date(b.dateTime) - new Date(a.dateTime);
    }

    return sortOrder === "asc" ? -compareValue : compareValue;
  });

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  // Network colors
  const getNetworkColor = (network) => {
    const colors = {
      MTN: "bg-yellow-100 text-yellow-600",
      AT: "bg-red-100 text-red-600",
      VODAFONE: "bg-red-100 text-red-600",
      TELECEL: "bg-blue-100 text-blue-600",
    };
    return colors[network?.toUpperCase()] || "bg-gray-100 text-gray-600";
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const colors = {
      success: "bg-green-100 text-green-700 hover:bg-green-100",
      pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      failed: "bg-red-100 text-red-700 hover:bg-red-100",
    };

    return (
      <Badge
        className={colors[status?.toLowerCase()] || "bg-gray-100 text-gray-700"}
        variant="secondary"
      >
        {status}
      </Badge>
    );
  };

  const DeliveryStatusBadge = ({ status }) => {
    const colors = {
      delivered: "bg-green-100 text-green-700 hover:bg-green-100",
      pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      processing: "bg-blue-100 text-blue-700 hover:bg-blue-100",
      failed: "bg-red-100 text-red-700 hover:bg-red-100",
    };

    return (
      <Badge
        className={colors[status?.toLowerCase()] || "bg-gray-100 text-gray-700"}
        variant="secondary"
      >
        {status}
      </Badge>
    );
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsViewDialogOpen(true);
  };

  const handleMarkDelivered = (transaction) => {
    setSelectedTransaction(transaction);
    setIsConfirmDeliveryDialogOpen(true);
  };

  const handleMarkFailed = (transaction) => {
    setSelectedTransaction(transaction);
    setIsMarkFailedDialogOpen(true);
  };

  const confirmDelivery = () => {
    if (!selectedTransaction) return;
    deliveredMutation.mutate(selectedTransaction.transactionId);
  };

  const confirmFailed = () => {
    if (!selectedTransaction || !failureReason.trim()) {
      toast.error("Please provide a failure reason");
      return;
    }
    failedMutation.mutate({
      transactionId: selectedTransaction.transactionId,
      reason: failureReason,
    });
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/export-pending`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
          credentials: "include",
        },
      );

      if (response.status === 404) {
        toast.error("No pending orders to export.");
        return;
      }

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Orders exported and marked as processing!");
      refetchTransactions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to export orders");
    } finally {
      setIsExporting(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            All Transactions
          </h2>
          <p className="text-muted-foreground">
            Manage and monitor all data bundle transactions.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(analytics?.totalRevenue || 0)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Orders
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="text-2xl font-bold">
                {analytics?.totalOrders || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Active Orders
            </CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="text-2xl font-bold">
                {analytics?.activeOrders || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Cost
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="">
                <div className="text-2xl font-bold">
                  {formatCurrency(analytics?.totalCost || 0)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  JBCP: {formatCurrency(analytics?.totalActualJBCPCost || 0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  RSP: {formatCurrency(analytics?.totalResellerProfits || 0)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle>All Transactions</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Network Filter */}
              <Select value={networkFilter} onValueChange={setNetworkFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Networks</SelectItem>
                  <SelectItem value="MTN">MTN</SelectItem>
                  <SelectItem value="Telecel">Telecel</SelectItem>
                  <SelectItem value="AT">AT</SelectItem>
                </SelectContent>
              </Select>

              {/* Delivery Status Filter */}
              <Select
                value={deliveryStatusFilter}
                onValueChange={setDeliveryStatusFilter}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Delivery" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Delivery</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="profit">Profit</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>

              {/* Updated Buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2"
                  disabled={isExporting || isLoadingTransactions}
                >
                  {isExporting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  Export Pending
                </Button>

                <Button
                  onClick={() => refetchTransactions()}
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2"
                  disabled={isLoadingTransactions}
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">
                    Transaction ID
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Customer</TableHead>
                  <TableHead className="whitespace-nowrap">Bundle</TableHead>
                  <TableHead className="whitespace-nowrap">Network</TableHead>
                  <TableHead className="whitespace-nowrap">Amount</TableHead>
                  <TableHead className="whitespace-nowrap">Profit</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Delivery</TableHead>
                  <TableHead className="whitespace-nowrap">Time</TableHead>
                  <TableHead className="text-right whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingTransactions ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        <p className="text-slate-500">
                          Loading transactions...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isErrorTransactions ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <XCircle className="h-8 w-8 text-red-500" />
                        <p className="text-red-600 font-medium">
                          Failed to load transactions
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => refetchTransactions()}
                          className="mt-2"
                        >
                          Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-slate-500"
                    >
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.transactionId}>
                      <TableCell className="font-medium whitespace-nowrap font-mono text-xs">
                        {transaction.transactionId?.slice(-12) || "N/A"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {transaction.customer}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {transaction.bundleName}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={getNetworkColor(transaction.network)}
                        >
                          {transaction.network}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="flex items-center gap-1 font-medium text-green-600">
                          <TrendingUp className="h-3 w-3" />
                          {formatCurrency(transaction.JBProfit)}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <StatusBadge status={transaction.status} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <DeliveryStatusBadge
                          status={transaction.deliveryStatus}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap text-xs">
                        {formatDate(transaction.dateTime)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          {(transaction.status === "success" &&
                            transaction.deliveryStatus === "pending") ||
                          transaction.deliveryStatus === "processing" ? (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                title="Mark Delivered"
                                onClick={() => handleMarkDelivered(transaction)}
                                disabled={deliveredMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Mark Failed"
                                onClick={() => handleMarkFailed(transaction)}
                                disabled={failedMutation.isPending}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          ) : null}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleViewDetails(transaction)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && !isLoadingTransactions && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-slate-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, sortedTransactions.length)} of{" "}
                {sortedTransactions.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1 hover:bg-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="gap-1 hover:bg-slate-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information about this transaction.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Transaction ID</p>
                  <p className="font-mono font-medium text-xs">
                    {selectedTransaction.transactionId}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Amount</p>
                  <p className="font-medium text-lg">
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Customer</p>
                  <p className="font-medium">{selectedTransaction.customer}</p>
                </div>
                <div>
                  <p className="text-slate-500">Network</p>
                  <Badge
                    variant="outline"
                    className={getNetworkColor(selectedTransaction.network)}
                  >
                    {selectedTransaction.network}
                  </Badge>
                </div>
                <div>
                  <p className="text-slate-500">Bundle</p>
                  <p className="font-medium">
                    {selectedTransaction.bundleName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedTransaction.bundleData}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Profit</p>
                  <p className="font-medium text-green-600">
                    {formatCurrency(selectedTransaction.JBProfit)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Reseller</p>
                  <p className="font-medium">
                    {selectedTransaction.resellerName}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Reseller Profit</p>
                  <p className="font-medium">
                    {formatCurrency(selectedTransaction.resellerProfit)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <StatusBadge status={selectedTransaction.status} />
                </div>
                <div>
                  <p className="text-slate-500">Delivery Status</p>
                  <DeliveryStatusBadge
                    status={selectedTransaction.deliveryStatus}
                  />
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500">Date & Time</p>
                  <p className="font-medium">
                    {formatDate(selectedTransaction.dateTime)}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delivery Dialog */}
      <Dialog
        open={isConfirmDeliveryDialogOpen}
        onOpenChange={setIsConfirmDeliveryDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delivery</DialogTitle>
            <DialogDescription>
              Confirm that the data bundle has been successfully delivered to
              the customer.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="py-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {selectedTransaction.customer}
                    </p>
                    <Badge
                      variant="outline"
                      className={getNetworkColor(selectedTransaction.network)}
                    >
                      {selectedTransaction.network}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">
                    {selectedTransaction.bundleName}
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDeliveryDialogOpen(false)}
              disabled={deliveredMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={confirmDelivery}
              disabled={deliveredMutation.isPending}
            >
              {deliveredMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Delivery
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Failed Dialog */}
      <Dialog
        open={isMarkFailedDialogOpen}
        onOpenChange={setIsMarkFailedDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Delivery as Failed</DialogTitle>
            <DialogDescription>
              Please provide a reason why this delivery failed. The customer and
              reseller will be notified.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {selectedTransaction.customer}
                    </p>
                    <Badge
                      variant="outline"
                      className={getNetworkColor(selectedTransaction.network)}
                    >
                      {selectedTransaction.network}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">
                    {selectedTransaction.bundleName}
                  </p>
                  <p className="text-xl font-bold text-red-600">
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="failure-reason">Failure Reason *</Label>
                <Textarea
                  id="failure-reason"
                  placeholder="Enter the reason for delivery failure..."
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  disabled={failedMutation.isPending}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              className="outline hover:bg-slate-300"
              onClick={() => setIsMarkFailedDialogOpen(false)}
              disabled={failedMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="outline bg-red-500 text-white hover:bg-red-900"
              onClick={confirmFailed}
              disabled={failedMutation.isPending || !failureReason.trim()}
            >
              {failedMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Mark as Failed
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
