"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  ShoppingBagIcon,
  CheckIcon,
  CloseIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  PizzaIcon,
  CalendarIcon,
  PhoneIcon,
  MailIcon,
} from "@/components/ui/Icons";
import { getTokenClient } from "@/lib/tokenAccess";

// Order interface matching Assignment 9 requirements
interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemName: string;
  itemImage: string;
  itemCategory: string;
  itemPrice: number;
  deliveryDate: string;
  deliveryAddress: string;
  customerMessage?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
}

// Clean date & time formatter helper (e.g. Nov 19, 2026, 08:05 PM)
const formatOrderDateTime = (dateStr: string) => {
  if (!dateStr) return "Just now";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

export default function VendorOrdersPage() {
  const { user } = useAuth();
  const toast = useToast();

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and Search states
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "accepted" | "rejected"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch orders placed for this vendor's items
  useEffect(() => {
    const fetchVendorOrders = async () => {
      if (!user?.email) return;
      setIsLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(
          `${serverUrl}/orders?email=${encodeURIComponent(user.email)}`,
          {
            headers: {
              authorization: `Bearer ${await getTokenClient()}`,
            },
          },
        );
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.orders || [];
          setOrders(
            list.map(
              (o: {
                _id?: string;
                id?: string;
                customerName?: string;
                customerEmail?: string;
                customerPhone?: string;
                phone?: string;
                itemName?: string;
                name?: string;
                price?: number;
                itemPrice?: number;
                totalAmount?: number;
                image?: string;
                images?: string[];
                category?: string;
                deliveryDate?: string;
                deliveryAddress?: string;
                address?: string;
                customerMessage?: string;
                specialNotes?: string;
                notes?: string;
                status?: Order["status"];
                createdAt?: string;
              }) => ({
                id: o._id || o.id || "",
                // Customer Information
                customerName: o.customerName || "Customer",
                customerEmail: o.customerEmail || "Not provided",
                customerPhone: o.customerPhone || o.phone || "Not provided",
                // Item Information
                itemName: o.itemName || o.name || "Artisan Pizza",
                itemImage:
                  o.image ||
                  o.images?.[0] ||
                  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
                itemCategory: o.category || "Classic Pizzas",
                itemPrice:
                  typeof o.itemPrice === "number"
                    ? o.itemPrice
                    : typeof o.totalAmount === "number"
                      ? o.totalAmount
                      : typeof o.price === "number"
                        ? o.price
                        : 0,
                // Delivery Date
                deliveryDate:
                  o.deliveryDate ||
                  (o.createdAt
                    ? new Date(o.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Today (ASAP)"),
                // Delivery Address
                deliveryAddress:
                  o.deliveryAddress || o.address || "Address provided",
                // Customer Message / Notes
                customerMessage:
                  o.customerMessage || o.specialNotes || o.notes || "",
                // Order Status
                status: o.status || "pending",
                createdAt: o.createdAt || new Date().toISOString(),
              }),
            ),
          );
        }
      } catch {
        // Backend not yet reachable or empty DB; keep empty state
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorOrders();
  }, [user?.email]);

  // 2. Accept Order Handler
  const handleAccept = async (id: string) => {
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${serverUrl}/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${await getTokenClient()}`,
        },
        body: JSON.stringify({ status: "accepted" }),
      });
      if (res.ok) {
        toast.success(
          "Order accepted! Sent to kitchen preparation queue.",
          "Order Accepted",
        );
      }
    } catch {
      // Graceful fallback
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "accepted" } : o)),
    );
  };

  // 3. Reject Order Handler
  const handleReject = async (id: string) => {
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${serverUrl}/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${await getTokenClient()}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (res.ok) {
        toast.error("Order has been rejected.", "Order Rejected");
      }
    } catch {
      // Graceful fallback
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "rejected" } : o)),
    );
  };

  // Status Badge Styling Helper
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "rejected":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20";
    }
  };

  // Filtered orders list based on status and search query
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" ? true : order.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerEmail.toLowerCase().includes(q) ||
      order.customerPhone.toLowerCase().includes(q) ||
      order.itemName.toLowerCase().includes(q) ||
      order.deliveryAddress.toLowerCase().includes(q) ||
      order.id.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Kitchen Orders
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <span className="text-xs font-semibold text-stone-500">
            {orders.length} Total Orders
          </span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
          Customer Orders
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
          Review pending customer orders, confirm delivery schedules, and manage
          kitchen status.
        </p>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "pending", "accepted", "rejected"] as const).map((st) => {
            const count =
              st === "all"
                ? orders.length
                : orders.filter((o) => o.status === st).length;
            const isActive = statusFilter === st;

            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                }`}
              >
                <span>{st}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, item, or ID..."
            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
        </div>
      </div>

      {/* Orders List Area */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-stone-500">
            Fetching customer orders from database...
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        /* Empty State */
        <div className="py-16 px-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
            <ClockIcon size={32} />
          </div>
          <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-white mb-1">
            {orders.length === 0
              ? "No Customer Orders Yet"
              : "No Orders Match Your Filter"}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
            {orders.length === 0
              ? "When hungry customers order from your published pizza recipes, their orders will appear here in real-time."
              : "Try switching status tabs or changing your search terms to view other orders."}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const isPending = order.status === "pending";

            return (
              <div
                key={order.id}
                className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow space-y-5"
              >
                {/* 1. Order Top Header (Order ID, Formatted Placement Date, & Status) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                      <ShoppingBagIcon size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-base font-bold text-stone-900 dark:text-white">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Placed on {formatOrderDateTime(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge & Total Amount */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        Total Amount
                      </span>
                      <span className="font-heading font-black text-lg text-stone-900 dark:text-white">
                        ${order.itemPrice.toFixed(2)}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* 2. Three Main Columns: Item Info, Customer Info, Delivery Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Item Details */}
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 space-y-3">
                    <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase tracking-wider">
                      <PizzaIcon size={16} className="text-red-500 shrink-0" />
                      <span>Item Details</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-700 shrink-0 border border-stone-300 dark:border-stone-600">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={order.itemImage}
                          alt={order.itemName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-heading text-sm font-bold text-stone-900 dark:text-white truncate">
                          {order.itemName}
                        </h5>
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                          {order.itemCategory}
                        </p>
                        <p className="text-xs font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                          ${order.itemPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-bold uppercase tracking-wider">
                      <UserIcon size={16} className="text-blue-500 shrink-0" />
                      <span>Customer Details</span>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 dark:text-white text-sm">
                        {order.customerName}
                      </p>
                      <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 mt-1">
                        <MailIcon
                          size={13}
                          className="shrink-0 text-stone-400"
                        />
                        <span className="truncate">{order.customerEmail}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 mt-1">
                        <PhoneIcon
                          size={13}
                          className="shrink-0 text-stone-400"
                        />
                        <span>{order.customerPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Target & Address */}
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-bold uppercase tracking-wider">
                      <MapPinIcon
                        size={16}
                        className="text-emerald-500 shrink-0"
                      />
                      <span>Delivery Information</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-stone-800 dark:text-stone-200 font-semibold mb-1">
                        <CalendarIcon
                          size={13}
                          className="text-emerald-600 shrink-0"
                        />
                        <span>Date: {order.deliveryDate}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-stone-500 dark:text-stone-400 leading-relaxed">
                        <MapPinIcon
                          size={13}
                          className="text-stone-400 shrink-0 mt-0.5"
                        />
                        <span className="line-clamp-2">
                          {order.deliveryAddress}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Customer Special Instructions / Notes */}
                <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 text-xs">
                  <span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
                    Customer Special Instructions:
                  </span>
                  {order.customerMessage ? (
                    <p className="text-stone-700 dark:text-stone-300 italic">
                      &ldquo;{order.customerMessage}&rdquo;
                    </p>
                  ) : (
                    <p className="text-stone-400 dark:text-stone-500 italic">
                      No special instructions provided.
                    </p>
                  )}
                </div>

                {/* 4. Order Status & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">
                      Order Status:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Accept / Reject Buttons for Pending Orders */}
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleReject(order.id)}
                        className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <CloseIcon size={14} />
                        <span>Reject Order</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAccept(order.id)}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckIcon size={14} />
                        <span>Accept Order</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400 italic">
                      {order.status === "accepted"
                        ? "✓ Order confirmed and in kitchen preparation"
                        : order.status === "rejected"
                          ? "✕ Order declined by kitchen"
                          : "Order status finalized"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
