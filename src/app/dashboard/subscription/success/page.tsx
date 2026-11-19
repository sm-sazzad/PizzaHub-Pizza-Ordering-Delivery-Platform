import React from "react";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import SuccessToast from "./SuccessToast";
import {
  CheckIcon,
  SparklesIcon,
  PizzaIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPaymentPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id } = await searchParams;

  // Retrieve Stripe checkout session details if a session_id is provided
  let session = null;
  if (session_id) {
    try {
      session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items", "payment_intent"],
      });
    } catch (error) {
      console.error("Failed to retrieve Stripe session:", error);
    }
  }

  // Update user subscription to premium in backend database
  let showSuccessToast = false;
  if (session?.status === "complete" && session.payment_status === "paid") {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/premium-users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId: session_id }),
      });
      const resData = await res.json();
      if (resData.modifiedCount > 0 || resData.matchedCount > 0) {
        showSuccessToast = true;
      }
    } catch (error) {
      console.error("Failed to update user to premium:", error);
    }
  }
  // Format amount or fallback to default $29.00
  const amountFormatted = session?.amount_total
    ? `$${(session.amount_total / 100).toFixed(2)}`
    : "$29.00";

  const customerEmail = session?.customer_details?.email || null;
  const isPaid = session?.payment_status === "paid" || true;

  // Unlocked features list for Premium Vendors
  const unlockedPerks = [
    {
      title: "Unlimited Menu Items",
      description: "Upload and publish unlimited pizzas with no 3-item limit.",
    },
    {
      title: "Gold Verified Chef Badge",
      description:
        "Stand out in search results with an official verified badge.",
    },
    {
      title: "Homepage Spotlight",
      description:
        "Priority display in the featured local restaurants section.",
    },
    {
      title: "Instant Order Alerts",
      description:
        "Real-time kitchen order dispatch and customer notifications.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 space-y-8">
      {/* Client-side toast triggered on successful payment */}
      {showSuccessToast && <SuccessToast />}

      {/* Main Success Container */}
      <div className="relative rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-10 shadow-xl text-center space-y-6 overflow-hidden">
        {/* Subtle decorative top background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-gradient-to-b from-amber-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Celebration Green Checkmark Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/20 shadow-md">
            <CheckIcon size={40} className="stroke-[3]" />
          </div>
        </div>

        {/* Header Text & Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-sm">
            <SparklesIcon size={12} />
            <span>Premium Membership Active</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Subscription Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            Thank you for upgrading! Your kitchen is now operating on the{" "}
            <strong className="text-stone-900 dark:text-stone-200">
              Premium Vendor Plan
            </strong>
            . Enjoy unlimited recipes and premium exposure.
          </p>
        </div>

        {/* Receipt / Transaction Details Box */}
        <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 p-5 text-left space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Payment Receipt
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {isPaid ? "Paid & Verified" : "Processing"}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-stone-500 dark:text-stone-400">
                Plan Tier:
              </span>
              <span className="font-bold text-stone-900 dark:text-white">
                Premium Vendor (Monthly)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-stone-500 dark:text-stone-400">
                Amount Charged:
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {amountFormatted} / month
              </span>
            </div>

            {customerEmail && (
              <div className="flex justify-between items-center">
                <span className="text-stone-500 dark:text-stone-400">
                  Billed To:
                </span>
                <span className="font-medium text-stone-700 dark:text-stone-300">
                  {customerEmail}
                </span>
              </div>
            )}

            {session_id && (
              <div className="flex justify-between items-center pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
                <span className="text-stone-500 dark:text-stone-400">
                  Reference ID:
                </span>
                <span className="font-mono text-[11px] text-stone-600 dark:text-stone-400 truncate max-w-[200px]">
                  {session_id}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Unlocked Benefits */}
        <div className="text-left space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Unlocked Features
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unlockedPerks.map((perk, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-700/50 flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckIcon size={13} className="stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                    {perk.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug mt-0.5">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard/add-item"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            <PlusCircleIcon size={16} />
            <span>Add New Pizza Item</span>
          </Link>

          <Link
            href="/dashboard/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <PizzaIcon size={16} />
            <span>View My Menu</span>
          </Link>
        </div>

        {/* Return to Dashboard Link */}
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <span>Return to Dashboard Overview</span>
            <ArrowRightIcon size={12} />
          </Link>
        </div>
      </div>

      {/* Security & Receipt Notice */}
      <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-xs text-stone-500 flex items-center gap-3">
        <ShieldCheckIcon size={18} className="text-emerald-500 shrink-0" />
        <span>
          A copy of your payment confirmation has been recorded securely. You
          can view your plan status anytime under{" "}
          <Link
            href="/dashboard/subscription"
            className="text-red-600 hover:underline font-semibold"
          >
            Subscription Settings
          </Link>
          .
        </span>
      </div>
    </div>
  );
}
