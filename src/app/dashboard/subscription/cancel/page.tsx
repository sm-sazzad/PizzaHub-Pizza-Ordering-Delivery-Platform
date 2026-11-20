import React from "react";
import Link from "next/link";
import {
  CloseIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  PizzaIcon,
  AlertCircleIcon,
} from "@/components/ui/Icons";

export default function CancelPaymentPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 space-y-8">
      {/* Main Cancelled Container */}
      <div className="relative rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-10 shadow-xl text-center space-y-6 overflow-hidden">
        {/* Subtle decorative top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-gradient-to-b from-rose-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Warning / Cancel Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto ring-8 ring-rose-50 dark:ring-rose-950/20 shadow-md">
            <CloseIcon size={38} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Header Title & Status Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-xs">
            <AlertCircleIcon size={13} />
            <span>Checkout Incomplete</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Payment Cancelled
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            Your Stripe payment session was cancelled. No charges were made to
            your card or account. You can continue using your current plan or
            try upgrading again whenever you are ready.
          </p>
        </div>

        {/* Transaction Summary Box */}
        <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 p-5 text-left space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Session Summary
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Not Charged
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-stone-500 dark:text-stone-400">
                Attempted Plan:
              </span>
              <span className="font-bold text-stone-900 dark:text-white">
                Premium Vendor ($29.00 / month)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-stone-500 dark:text-stone-400">
                Amount Deducted:
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                $0.00 (No deduction)
              </span>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
              <span className="text-stone-500 dark:text-stone-400">
                Account Status:
              </span>
              <span className="font-medium text-stone-700 dark:text-stone-300">
                Free Plan remains active
              </span>
            </div>
          </div>
        </div>

        {/* Helpful Information Notes */}
        <div className="text-left p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/50 space-y-2 text-xs">
          <h4 className="font-bold text-stone-800 dark:text-stone-200">
            Why was the payment cancelled?
          </h4>
          <ul className="text-stone-500 dark:text-stone-400 space-y-1 list-disc list-inside leading-relaxed text-[11px]">
            <li>You may have clicked the cancel link on the Stripe checkout window.</li>
            <li>The browser window was closed before completing card authentication.</li>
            <li>You can restart checkout anytime with any major credit or debit card.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard/subscription"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            <CreditCardIcon size={16} />
            <span>Try Again (Retry Payment)</span>
          </Link>

          <Link
            href="/dashboard/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <PizzaIcon size={16} />
            <span>Back to My Menu</span>
          </Link>
        </div>

        {/* Return to Dashboard */}
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

      {/* Security & Reassurance Notice */}
      <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-xs text-stone-500 flex items-center gap-3">
        <ShieldCheckIcon size={18} className="text-emerald-500 shrink-0" />
        <span>
          Your financial information is securely protected by Stripe. No payment
          was authorized or captured. If you have questions, please check your{" "}
          <Link
            href="/dashboard/subscription"
            className="text-red-600 hover:underline font-semibold"
          >
            Subscription Details
          </Link>
          .
        </span>
      </div>
    </div>
  );
}
