"use client";

import React from "react";
import Link from "next/link";
import {
  SearchIcon,
  FlameIcon,
  TruckIcon,
  PizzaIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";

const STEPS = [
  {
    step: "01",
    title: "Discover Local Artisan Kitchens",
    description:
      "Explore vetted neighborhood pizzerias, check live ratings, stone-oven types, and authentic Italian menus.",
    icon: SearchIcon,
    accent: "text-red-600 bg-red-500/10 border-red-500/20",
  },
  {
    step: "02",
    title: "Customize Your Dream Pie",
    description:
      "Pick authentic sourdough or Neapolitan crust, adjust toppings, specify delivery date, and add special kitchen instructions.",
    icon: PizzaIcon,
    accent: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  },
  {
    step: "03",
    title: "Fired in a 485°C Oven",
    description:
      "Your order is accepted directly by the chef, baked on stone in under 90 seconds, and packaged in moisture-vented thermal boxes.",
    icon: FlameIcon,
    accent: "text-orange-600 bg-orange-500/10 border-orange-500/20",
  },
  {
    step: "04",
    title: "Sizzling Hot Doorstep Delivery",
    description:
      "Our express courier speeds your pizza right to your door with the cheese still bubbling and the crust gloriously crisp.",
    icon: TruckIcon,
    accent: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-4">
            <PizzaIcon size={14} />
            <span>Simple 4-Step Journey</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C1917] dark:text-[#FBF9F5] tracking-tight">
            How PizzaHub <span className="text-red-600">Works</span>
          </h2>
          <p className="mt-3 text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            From flour and flame to your dining table in record time. Here is how we guarantee the
            freshest pizza experience.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative rounded-3xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-amber-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-heading text-3xl font-black text-stone-300 dark:text-stone-700 group-hover:text-red-600 transition-colors">
                      {item.step}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.accent}`}
                    >
                      <Icon size={22} />
                    </div>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-white group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] font-semibold text-stone-400">
                  Step {index + 1} of 4
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="mt-14 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Order Your First Stone-Baked Pizza</span>
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};
