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
  price: number;
  bakeTime: string;
  heatLevel: "Mild" | "Medium" | "Fiery";
  rating: number;
  crustType: string;
  imageUrl: string;
  tags: string[];
}

const FEATURED_PIZZAS: PizzaCraft[] = [
  {
    id: "pizza-1",
    name: "Diavola Hot Honey",
    italianName: "Pizza Piccante con Miele",
    description:
      "Crispy cupped pepperoni, San Marzano tomato reduction, fresh mozzarella, and artisanal habanero hot honey drizzle.",
    price: 18.5,
    bakeTime: "90s @ 485°C",
    heatLevel: "Fiery",
    rating: 4.95,
    crustType: "Woodfired Neapolitan",
    imageUrl:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700&auto=format&fit=crop&q=80",
    tags: ["Woodfired", "Artisan Honey", "Chef's Pick"],
  },
  {
    id: "pizza-2",
    name: "Truffle Forest Mushroom",
    italianName: "Funghi Selvatici e Tartufo",
    description:
      "Roasted cremini and chanterelles, black truffle cream, aged fontina, fresh thyme, and roasted garlic olive oil.",
    price: 21.0,
    bakeTime: "110s @ 470°C",
    heatLevel: "Mild",
    rating: 4.9,
    crustType: "Heritage Sourdough",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&auto=format&fit=crop&q=80",
    tags: ["Vegetarian", "Black Truffle", "Cream Base"],
  },
  {
    id: "pizza-3",
    name: "Margherita D.O.P. Bianca",
    italianName: "Regina Margherita Autentica",
    description:
      "Buffalo mozzarella from Campania, sweet Dattilini tomatoes, cold-pressed olive oil, and hand-torn sweet basil.",
    price: 16.0,
    bakeTime: "85s @ 500°C",
    heatLevel: "Mild",
    rating: 4.98,
    crustType: "Double-Zero Caputo Flour",
    imageUrl:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=700&auto=format&fit=crop&q=80",
    tags: ["Authentic Italian", "Buffalo Mozzarella", "Classic"],
  },
];

export const Hero: React.FC = () => {
  const [selectedPizza, setSelectedPizza] = useState<PizzaCraft>(FEATURED_PIZZAS[0]);
  const [crustOption, setCrustOption] = useState<"Woodfired" | "Sourdough" | "Stuffed Cheese">("Woodfired");
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
              className="pt-6 grid grid-cols-3 gap-3 sm:gap-6 border-t border-stone-200/80 dark:border-stone-800/80 max-w-xl"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-red-600 font-black text-lg sm:text-2xl font-heading whitespace-nowrap">
                  <ClockIcon size={18} className="shrink-0" />
                  <span className="shrink-0">25–35</span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-500">min</span>
                </div>
                <span className="text-xs font-medium text-stone-500 dark:text-stone-400 whitespace-nowrap">
                  Avg. Delivery Time
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-amber-500 font-black text-lg sm:text-2xl font-heading whitespace-nowrap">
                  <StarIcon size={17} className="shrink-0" />
                  <span className="shrink-0">4.95</span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-400">/ 5</span>
                </div>
                <span className="text-xs font-medium text-stone-500 dark:text-stone-400 whitespace-nowrap">
                  12,000+ Reviews
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-emerald-600 font-black text-lg sm:text-2xl font-heading whitespace-nowrap">
                  <ShieldCheckIcon size={18} className="shrink-0" />
                  <span className="shrink-0">100%</span>
                </div>
                <span className="text-xs font-medium text-stone-500 dark:text-stone-400 whitespace-nowrap">
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
                <div className="relative my-6 flex items-center justify-center">
                  <div
                    className={`relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden pizza-disc-shadow transition-transform duration-500 ease-out border-4 border-amber-500/20 ${
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

                  {/* Floating Price Pill */}
                  <div className="absolute -bottom-2 -right-1 sm:right-2 bg-stone-900 text-white dark:bg-white dark:text-stone-900 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-stone-800 dark:border-stone-200">
                    <span className="text-xs font-medium uppercase tracking-wider opacity-80">Only</span>
                    <span className="font-heading font-black text-xl text-amber-400 dark:text-red-600">
                      ${selectedPizza.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Selected Pizza Details */}
                <div className="space-y-2">
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

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                    {selectedPizza.description}
                  </p>
                </div>

                {/* Interactive Pizza Selector Pills (Hero Toy switch) */}
                <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
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
                          className={`p-2 rounded-xl text-left text-xs font-bold transition-all duration-200 border ${
                            isActive
                              ? "bg-red-500/10 border-red-500 text-red-600 shadow-sm"
                              : "bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/60 text-stone-700 dark:text-stone-300 hover:border-red-400"
                          }`}
                        >
                          <div className="truncate">{pizza.name.split(" ")[0]}</div>
                          <div className="text-[10px] font-medium text-stone-400">${pizza.price}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive Crust Selector */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-stone-400">Crust:</span>
                    {(["Woodfired", "Sourdough", "Stuffed Cheese"] as const).map((crust) => (
                      <button
                        key={crust}
                        onClick={() => setCrustOption(crust)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${
                          crustOption === crust
                            ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                            : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200"
                        }`}
                      >
                        {crust}
                      </button>
                    ))}
                  </div>

                  {/* Quick Order Button */}
                  <Link
                    href={`/menu/${selectedPizza.id}`}
                    className="w-full mt-2 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <span>Order {selectedPizza.name} Now</span>
                    <ArrowRightIcon size={14} />
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
