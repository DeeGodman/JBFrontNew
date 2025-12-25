"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const TransactionContext = createContext(null);

//test

export function TransactionProvider({ children }) {
  console.log("🔵 TransactionProvider mounted");

  const fetchTransactions = async ({
    page = 1,
    limit = 10,
    status = "",
    network = "",
    search = "",
    resellerCode = "",
    startDate = "",
    endDate = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = {}) => {
    console.log("🟢 fetchTransactions called");

    try {
      // Build query params
      const params = new URLSearchParams();
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);
      if (status) params.append("status", status);
      if (network) params.append("network", network);
      if (search) params.append("search", search);
      if (resellerCode) params.append("resellerCode", resellerCode);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (sortBy) params.append("sortBy", sortBy);
      if (sortOrder) params.append("sortOrder", sortOrder);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          credentials: "include",
        },
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch transactions");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch transactions");
      }

      console.log("TRANSACTION DATA", data);

      return data.data;
    } catch (error) {
      console.error("Fetch transactions error:", error.message);
      toast.error(error.message || "Failed to load transactions");
      throw error;
    }
  };

  const {
    data: transactionData,
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => fetchTransactions(),
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Poll every 30 seconds
    refetchOnWindowFocus: true, // Refetch when user comes back to tab
  });

  // Extract data for easier access
  const transactions = transactionData?.transactions || [];
  const analytics = transactionData?.analytics || null;
  const pagination = transactionData?.pagination || null;

  console.log("TRANSACTIONS", transactions);
  console.log("ANALYTICS", analytics);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        analytics,
        pagination,
        isLoadingTransactions,
        isErrorTransactions,
        refetchTransactions,
        fetchTransactions, // Expose for custom queries
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within TransactionProvider");
  }
  return context;
}
