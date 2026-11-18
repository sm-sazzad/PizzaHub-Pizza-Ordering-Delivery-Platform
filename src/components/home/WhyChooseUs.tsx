"use client";

import React from "react";
import {
  FlameIcon,
  ChefHatIcon,
  TruckIcon,
  ShieldCheckIcon,
  ClockIcon,
  LeafIcon,
} from "@/components/ui/Icons";

interface BenefitCard {
  title: string;
  subtitle: string;
  description: string;
  icon: React.FC<{ size?: number | string; className?: string }>;
  accentColor: string;
  badge: string;
}

const BENEFITS: BenefitCard[] = [
  {
    title: "48-Hour Cold Fermented Dough",
    subtitle: "Airy, Crispy & Gentle on the Stomach",
    description:
      "Our vendors use genuine Italian Tipo 00 flour and natural sourdough starters with a minimum 48-hour cold fermentation for that coveted airy cornicione and leopard-spotted crust.",
    icon: FlameIcon,
    accentColor: "from-red-500/10 to-amber-500/10 border-red-500/20 text-red-600",
    badge: "Crafted Dough",
  },
  {
    title: "100% Verified Brick-Oven Pizzerias",
    subtitle: "Artisan Quality Guaranteed",
    description:
      "No mass-market conveyor belt ovens. Every restaurant partner on PizzaHub is vetted for authentic woodfired, coal, or stone-deck ovens operating at 450°C - 500°C.",
    icon: ChefHatIcon,
    accentColor: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600",
    badge: "Master Pizzaiolos",
  },
  {
    title: "Thermal-Shield Fast Delivery",
    subtitle: "Piping Hot to Your Table",
    description:
      "Custom insulated thermal pizza delivery bags ensure the crust stays crispy and the buffalo mozzarella stays melted without becoming soggy on the way.",
    icon: TruckIcon,
    accentColor: "from-orange-500/10 to-red-500/10 border-orange-500/20 text-orange-600",
    badge: "Under 35 Mins",
  },
  {
    title: "Transparent & Direct Orders",
    subtitle: "No Middleman Markup",
    description:
      "Support your neighborhood pizzerias directly. Track orders in real-time with instant vendor confirmation and transparent kitchen status updates.",
    icon: ShieldCheckIcon,
    accentColor: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600",
    badge: "Community First",
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-stone-100/60 dark:bg-stone-900/40 border-y border-stone-200/80 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider mb-4">
            <FlameIcon size={14} />
            <span>The PizzaHub Distinction</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C1917] dark:text-[#FBF9F5] tracking-tight">
            Why Choose <span className="text-red-600">PizzaHub?</span>
          </h2>
          <p className="mt-4 text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            We don’t do average fast-food slices. We connect discerning pizza enthusiasts with
            independent master bakers who take their sourdough, mozzarella, and ovens seriously.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative rounded-3xl p-7 sm:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.accentColor} flex items-center justify-center border shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3`}
                    >
                      <Icon size={26} />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {benefit.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 dark:text-white group-hover:text-red-600 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-500 mt-1">
                    {benefit.subtitle}
                  </p>
                  <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                    {benefit.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-4 text-xs font-medium text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <ClockIcon size={14} className="text-stone-400" />
                    <span>Real-time dispatch</span>
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <span className="flex items-center gap-1.5">
                    <LeafIcon size={14} className="text-emerald-500" />
                    <span>Pure natural ingredients</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
