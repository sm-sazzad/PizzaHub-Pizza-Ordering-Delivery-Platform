"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { uploadToImgBB } from "@/lib/uploadImage";
import { authClient } from "@/lib/auth-client";
import {
  UserIcon,
  MailIcon,
  StoreIcon,
  CameraIcon,
  CloseIcon,
  CheckIcon,
  LogOutIcon,
  DashboardIcon,
  ShoppingBagIcon,
  LockIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";

export default function ProfilePage() {
  const { user, isLoggedIn, isLoading: authLoading, logout, refreshSession } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form input states initialized from current authenticated user
  const [name, setName] = useState(user?.name || "");
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [location, setLocation] = useState("");

  // Avatar upload states
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.image || null);

  const [isSaving, setIsSaving] = useState(false);

  // Adjust form state during render when user session finishes loading (React 19 pattern)
  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    setName(user?.name || "");
    setBusinessName(user?.businessName || "");
    setAvatarPreview(user?.image || null);
  }

  // Handle image file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPG, PNG, WebP).", "Invalid File");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar image size must be less than 5MB.", "File Too Large");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle saving profile changes
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Full name cannot be empty.", "Validation Error");
      return;
    }

    setIsSaving(true);

    try {
      let finalImageUrl = user?.image || "";

      // 1. Upload new avatar to ImgBB if a new file was selected
      if (avatarFile) {
        try {
          finalImageUrl = await uploadToImgBB(avatarFile);
        } catch (uploadError) {
          console.warn("Avatar upload failed:", uploadError);
          toast.error("Failed to upload avatar image. Please try again.", "Upload Error");
          setIsSaving(false);
          return;
        }
      }

      // 2. Update user profile via Better Auth
      try {
        await authClient.updateUser({
          name: name.trim(),
          image: finalImageUrl || undefined,
        });
      } catch (authError) {
        console.warn("Better Auth updateUser error:", authError);
      }

      // 3. Update custom fields (e.g., businessName) in backend if vendor
      if (user?.role === "vendor" && user?.id) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          await fetch(`${baseUrl}/users/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: name.trim(),
              businessName: businessName.trim(),
              image: finalImageUrl,
              location: location.trim(),
            }),
          });
        } catch {
          // Backend optional update
        }
      }

      // 4. Refresh global session state
      await refreshSession();

      toast.success("Profile updated successfully!", "Changes Saved");
      setAvatarFile(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update profile.";
      toast.error(errorMsg, "Update Error");
    } finally {
      setIsSaving(false);
    }
  };

  // If session is still loading
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-stone-500">Loading your profile...</p>
      </div>
    );
  }

  // If user is not logged in
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-600 flex items-center justify-center mb-4">
          <UserIcon size={32} />
        </div>
        <h2 className="font-heading text-xl font-bold text-stone-900 dark:text-white mb-2">
          Sign In Required
        </h2>
        <p className="text-xs text-stone-500 max-w-sm mb-6">
          Please sign in to view and manage your PizzaHub profile and preferences.
        </p>
        <Link
          href="/signin"
          className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
        >
          Sign In to Your Account
        </Link>
      </div>
    );
  }

  const isVendor = user.role === "vendor";
  const isAdmin = user.role === "admin";
  const isPremium = user.subscriptionPlan === "premium";

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title & Navigation Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              User Settings
            </span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-xs font-semibold text-stone-500 capitalize">
              {user.role} Account
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Account Profile
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Manage your personal details, avatar photo, and platform account credentials.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 transition-colors w-fit"
        >
          <DashboardIcon size={16} />
          <span>Go to Dashboard</span>
        </Link>
      </div>

      {/* Hero Profile Overview Card */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-stone-900 border border-stone-700/60 shadow-md">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500 to-amber-500 text-white font-bold text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 dark:text-white truncate">
                {user.name}
              </h2>
              {/* Role Badge */}
              <span
                className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                  isAdmin
                    ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                    : isVendor
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                }`}
              >
                {user.role}
              </span>
              {isVendor && isPremium && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-xs">
                  PRO VENDOR
                </span>
              )}
            </div>

            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
              <MailIcon size={14} className="text-stone-400 shrink-0" />
              <span>{user.email}</span>
            </p>

            {isVendor && (
              <p className="text-xs text-amber-600 font-semibold mt-1 flex items-center gap-1.5">
                <StoreIcon size={14} className="shrink-0" />
                <span>{user.businessName || "Artisan Kitchen"}</span>
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/40 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-colors w-fit"
        >
          <LogOutIcon size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Edit Profile Form */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 sm:p-10 shadow-sm">
        <form onSubmit={handleProfileSave} className="space-y-6">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
            <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-white">
              Personal Information
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Update your display name and photo shown across orders and reviews.
            </p>
          </div>

          {/* Profile Photo File Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Profile Photo
            </label>

            {/* Hidden native input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatarUploadInput"
            />

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label
                htmlFor="avatarUploadInput"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold cursor-pointer transition-colors w-fit"
              >
                <CameraIcon size={16} />
                <span>Choose New Photo</span>
              </label>

              {avatarFile && (
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="font-semibold text-stone-800 dark:text-stone-200 truncate max-w-xs">
                    {avatarFile.name}
                  </span>
                  <span>({(avatarFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="p-1 rounded-lg text-stone-400 hover:text-red-600 transition-colors"
                    title="Remove selected photo"
                  >
                    <CloseIcon size={14} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-[11px] text-stone-400">
              JPG, PNG, or WebP up to 5MB. Photo updates automatically upon saving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="profileName"
                className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserIcon
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  id="profileName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/70 text-stone-900 dark:text-white placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            {/* Email Address (Read-only) */}
            <div className="space-y-1.5">
              <label
                htmlFor="profileEmail"
                className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
              >
                Email Address <span className="text-stone-400 font-normal">(Primary Login)</span>
              </label>
              <div className="relative">
                <MailIcon
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  id="profileEmail"
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-stone-100 dark:bg-stone-800/20 border border-stone-200 dark:border-stone-800 text-stone-500 text-sm cursor-not-allowed"
                />
                <LockIcon
                  size={14}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"
                />
              </div>
            </div>

            {/* Vendor Specific Fields */}
            {isVendor && (
              <>
                <div className="space-y-1.5 md:col-span-2">
                  <label
                    htmlFor="businessName"
                    className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
                  >
                    Restaurant / Pizzeria Name
                  </label>
                  <div className="relative">
                    <StoreIcon
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500"
                    />
                    <input
                      id="businessName"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Luigi's Woodfired Pizzeria"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/70 text-stone-900 dark:text-white placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label
                    htmlFor="kitchenLocation"
                    className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
                  >
                    Kitchen Address / Location
                  </label>
                  <input
                    id="kitchenLocation"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. House 14, Road 7, Dhanmondi, Dhaka"
                    className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/70 text-stone-900 dark:text-white placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                </div>
              </>
            )}
          </div>

          {/* Submit Action Button */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <span>Saving Changes...</span>
              ) : (
                <>
                  <CheckIcon size={16} />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Role-Specific Quick Action Card */}
      {isVendor && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <CreditCardIcon size={14} />
              <span>Subscription Tier: {isPremium ? "Premium (Unlimited)" : "Free (3 Items)"}</span>
            </div>
            <h4 className="font-heading text-lg font-bold">
              {isPremium
                ? "Your Kitchen is on the Premium Plan"
                : "Upgrade to Premium for Unlimited Pizzas"}
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              {isPremium
                ? "Enjoy verified gold status, featured homepage ranking, and unlimited pizza listings."
                : "Free plan accounts are limited to 3 active menu recipes. Upgrade using Stripe checkout for unlimited listings."}
            </p>
          </div>

          <Link
            href="/dashboard/subscription"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 whitespace-nowrap text-center"
          >
            <span>{isPremium ? "Manage Subscription" : "Upgrade Plan"}</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>
      )}

      {!isVendor && !isAdmin && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <ShoppingBagIcon size={20} />
            </div>
            <div>
              <h4 className="font-heading text-sm font-bold text-stone-900 dark:text-white">
                Customer Quick Links
              </h4>
              <p className="text-xs text-stone-500">
                Check pending pizza deliveries, track order history, or discover new recipes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/my-orders"
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              My Orders
            </Link>
            <Link
              href="/menu"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Order Pizza
            </Link>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheckIcon size={20} />
            </div>
            <div>
              <h4 className="font-heading text-sm font-bold text-stone-900 dark:text-white">
                System Administrator Privileges
              </h4>
              <p className="text-xs text-stone-500">
                You have elevated permissions to manage users, approve recipes, and review Stripe logs.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors whitespace-nowrap"
          >
            Admin Console
          </Link>
        </div>
      )}
    </div>
  );
}
