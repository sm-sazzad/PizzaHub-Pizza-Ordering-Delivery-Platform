"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PizzaIcon, ArrowRightIcon, SparklesIcon, CheckIcon } from "@/components/ui/Icons";

export const VendorBannerCTA: React.FC = () => {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-950 to-neutral-900 text-white p-8 sm:p-12 lg:p-16 border border-stone-800 shadow-2xl"
        >
          {/* Decorative ambient glowing circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
                <PizzaIcon size={14} className="text-amber-400" />
                <span>For Restaurant & Pizzeria Owners</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Own an Artisanal Pizzeria?{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-orange-400">
                  Scale Your Orders on PizzaHub.
                </span>
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Showcase your woodfired creations directly to thousands of passionate pizza
                lovers. Publish menu items, manage incoming orders with one-click acceptance, and
                upgrade to Premium for unlimited listings and top homepage placement.
              </p>

              {/* Vendor Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckIcon size={12} />
                  </div>
                  <span>Start Free with up to 3 Active Items</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckIcon size={12} />
                  </div>
                  <span>Direct Customer Order Management</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckIcon size={12} />
                  </div>
                  <span>Premium Stripe Checkout Integration</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckIcon size={12} />
                  </div>
                  <span>Featured Vendor Badge & Promotion</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <Link
                  href="/signup?role=vendor"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Register as a Vendor</span>
                  <ArrowRightIcon size={16} />
                </Link>

                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700 font-semibold text-sm transition-colors"
                >
                  <SparklesIcon size={16} className="text-amber-400" />
                  <span>View Subscription Plans</span>
                </Link>
              </div>
            </div>

            {/* Right Graphic Card: Premium Vendor Preview Badge */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-stone-900/90 border border-stone-800 p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Vendor Partner
                  </span>
                </div>

                <div className="rounded-xl bg-stone-950 p-4 border border-stone-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Luigi&apos;s Woodfired</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ★ Premium Badge
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Unlimited Active Menu Items • Featured on Homepage
                  </p>
                  <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-gradient-to-r from-red-500 to-amber-500 w-full" />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-stone-400">
                    Join over <strong className="text-white">180+ artisanal kitchens</strong> today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
