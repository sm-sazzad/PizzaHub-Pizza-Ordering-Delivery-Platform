"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FlameIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  PizzaIcon,
} from "@/components/ui/Icons";

interface PizzaCraft {
  id: string;
  name: string;
  italianName: string;
  description: string;
  bakeTime: string;
  heatLevel: "Mild" | "Medium" | "Fiery";
  rating: number;
  crustType: string;
  imageUrl: string;
  styleName: string;
  subtitle: string;
}

const FEATURED_PIZZAS: PizzaCraft[] = [
  {
    id: "pizza-1",
    name: "Diavola Hot Honey",
    italianName: "Pizza Piccante con Miele",
    description:
      "Crispy cupped pepperoni, San Marzano tomato reduction, fresh mozzarella, and artisanal habanero hot honey drizzle.",
    bakeTime: "90s @ 485°C",
    heatLevel: "Fiery",
    rating: 4.95,
    crustType: "Woodfired Neapolitan",
    styleName: "Diavola",
    subtitle: "Spicy Pepperoni",
    imageUrl:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=85",
  },
  {
    id: "pizza-2",
    name: "Truffle Forest Mushroom",
    italianName: "Funghi Selvatici e Tartufo",
    description:
      "Roasted cremini and chanterelles, black truffle cream, aged fontina, fresh thyme, and roasted garlic olive oil.",
    bakeTime: "110s @ 470°C",
    heatLevel: "Mild",
    rating: 4.9,
    crustType: "Heritage Sourdough",
    styleName: "Truffle",
    subtitle: "Gourmet Mushroom",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=85",
  },
  {
    id: "pizza-3",
    name: "Classic Margherita",
    italianName: "Regina Margherita D.O.P.",
    description:
      "Buffalo mozzarella from Campania, sweet Dattilini tomatoes, cold-pressed olive oil, and hand-torn sweet basil.",
    bakeTime: "85s @ 500°C",
    heatLevel: "Mild",
    rating: 4.98,
    crustType: "Double-Zero Caputo Flour",
    styleName: "Classic",
    subtitle: "Naples Traditional",
    imageUrl:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800&auto=format&fit=crop&q=85",
  },
];

