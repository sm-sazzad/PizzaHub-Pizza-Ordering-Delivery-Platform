"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import {
  UsersIcon,
  SearchIcon,
  EyeIcon,
  CloseIcon,
} from "@/components/ui/Icons";
import { getTokenClient } from "@/lib/tokenAccess";
import { TableRowSkeleton } from "@/components/ui/Skeleton";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "customer" | "vendor" | "admin";
  isBlocked: boolean;
  subscriptionPlan?: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // State for View User Info modal
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // State for Change Role modal
  const [roleModalUser, setRoleModalUser] = useState<UserItem | null>(null);
  const [newRole, setNewRole] = useState<"customer" | "vendor" | "admin">(
    "customer",
  );
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${serverUrl}/admin/users`, {
          headers: {
            authorization: `Bearer ${await getTokenClient()}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleBlock = async (
    id: string,
    name: string,
    isBlocked: boolean,
  ) => {
    const nextState = !isBlocked;
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${serverUrl}/admin/users/${id}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${await getTokenClient()}`,
        },
        body: JSON.stringify({ isBlocked: nextState }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const resData = await res.json();
      if (resData.modifiedCount > 0) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, isBlocked: nextState } : u)),
        );
        if (nextState) {
          toast.warning(
            `Account for ${name} has been blocked.`,
            "User Blocked",
          );
        } else {
          toast.success(
            `Account for ${name} has been unblocked.`,
            "User Unblocked",
          );
        }
      } else {
        toast.error(
          `No changes were saved in database for ${name}.`,
          "Action Incomplete",
        );
      }
    } catch (err) {
      console.error("Toggle block error:", err);
      toast.error(
        `Failed to update account status for ${name}.`,
        "Action Failed",
      );
    }
  };

  // Handle role update
  const handleSaveRole = async () => {
    if (!roleModalUser) return;
    setIsUpdatingRole(true);
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(
        `${serverUrl}/admin/users/${roleModalUser._id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${await getTokenClient()}`,
          },
          body: JSON.stringify({ role: newRole }),
        },
      );

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const resData = await res.json();
      if (resData.modifiedCount > 0) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === roleModalUser._id ? { ...u, role: newRole } : u,
          ),
        );
        toast.success(
          `Role for ${roleModalUser.name} changed to ${newRole.toUpperCase()}!`,
          "Role Updated",
        );
        setRoleModalUser(null);
      } else {
        toast.error(
          `No changes were saved in database for ${roleModalUser.name}.`,
          "Update Incomplete",
        );
      }
    } catch (err) {
      console.error("Save role error:", err);
      toast.error(
        `Failed to update role for ${roleModalUser.name}.`,
        "Update Failed",
      );
    } finally {
      setIsUpdatingRole(false);
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
            Search, filter by role, and manage platform permissions (Block /
            Unblock accounts).
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
          <option
            value="all"
            className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
          >
            All Roles
          </option>
          <option
            value="customer"
            className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
          >
            Customers Only
          </option>
          <option
            value="vendor"
            className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
          >
            Vendors Only
          </option>
          <option
            value="admin"
            className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
          >
            Administrators
          </option>
        </select>
      </div>

      {/* Table / List */}
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
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <UsersIcon size={28} />
            </div>
            <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white">
              No Users Found
            </h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              When users register on PizzaHub, their accounts and roles will be
              listed here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  {u.image ? (
                    <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-stone-200 dark:ring-stone-700 shrink-0 bg-stone-100 dark:bg-stone-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={u.image}
                        alt={u.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
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
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {/* View User Info Button */}
                  <button
                    onClick={() => setSelectedUser(u)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <EyeIcon size={14} />
                    <span>View Info</span>
                  </button>

                  {/* Change Role Button */}
                  <button
                    onClick={() => {
                      setRoleModalUser(u);
                      setNewRole(u.role);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Change Role
                  </button>

                  {/* Block / Unblock Button */}
                  {u.role !== "admin" && (
                    <button
                      onClick={() =>
                        handleToggleBlock(u._id, u.name, u.isBlocked)
                      }
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
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

      {/* 1. View User Info Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-7 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-white">
                User Details
              </h3>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors cursor-pointer"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Profile Avatar & Name */}
            <div className="flex items-center gap-4">
              {selectedUser.image ? (
                <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-stone-200 dark:ring-stone-700 shrink-0 bg-stone-100 dark:bg-stone-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedUser.image}
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 text-white text-xl font-bold flex items-center justify-center shrink-0">
                  {selectedUser.name
                    ? selectedUser.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
              )}
              <div>
                <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white">
                  {selectedUser.name}
                </h4>
                <p className="text-xs text-stone-400">{selectedUser.email}</p>
              </div>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1">
                  Account Role
                </span>
                <span className="font-bold text-stone-900 dark:text-white capitalize">
                  {selectedUser.role}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1">
                  Account Status
                </span>
                <span
                  className={`font-bold ${
                    selectedUser.isBlocked
                      ? "text-rose-600"
                      : "text-emerald-600"
                  }`}
                >
                  {selectedUser.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1">
                  Subscription
                </span>
                <span className="font-bold text-stone-900 dark:text-white capitalize">
                  {selectedUser.subscriptionPlan === "premium"
                    ? "Premium Tier"
                    : "Free Plan"}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1">
                  User ID
                </span>
                <span className="font-mono text-stone-600 dark:text-stone-300 text-[11px] truncate block">
                  {selectedUser._id}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Change Role Modal */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-7 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-white">
                Change User Role
              </h3>
              <button
                type="button"
                onClick={() => setRoleModalUser(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors cursor-pointer"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Select a new role for{" "}
              <strong className="text-stone-900 dark:text-white">
                {roleModalUser.name}
              </strong>
              :
            </p>

            {/* Role Select Dropdown */}
            <div>
              <select
                value={newRole}
                onChange={(e) =>
                  setNewRole(e.target.value as "customer" | "vendor" | "admin")
                }
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs font-semibold focus:outline-none"
              >
                <option
                  value="customer"
                  className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
                >
                  Customer
                </option>
                <option
                  value="vendor"
                  className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
                >
                  Vendor (Restaurant)
                </option>
                <option
                  value="admin"
                  className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
                >
                  Administrator
                </option>
              </select>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRoleModalUser(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdatingRole}
                onClick={handleSaveRole}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer disabled:opacity-50"
              >
                {isUpdatingRole ? "Saving..." : "Save Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
