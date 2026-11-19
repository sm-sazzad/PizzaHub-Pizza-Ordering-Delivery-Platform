"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCardIcon,
  CheckIcon,
  DollarSignIcon,
} from "@/components/ui/Icons";

interface TransactionItem {
  _id?: string;
  id?: string;
  vendorName: string;
  vendorEmail: string;
  stripeSessionId: string;
  amount: number;
  plan: string;
  status: "succeeded" | "pending" | "failed";
  createdAt: string;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${serverUrl}/admin/transactions`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.transactions || [];
          setTransactions(list);
        }
      } catch {
        // Backend not yet reachable or empty DB; keep empty state
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Financial Ledger
          </span>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <span className="text-xs font-semibold text-stone-500">
            Stripe Transactions
          </span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
          Subscription Transactions
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
          Audited Stripe webhook logs for vendor premium tier upgrades. Immutable billing history.
        </p>
      </div>

      {/* Content */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-stone-500">
              Loading transactions from ledger...
            </p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <CreditCardIcon size={28} />
            </div>
            <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white">
              No Transactions Recorded
            </h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              When vendors complete Stripe subscription checkouts, webhook events will be recorded here automatically.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {transactions.map((tx) => (
              <div
                key={tx._id || tx.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-heading font-bold text-sm text-stone-900 dark:text-white">
                      {tx.vendorName}
                    </h5>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 inline-flex items-center gap-1">
                      <CheckIcon size={10} />
                      <span>{tx.status}</span>
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5 font-mono">
                    Session: {tx.stripeSessionId || tx.id} • Plan: {tx.plan}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="font-heading text-lg font-black text-stone-900 dark:text-white inline-flex items-center">
                    <DollarSignIcon size={16} className="text-emerald-600" />
                    <span>{tx.amount.toFixed(2)}</span>
                  </span>
                  <p className="text-[11px] text-stone-400">{tx.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
