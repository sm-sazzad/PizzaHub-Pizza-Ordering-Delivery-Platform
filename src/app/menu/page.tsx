"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PizzaIcon,
  SearchIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";
import { PizzaCardSkeleton } from "@/components/ui/Skeleton";

// Define the Menu Item data shape
interface MenuItem {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images?: string[];
  image?: string;
  vendorName?: string;
}

// Available categories for filtering
const CATEGORIES = [
  "All",
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

function BrowseMenuContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  // Derive initial active category from URL parameter (if user arrived from homepage category click)
  const activeUrlCategory = categoryFromUrl
    ? CATEGORIES.find(
        (cat) => cat.toLowerCase() === categoryFromUrl.toLowerCase(),
      ) || "All"
    : null;

  // 1. Simple states for items, loading, search, category, and sorting
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("default");

  // Current active category: manual selection takes precedence over URL parameter, fallback to "All"
  const currentCategory = selectedCategory ?? activeUrlCategory ?? "All";

  // 2. Fetch all menu items from API endpoint /menu
  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/menu`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Failed to load menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  // 3. Simple filter by name and category
  let displayedItems = items.filter((item) => {
    const nameMatches = item.itemName
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const categoryMatches =
      currentCategory === "All" || item.category === currentCategory;

    return nameMatches && categoryMatches;
  });

  // 4. Simple sort by price
  if (sortOrder === "low-to-high") {
    displayedItems = [...displayedItems].sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high-to-low") {
    displayedItems = [...displayedItems].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center space-y-2"
      >
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
          Browse Pizza Menu
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Explore delicious handcrafted pizzas from local kitchens.
        </p>
      </motion.div>

      {/* Filter and Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="bg-white dark:bg-stone-900 p-5 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4"
      >
        {/* Top Row: Search Input & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search by Name */}
          <div className="relative w-full sm:max-w-md">
            <SearchIcon
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              placeholder="Search pizza by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Sort By Price Dropdown */}
          <div className="w-full sm:w-auto flex justify-end">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-300 focus:outline-none cursor-pointer"
            >
              <option value="default" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">Default Sort</option>
              <option value="low-to-high" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">Price: Low to High</option>
              <option value="high-to-low" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Buttons Below Search Field */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = currentCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PizzaCardSkeleton key={i} />
          ))}
        </div>
      ) : displayedItems.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto mb-3">
            <PizzaIcon size={32} />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">
            No Pizzas Found
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Try searching for something else or reset your category filter.
          </p>
        </div>
      ) : (
        /* Pizza Cards Grid */
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {displayedItems.map((item, index) => {
              const pizzaId = item._id;
              const imageUrl =
                item.images?.[0] ||
                item.image ||
                "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80";

              return (
                <motion.div
                  layout
                  key={pizzaId}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.04, 0.25),
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-red-500/30 transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Pizza Image */}
                    <div className="relative h-48 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={item.itemName}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 bg-black/60 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-xs">
                        {item.category}
                      </span>
                    </div>

                    {/* Pizza Info */}
                    <div className="p-5 space-y-2">
                      <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                        <MapPinIcon size={12} />
                        <span>{item.location || "Local Kitchen"}</span>
                      </p>

                      <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-white line-clamp-1">
                        {item.itemName}
                      </h3>

                      <p className="text-xs text-stone-500 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Price and Order Button */}
                  <div className="p-5 pt-0 border-t border-stone-100 dark:border-stone-800 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">
                        Price
                      </span>
                      <span className="text-xl font-black text-stone-900 dark:text-white font-heading">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </div>

                    <Link
                      href={`/menu/${pizzaId}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                    >
                      <span>Order Now</span>
                      <ArrowRightIcon size={14} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default function BrowseMenuPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="space-y-3">
            <div className="h-8 w-60 rounded-2xl bg-stone-200 dark:bg-stone-800" />
            <div className="h-4 w-96 max-w-full rounded-md bg-stone-200 dark:bg-stone-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PizzaCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <BrowseMenuContent />
    </Suspense>
  );
}
