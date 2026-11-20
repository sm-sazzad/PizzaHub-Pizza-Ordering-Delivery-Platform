"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCardIcon,
  CheckIcon,
  DollarSignIcon,
  SparklesIcon,
  SearchIcon,
  CalendarIcon,
  RefreshIcon,
} from "@/components/ui/Icons";
import { getTokenClient } from "@/lib/tokenAccess";
import { TableRowSkeleton } from "@/components/ui/Skeleton";

// 1. Simple Interface for Transaction Item
interface TransactionItem {
  _id: string;
  name?: string;
  vendorName?: string;
  email?: string;
  vendorEmail?: string;
  image?: string;
  amount?: number;
  plan?: string;
  subscriptionPlan?: string;
  stripeSessionId?: string;
  status?: string;
  createdAt?: string;
}

export default function AdminTransactionsPage() {
  // 2. State variables
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // 3. Fetch transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${serverUrl}/admin/transactions`, {
          headers: {
            authorization: `Bearer ${await getTokenClient()}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setTransactions(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load transactions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [reloadKey]);

  // 4. Calculate total revenue and filtered list
  const totalRevenue = transactions.reduce((sum, tx) => {
    return sum + (tx.amount || 29);
  }, 0);

  const filteredTransactions = transactions.filter((tx) => {
    const name = (tx.name || tx.vendorName || "").toLowerCase();
    const email = (tx.email || tx.vendorEmail || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
              Financial Ledger
            </span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-xs font-semibold text-stone-500">
              Vendor Subscriptions
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Subscription Transactions
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Verified Stripe subscription records and premium vendor upgrades.
          </p>
        </div>

        {/* Quick Refresh Button */}
        <button
          onClick={() => setReloadKey((prev) => prev + 1)}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold transition-colors w-fit"
        >
          <RefreshIcon size={14} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Total Transactions
          </p>
          <h3 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            {transactions.length}
          </h3>
        </div>

        <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Total Revenue
          </p>
          <h3 className="font-heading text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            ${totalRevenue.toFixed(2)}
          </h3>
        </div>

        <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Plan Price
          </p>
          <h3 className="font-heading text-2xl sm:text-3xl font-black text-amber-500">
            $29.00 <span className="text-xs font-normal text-stone-500">/ vendor</span>
          </h3>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
          <SearchIcon size={16} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by vendor name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
        />
      </div>

      {/* Transactions List */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left">
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={4} />
                ))}
              </tbody>
            </table>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <CreditCardIcon size={28} />
            </div>
            <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white">
              {searchQuery ? "No Matching Transactions" : "No Transactions Recorded"}
            </h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No transactions match "${searchQuery}". Try searching for another name or email.`
                : "When vendors complete Stripe subscription checkouts, verified records will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {filteredTransactions.map((tx) => {
              const userName = tx.name || tx.vendorName || "Premium Vendor";
              const userEmail = tx.email || tx.vendorEmail || "vendor@pizzahub.com";
              const userAmount = tx.amount || 29;
              const sessionId = tx.stripeSessionId || tx._id;
              const formattedDate = tx.createdAt
                ? new Date(tx.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Active Subscription";

              return (
                <div
                  key={tx._id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors"
                >
                  {/* Left: User Profile Image & Info */}
                  <div className="flex items-center gap-4">
                    {/* User Image Frame */}
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 shrink-0 flex items-center justify-center shadow-xs">
                      {tx.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={tx.image}
                          alt={userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-orange-500 text-white font-bold text-sm flex items-center justify-center">
                          {userName[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>

                    {/* Name, Badges, Email, Session ID */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h5 className="font-heading font-bold text-sm sm:text-base text-stone-900 dark:text-white">
                          {userName}
                        </h5>

                        {/* Plan Badge */}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 inline-flex items-center gap-1">
                          <SparklesIcon size={10} />
                          <span>Premium Tier</span>
                        </span>

                        {/* Status Badge */}
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 inline-flex items-center gap-1">
                          <CheckIcon size={10} />
                          <span>{tx.status || "Paid"}</span>
                        </span>
                      </div>

                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {userEmail}
                      </p>

                      <p className="text-[11px] text-stone-400 dark:text-stone-500 font-mono">
                        Ref ID: {sessionId}
                      </p>
                    </div>
                  </div>

                  {/* Right: Amount & Date */}
                  <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100 dark:border-stone-800 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                    <span className="font-heading text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 inline-flex items-center">
                      <DollarSignIcon size={18} className="text-emerald-500" />
                      <span>{userAmount.toFixed(2)}</span>
                    </span>

                    <span className="text-[11px] text-stone-400 dark:text-stone-500 inline-flex items-center gap-1.5 mt-0.5">
                      <CalendarIcon size={12} />
                      <span>{formattedDate}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