export const Hero: React.FC = () => {
  const [selectedPizza, setSelectedPizza] = useState<PizzaCraft>(FEATURED_PIZZAS[0]);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const handleSelectPizza = (pizza: PizzaCraft) => {
    if (pizza.id === selectedPizza.id) return;
    setIsRotating(true);
    setTimeout(() => {
      setSelectedPizza(pizza);
      setIsRotating(false);
    }, 180);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Warm Ambient Glow Overlays (UI/UX Pro Max depth principle) */}
      <div className="ambient-glow-pizza w-96 h-96 -top-20 -left-20 bg-rose-500/20" />
      <div className="ambient-glow-pizza w-[500px] h-[500px] top-1/3 -right-24 bg-amber-500/15" />
      <div className="ambient-glow-pizza w-80 h-80 bottom-0 left-1/3 bg-orange-600/10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Narrative & Conversion CTAs */}
          <div className="lg:col-span-7 flex flex-col space-y-7 text-left">
            {/* Value Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 w-fit"
            >
              <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                Stone-Baked & Oven-Fresh Delivery
              </span>
              <span className="text-stone-300 dark:text-stone-700">|</span>
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1">
                <FlameIcon size={13} className="text-amber-500" /> 485°C Wood Fired
              </span>
            </motion.div>

            {/* Clear, Magnetic Headline (Assignment 9 + UI/UX Pro Max typography) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#1C1917] dark:text-[#FBF9F5] leading-[1.08] tracking-tight"
            >
              Hot & Fresh Pizza{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-600 to-orange-500">
                Delivered Direct
              </span>{" "}
              to Your Door.
            </motion.h1>

            {/* Concise, appetizing description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
              className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed font-normal"
            >
              Discover verified local artisan pizzerias, browse mouthwatering stone-baked menus,
              and indulge in handcrafted pies with real buffalo mozzarella and 48-hour fermented
              dough.
            </motion.p>

            {/* Primary Action Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <Link
                href="/menu"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-base shadow-xl shadow-red-600/25 hover:shadow-2xl hover:shadow-red-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                <ShoppingBagIcon size={20} />
                <span>Explore Pizza Menu</span>
                <ArrowRightIcon
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/signup?role=vendor"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-base hover:border-amber-500/50 hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-all duration-200"
              >
                <PizzaIcon size={18} className="text-amber-500" />
                <span>Restaurant Partner Portal</span>
              </Link>
            </motion.div>

            {/* Trust Metrics Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.4, ease: "easeOut" }}
              className="pt-6 grid grid-cols-3 gap-2 sm:gap-6 border-t border-stone-200/80 dark:border-stone-800/80 max-w-xl"
            >
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5 text-red-600 font-black text-sm sm:text-2xl font-heading">
                  <ClockIcon size={16} className="shrink-0" />
                  <span className="shrink-0">25–35</span>
                  <span className="text-[10px] sm:text-sm font-semibold text-stone-500">min</span>
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-stone-500 dark:text-stone-400 leading-snug mt-0.5">
                  Avg. Delivery Time
                </span>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5 text-amber-500 font-black text-sm sm:text-2xl font-heading">
                  <StarIcon size={15} className="shrink-0" />
                  <span className="shrink-0">4.95</span>
                  <span className="text-[10px] sm:text-sm font-semibold text-stone-400">/ 5</span>
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-stone-500 dark:text-stone-400 leading-snug mt-0.5">
                  12,000+ Reviews
                </span>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5 text-emerald-600 font-black text-sm sm:text-2xl font-heading">
                  <ShieldCheckIcon size={16} className="shrink-0" />
                  <span className="shrink-0">100%</span>
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-stone-500 dark:text-stone-400 leading-snug mt-0.5">
                  Verified Vendors
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: SIGNATURE HERO TOY (Interactive Woodfired Oven Showcase) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-orange-500 rounded-3xl blur-xl opacity-30 animate-pulse" />

              {/* Interactive Showcase Card */}
              <div className="relative rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-6 sm:p-7 shadow-2xl transition-all duration-300">
                {/* Live Oven Telemetry Header */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-red-500/10 text-red-600">
                      <FlameIcon size={16} />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        Oven Status
                      </p>
                      <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                        Live Hearth @ {selectedPizza.bakeTime}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <SparklesIcon size={12} />
                    <span>{selectedPizza.heatLevel} Heat</span>
                  </span>
                </div>

                {/* Interactive Pizza Visual Disc */}
                <div className="relative my-4 flex items-center justify-center">
                  <div
                    className={`relative w-52 h-52 sm:w-60 sm:h-60 rounded-full overflow-hidden pizza-disc-shadow transition-transform duration-500 ease-out border-4 border-amber-500/20 shadow-2xl ${
                      isRotating ? "scale-95 rotate-45 opacity-60" : "scale-100 rotate-0 opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedPizza.imageUrl}
                      alt={selectedPizza.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Floating Style Pill (Styled exactly like ONLY $18, but with the 3 flavor options!) */}
                  <div className="absolute -bottom-2 -right-1 sm:right-3 bg-white dark:bg-stone-900 text-stone-900 dark:text-white px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      STYLE
                    </span>
                    <span className="font-heading font-black text-lg text-red-600 dark:text-red-500">
                      {selectedPizza.styleName}
                    </span>
                  </div>
                </div>

                {/* Selected Pizza Details */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h3 className="font-heading text-xl font-black text-stone-900 dark:text-white">
                        {selectedPizza.name}
                      </h3>
                      <p className="text-xs italic text-stone-500 dark:text-stone-400">
                        {selectedPizza.italianName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg">
                      <StarIcon size={13} />
                      <span>{selectedPizza.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                    {selectedPizza.description}
                  </p>
                </div>

                {/* Interactive Pizza Selector Pills (Hero Toy switch) */}
                <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
                    <span>Switch Artisan Pie:</span>
                    <span className="text-[11px] text-amber-600 font-semibold">Live Preview</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {FEATURED_PIZZAS.map((pizza) => {
                      const isActive = pizza.id === selectedPizza.id;
                      return (
                        <button
                          key={pizza.id}
                          onClick={() => handleSelectPizza(pizza)}
                          className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all duration-200 border cursor-pointer ${
                            isActive
                              ? "bg-red-500/10 border-red-500 text-red-600 shadow-sm"
                              : "bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/60 text-stone-700 dark:text-stone-300 hover:border-red-400"
                          }`}
                        >
                          <div className="truncate font-heading font-bold text-xs">{pizza.styleName}</div>
                          <div className="text-[10px] font-medium text-stone-400 truncate">{pizza.subtitle}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explore Menu Button (Directs to /menu) */}
                  <Link
                    href="/menu"
                    className="w-full mt-2 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg group"
                  >
                    <span>Explore Full Artisan Menu</span>
                    <ArrowRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
