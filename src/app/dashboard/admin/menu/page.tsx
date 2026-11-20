"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import {
  PizzaIcon,
  SearchIcon,
  FilterIcon,
  CheckIcon,
  RefreshIcon,
} from "@/components/ui/Icons";
import { getTokenClient } from "@/lib/tokenAccess";
import { TableRowSkeleton } from "@/components/ui/Skeleton";

// 1. Simple Interface for Menu Item
interface MenuItem {
  _id: string;
  itemName: string;
  vendorName: string;
  category: string;
  price: number;
  status: "pending" | "approved" | "rejected";
  image?: string;
  images?: string[];
  createdAt?: string;
}

export default function AdminMenuPage() {
  const toast = useToast();

  // 2. States for menu items and loading
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // 3. States for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // 4. Fetch menu items from backend
  useEffect(() => {
    const fetchAdminMenuItems = async () => {
      setIsLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${serverUrl}/admin/menu`, {
          headers: {
            authorization: `Bearer ${await getTokenClient()}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load admin menu items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminMenuItems();
  }, [reloadKey]);

  // 5. Handle status update (Approve / Reject)
  const handleUpdateStatus = async (
    id: string,
    name: string,
    nextStatus: "approved" | "rejected",
  ) => {
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${serverUrl}/menu/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${await getTokenClient()}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const resData = await res.json();
      if (resData.modifiedCount > 0) {
        // Update local state directly using MongoDB _id
        setItems((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: nextStatus } : item,
          ),
        );

        if (nextStatus === "approved") {
          toast.success(
            `"${name}" has been approved and is now live!`,
            "Item Approved",
          );
        } else {
          toast.error(`"${name}" has been rejected.`, "Item Rejected");
        }
      } else {
        toast.error(`Could not update approval status for "${name}" in database.`, "Action Incomplete");
      }
    } catch (err) {
      console.error("Update item status error:", err);
      toast.error(`Failed to update status for "${name}". Please try again.`, "Update Failed");
    }
  };

  // 6. Get unique categories list for dropdown
  const categories = Array.from(
    new Set(items.map((i) => i.category).filter(Boolean)),
  );

  // 7. Filter items based on search and selected filters
  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (item.itemName || "").toLowerCase().includes(query) ||
      (item.vendorName || "").toLowerCase().includes(query) ||
      (item.category || "").toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate status counts
  const pendingCount = items.filter((i) => i.status === "pending").length;
  const approvedCount = items.filter((i) => i.status === "approved").length;
  const rejectedCount = items.filter((i) => i.status === "rejected").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Catalog Governance
            </span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-xs font-semibold text-stone-500">
              Menu Approvals
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Manage Menu Items
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Review vendor submitted pizza recipes. Search, filter by status, and
            approve or reject items.
          </p>
        </div>

        {/* Quick Refresh Button */}
        <button
          onClick={() => setReloadKey((prev) => prev + 1)}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold transition-colors w-fit"
        >
          <RefreshIcon size={14} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh Menu</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Total Items
          </span>
          <span className="text-2xl font-black text-stone-900 dark:text-white font-heading">
            {isLoading ? "..." : items.length}
          </span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block mb-1">
            Pending Review
          </span>
          <span className="text-2xl font-black text-amber-500 font-heading">
            {isLoading ? "..." : pendingCount}
          </span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 block mb-1">
            Approved
          </span>
          <span className="text-2xl font-black text-emerald-500 font-heading">
            {isLoading ? "..." : approvedCount}
          </span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block mb-1">
            Rejected
          </span>
          <span className="text-2xl font-black text-rose-500 font-heading">
            {isLoading ? "..." : rejectedCount}
          </span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <SearchIcon
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by pizza name, vendor, or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option
              value="all"
              className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
            >
              All Statuses ({items.length})
            </option>
            <option
              value="pending"
              className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
            >
              Pending Review ({pendingCount})
            </option>
            <option
              value="approved"
              className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
            >
              Approved ({approvedCount})
            </option>
            <option
              value="rejected"
              className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
            >
              Rejected ({rejectedCount})
            </option>
          </select>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option
                value="all"
                className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
              >
                All Categories
              </option>
              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
                >
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Menu Items Table / List */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left">
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={5} />
                ))}
              </tbody>
            </table>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <PizzaIcon size={28} />
            </div>
            <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white">
              No Menu Items Found
            </h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              When vendors submit pizzas for approval, they will appear here for
              administrator review.
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <FilterIcon size={28} />
            </div>
            <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white">
              No Matching Menu Items
            </h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              No items match your selected search or filter criteria. Try
              clearing filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {filteredItems.map((item) => {
              const itemImg =
                item.image ||
                (Array.isArray(item.images) ? item.images[0] : "");

              return (
                <div
                  key={item._id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Pizza Thumbnail Image */}
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 shrink-0 flex items-center justify-center">
                      {itemImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={itemImg}
                          alt={item.itemName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <PizzaIcon size={24} className="text-red-500/60" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h5 className="font-heading font-bold text-sm sm:text-base text-stone-900 dark:text-white">
                          {item.itemName}
                        </h5>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                            item.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : item.status === "pending"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        Vendor:{" "}
                        <span className="font-medium text-stone-700 dark:text-stone-300">
                          {item.vendorName}
                        </span>{" "}
                        • Category:{" "}
                        <span className="font-medium text-stone-700 dark:text-stone-300">
                          {item.category}
                        </span>{" "}
                        • Price:{" "}
                        <span className="font-bold text-stone-900 dark:text-white">
                          ${item.price.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {item.status === "pending" ? (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              item._id,
                              item.itemName,
                              "rejected",
                            )
                          }
                          className="px-3.5 py-1.5 rounded-xl border border-rose-500/30 text-rose-600 hover:bg-rose-500/10 text-xs font-bold transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              item._id,
                              item.itemName,
                              "approved",
                            )
                          }
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs inline-flex items-center gap-1"
                        >
                          <CheckIcon size={12} />
                          <span>Approve</span>
                        </button>
                      </>
                    ) : item.status === "approved" ? (
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            item._id,
                            item.itemName,
                            "rejected",
                          )
                        }
                        className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-rose-600 hover:border-rose-500/30 text-xs font-bold transition-colors"
                      >
                        Revoke Approval
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            item._id,
                            item.itemName,
                            "approved",
                          )
                        }
                        className="px-3.5 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 text-xs font-bold transition-colors"
                      >
                        Re-Approve
                      </button>
                    )}
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
