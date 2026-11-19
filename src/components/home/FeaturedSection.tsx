"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FlameIcon,
  MapPinIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  PizzaIcon,
} from "@/components/ui/Icons";

// Data shape for featured menu item
interface FeaturedItem {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location?: string;
  images?: string[];
  image?: string;
  vendorName?: string;
}

export function FeaturedSection() {
  const [items, setItems] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured items from endpoint /features
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/features`);
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch (error) {
        console.error("Failed to load featured items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-stone-50/50 dark:bg-stone-900/30 border-y border-stone-200/60 dark:border-stone-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/20">
              <FlameIcon size={14} className="text-red-500" />
              <span>Hot From The Oven</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
              Featured Artisan Pizzas
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed">
              Handpicked signature recipes baked to perfection with
              slow-fermented dough and authentic wood-fired ovens.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 transition-colors uppercase tracking-wider group shrink-0"
          >
            <span>Explore Full Menu</span>
            <ArrowRightIcon
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-4/3 rounded-2xl bg-stone-200 dark:bg-stone-800" />
                <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded-lg w-2/3" />
                <div className="h-4 bg-stone-100 dark:bg-stone-800/60 rounded-lg w-full" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded-lg w-16" />
                  <div className="h-9 bg-stone-200 dark:bg-stone-800 rounded-xl w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto">
              <PizzaIcon size={28} />
            </div>
            <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-white">
              No Featured Items Available
            </h3>
            <p className="text-xs text-stone-500">
              Check back soon for freshly baked artisan recipes!
            </p>
          </div>
        ) : (
          /* Featured Items Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.map((item, index) => {
              const imageSrc =
                item.images?.[0] ||
                item.image ||
                "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80";

              return (
                <div
                  key={item._id || `featured-${index}`}
                  className="group rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-red-500/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageSrc}
                        alt={item.itemName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Category Badge */}
                      <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs text-stone-800 dark:text-stone-200 border border-stone-200/80 dark:border-stone-700 shadow-xs">
                        {item.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 space-y-3">
                      {item.location && (
                        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 font-semibold">
                          <MapPinIcon size={13} className="text-red-500" />
                          <span>{item.location}</span>
                        </div>
                      )}

                      <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-white group-hover:text-red-600 transition-colors line-clamp-1">
                        {item.itemName}
                      </h3>

                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Price & CTA Button */}
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold block">
                        Price
                      </span>
                      <span className="font-heading text-xl font-black text-amber-600 dark:text-amber-400">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <Link
                      href={`/menu/${item._id}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <ShoppingBagIcon size={14} />
                      <span>Order</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
