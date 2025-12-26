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

  // --- Bulk Action States ---
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionTargetIds, setActionTargetIds] = useState([]);

  const queryClient = useQueryClient();
  const itemsPerPage = 10;

  const {
    transactions: contextTransactions,
    analytics,
    isLoadingTransactions,
    isErrorTransactions,
    refetchTransactions,
  } = useTransactions();

  // --- Bulk Selection Logic ---
  const toggleSelectAll = (visibleTxns) => {
    if (selectedIds.length === visibleTxns.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleTxns.map((t) => t.transactionId));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // --- Mutations (Modified for Bulk) ---
  const deliveredMutation = useMutation({
    mutationFn: async (transactionIds) => {
      const ids = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds];
      return Promise.all(
        ids.map(async (id) => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/${id}/delivery`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
              },
              credentials: "include",
              body: JSON.stringify({ deliveryStatus: "delivered" }),
            },
          );
          if (!response.ok) throw new Error(`Failed to update ${id}`);
          return response.json();
        }),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);
      refetchTransactions();
      toast.success(`${actionTargetIds.length} order(s) marked as delivered`);
      setIsConfirmDeliveryDialogOpen(false);
      setSelectedTransaction(null);
      setSelectedIds([]);
    },
    onError: (error) => toast.error(error.message || "Failed to update orders"),
  });

  const failedMutation = useMutation({
    mutationFn: async ({ transactionIds, reason }) => {
      const ids = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds];
      return Promise.all(
        ids.map(async (id) => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/${id}/delivery`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
              },
              credentials: "include",
              body: JSON.stringify({
                deliveryStatus: "pending", // Reset to pending as requested
                failureReason: reason,
              }),
            },
          );
          if (!response.ok) throw new Error(`Failed to update ${id}`);
          return response.json();
        }),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);
      refetchTransactions();
      toast.success(`${actionTargetIds.length} order(s) reset to pending`);
      setIsMarkFailedDialogOpen(false);
      setSelectedTransaction(null);
      setFailureReason("");
      setSelectedIds([]);
    },
    onError: (error) => toast.error(error.message || "Failed to update orders"),
  });

  // --- Filtering & Pagination ---
  const filteredTransactions = contextTransactions.filter((txn) => {
    if (txn.status !== "success") return false;
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      if (
        !(
          txn.transactionId?.toLowerCase().includes(s) ||
          txn.customer?.includes(searchQuery) ||
          txn.bundleName?.toLowerCase().includes(s)
        )
      )
        return false;
    }
    if (
      networkFilter !== "all" &&
      txn.network?.toUpperCase() !== networkFilter.toUpperCase()
    )
      return false;
    if (
      deliveryStatusFilter !== "all" &&
      txn.deliveryStatus !== deliveryStatusFilter
    )
      return false;
    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let comp = 0;
    if (sortBy === "date") comp = new Date(b.dateTime) - new Date(a.dateTime);
    else if (sortBy === "amount") comp = b.amount - a.amount;
    else if (sortBy === "profit") comp = b.JBProfit - a.JBProfit;
    return sortOrder === "asc" ? -comp : comp;
  });

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // --- Helpers & Handlers ---
  const getNetworkColor = (network) => {
    const colors = {
      MTN: "bg-yellow-100 text-yellow-600",
      AT: "bg-red-100 text-red-600",
      VODAFONE: "bg-red-100 text-red-600",
      TELECEL: "bg-blue-100 text-blue-600",
    };
    return colors[network?.toUpperCase()] || "bg-gray-100 text-gray-600";
  };

  const handleMarkDelivered = (transaction) => {
    setSelectedTransaction(transaction);
    const isBulk = selectedIds.includes(transaction.transactionId);
    setActionTargetIds(isBulk ? selectedIds : [transaction.transactionId]);
    setIsConfirmDeliveryDialogOpen(true);
  };

  const handleMarkFailed = (transaction) => {
    setSelectedTransaction(transaction);
    const isBulk = selectedIds.includes(transaction.transactionId);
    setActionTargetIds(isBulk ? selectedIds : [transaction.transactionId]);
    setIsMarkFailedDialogOpen(true);
  };

  const confirmDelivery = () => deliveredMutation.mutate(actionTargetIds);
  const confirmFailed = () => {
    if (!failureReason.trim())
      return toast.error("Please provide a failure reason");
    failedMutation.mutate({
      transactionIds: actionTargetIds,
      reason: failureReason,
    });
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      success: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
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
      delivered: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      failed: "bg-red-100 text-red-700",
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

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/export-pending`,
        {
          method: "GET",
          headers: { "ngrok-skip-browser-warning": "true" },
          credentials: "include",
        },
      );
      if (res.status === 404)
        return toast.error("No pending orders to export.");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
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
    } catch (e) {
      toast.error("Failed to export orders");
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            t: "Total Revenue",
            v: analytics?.totalRevenue,
            i: TrendingUp,
            c: true,
          },
          {
            t: "Total Orders",
            v: analytics?.totalOrders,
            i: CheckCircle,
            c: false,
          },
          {
            t: "Active Orders",
            v: analytics?.activeOrders,
            i: Clock,
            c: false,
          },
        ].map((s) => (
          <Card key={s.t}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {s.t}
              </CardTitle>
              <s.i className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              ) : (
                <div className="text-2xl font-bold">
                  {s.c ? formatCurrency(s.v || 0) : s.v || 0}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
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
              <div>
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
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                  )}{" "}
                  Export Pending
                </Button>
                <Button
                  onClick={() => refetchTransactions()}
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2"
                  disabled={isLoadingTransactions}
                >
                  <ArrowUpDown className="h-3.5 w-3.5" /> Refresh
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
                  <TableHead className="w-[40px] pl-4">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300"
                      checked={
                        paginatedTransactions.length > 0 &&
                        selectedIds.length === paginatedTransactions.length
                      }
                      onChange={() => toggleSelectAll(paginatedTransactions)}
                    />
                  </TableHead>
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
                    <TableCell colSpan={11} className="text-center py-12">
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
                    <TableCell colSpan={11} className="text-center py-12">
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
                      colSpan={11}
                      className="text-center py-8 text-slate-500"
                    >
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.transactionId}>
                      <TableCell className="pl-4">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300"
                          checked={selectedIds.includes(
                            transaction.transactionId,
                          )}
                          onChange={() =>
                            toggleSelectRow(transaction.transactionId)
                          }
                        />
                      </TableCell>
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
                          <TrendingUp className="h-3 w-3" />{" "}
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
                          {((transaction.status === "success" &&
                            transaction.deliveryStatus === "pending") ||
                            transaction.deliveryStatus === "processing") && (
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
                          )}
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
          {totalPages > 1 && !isLoadingTransactions && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-slate-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, sortedTransactions.length)}{" "}
                of {sortedTransactions.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1 hover:bg-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let p =
                      totalPages <= 5
                        ? i + 1
                        : currentPage <= 3
                          ? i + 1
                          : currentPage >= totalPages - 2
                            ? totalPages - 4 + i
                            : currentPage - 2 + i;
                    return (
                      <Button
                        key={p}
                        variant={currentPage === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(p)}
                        className="w-8 h-8 p-0"
                      >
                        {p}
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
                  Next <ChevronRight className="w-4 h-4" />
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
              {actionTargetIds.length > 1
                ? `Confirm that ${actionTargetIds.length} data bundles have been delivered.`
                : "Confirm that the data bundle has been successfully delivered to the customer."}
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && actionTargetIds.length === 1 && (
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
              Orders will be reset to <strong>Pending</strong>. Provide a reason
              for the failure.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              {actionTargetIds.length === 1 && (
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
              )}
              <div className="space-y-2">
                <Label htmlFor="failure-reason">Failure Reason *</Label>
                <Textarea
                  id="failure-reason"
                  placeholder="Enter failure reason..."
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
