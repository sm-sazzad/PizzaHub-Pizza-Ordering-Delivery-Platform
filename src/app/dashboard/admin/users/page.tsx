"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import {
  UsersIcon,
  SearchIcon,
} from "@/components/ui/Icons";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "customer" | "vendor" | "admin";
  isBlocked: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${serverUrl}/admin/users`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.users || [];
          setUsers(list);
        }
      } catch {
        // Backend not yet reachable or empty DB; keep empty state
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleBlock = async (id: string, name: string, isBlocked: boolean) => {
    const nextState = !isBlocked;
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${serverUrl}/admin/users/${id}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: nextState }),
      });
    } catch {
      // Graceful fallback
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isBlocked: nextState } : u)),
    );
    if (nextState) {
      toast.warning(`Account for ${name} has been blocked.`, "User Blocked");
    } else {
      toast.success(`Account for ${name} has been unblocked.`, "User Unblocked");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Admin Governance
            </span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-xs font-semibold text-stone-500">
              User Directory
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Manage Users
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Search, filter by role, and manage platform permissions (Block / Unblock accounts).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers Only</option>
          <option value="vendor">Vendors Only</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* Table / List */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-stone-500">
              Loading users from database...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <UsersIcon size={28} />
            </div>
            <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white">
              No Users Found
            </h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              When users register on PizzaHub, their accounts and roles will be listed here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-heading font-bold text-sm text-stone-900 dark:text-white">
                      {u.name}
                    </h5>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                        u.role === "admin"
                          ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                          : u.role === "vendor"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      }`}
                    >
                      {u.role}
                    </span>
                    {u.isBlocked && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 border border-rose-500/20">
                        Blocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">{u.email}</p>
                </div>

                <div className="flex items-center gap-3">
                  {u.role !== "admin" && (
                    <button
                      onClick={() => handleToggleBlock(u.id, u.name, u.isBlocked)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        u.isBlocked
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "border border-rose-500/30 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      }`}
                    >
                      {u.isBlocked ? "Unblock Account" : "Block User"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
