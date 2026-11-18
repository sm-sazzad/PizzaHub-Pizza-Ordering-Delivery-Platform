"use client";

import React, { useState } from "react";
import { useToast } from "@/context/ToastContext";
import {
  ShoppingBagIcon,
  CheckIcon,
  CloseIcon,
  MapPinIcon,
  UserIcon,
} from "@/components/ui/Icons";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  itemName: string;
  itemPrice: number;
  deliveryDate: string;
  deliveryAddress: string;
  customerMessage?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-101",
    customerName: "Alex Rahman",
    customerEmail: "alex@example.com",
    itemName: "Diavola Hot Honey Pizza",
    itemPrice: 18.5,
    deliveryDate: "2026-11-19 (7:30 PM)",
    deliveryAddress: "House 42, Road 9/A, Dhanmondi, Dhaka",
    customerMessage: "Please make the crust extra crispy and include extra habanero honey!",
    status: "pending",
    createdAt: "10 mins ago",
  },
  {
    id: "ord-102",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@example.com",
    itemName: "Truffle Forest Mushroom Pizza",
    itemPrice: 21.0,
    deliveryDate: "2026-11-19 (8:00 PM)",
    deliveryAddress: "Apartment 5B, Gulshan Avenue, Dhaka",
    customerMessage: "No garlic on the roasted mushrooms please.",
    status: "pending",
    createdAt: "25 mins ago",
  },
  {
    id: "ord-103",
    customerName: "David Miller",
    customerEmail: "david@example.com",
    itemName: "Margherita D.O.P. Bianca",
    itemPrice: 16.0,
    deliveryDate: "2026-11-18 (6:00 PM)",
    deliveryAddress: "Road 11, Banani, Dhaka",
    status: "accepted",
    createdAt: "2 hours ago",
  },
];

export default function VendorOrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const handleAccept = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "accepted" } : o))
    );
    toast.success("Order accepted! Kitchen notification dispatched.", "Order Accepted");
  };

  const handleReject = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "rejected" } : o))
    );
    toast.error("Order has been rejected.", "Order Rejected");
  };

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Kitchen Orders
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
          Customer Orders
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
          Review pending customer orders, confirm delivery schedules, and manage status.
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const isPending = order.status === "pending";

          return (
            <div
              key={order.id}
              className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                    <ShoppingBagIcon size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white">
                      Order #{order.id} •{" "}
                      <span className="text-red-600">{order.itemName}</span>
                    </h4>
                    <p className="text-xs text-stone-400">Placed {order.createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-heading font-black text-lg text-stone-900 dark:text-white">
                    ${order.itemPrice.toFixed(2)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Customer Info */}
                <div className="space-y-1.5 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-bold">
                    <UserIcon size={14} className="text-stone-400" />
                    <span>Customer Details</span>
                  </div>
                  <p className="font-semibold text-stone-900 dark:text-white">
                    {order.customerName}
                  </p>
                  <p className="text-stone-400">{order.customerEmail}</p>
                </div>

                {/* Delivery Info */}
                <div className="space-y-1.5 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-bold">
                    <MapPinIcon size={14} className="text-stone-400" />
                    <span>Delivery Target</span>
                  </div>
                  <p className="font-semibold text-stone-900 dark:text-white">
                    {order.deliveryDate}
                  </p>
                  <p className="text-stone-400">{order.deliveryAddress}</p>
                </div>
              </div>

              {/* Special Customer Message if any */}
              {order.customerMessage && (
                <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs">
                  <span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
                    Special Kitchen Instructions:
                  </span>
                  <p className="text-stone-600 dark:text-stone-300 italic">
                    &ldquo;{order.customerMessage}&rdquo;
                  </p>
                </div>
              )}

              {/* Action Buttons for Pending Orders (PDF Page 7: only pending orders can be accepted/rejected) */}
              {isPending && (
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => handleReject(order.id)}
                    className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5"
                  >
                    <CloseIcon size={14} />
                    <span>Reject Order</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAccept(order.id)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <CheckIcon size={14} />
                    <span>Accept Order</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
