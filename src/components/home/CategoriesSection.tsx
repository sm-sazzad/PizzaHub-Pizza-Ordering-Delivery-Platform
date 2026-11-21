"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon, SparklesIcon } from "@/components/ui/Icons";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  itemCount: string;
  imageUrl: string;
  badge: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Classic Pizzas",
    slug: "classic",
    tagline: "Timeless Italian heritage recipes with San Marzano tomatoes & fior di latte.",
    itemCount: "24 Varieties",
    imageUrl:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",
    badge: "Heritage",
  },
  {
    id: "cat-2",
    name: "Vegetarian Pizzas",
    slug: "vegetarian",
    tagline: "Farm-fresh vegetables, roasted artichokes, wild mushrooms, and pesto.",
    itemCount: "18 Varieties",
    imageUrl:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&auto=format&fit=crop&q=80",
    badge: "Garden Fresh",
  },
  {
    id: "cat-3",
    name: "Meat Lovers",
    slug: "meat-lovers",
    tagline: "Artisanal spicy salami, smoked pancetta, beef brisket, and prosciutto cotto.",
    itemCount: "22 Varieties",
    imageUrl:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80",
    badge: "Hearty",
  },
  {
    id: "cat-4",
    name: "Specialty / Gourmet Pizzas",
    slug: "specialty-gourmet",
    tagline: "Black summer truffles, fig & gorgonzola, smoked duck, and burrata crumbles.",
    itemCount: "14 Varieties",
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
    badge: "Chef's Craft",
  },
  {
    id: "cat-5",
    name: "Sides & Appetizers",
    slug: "sides-appetizers",
    tagline: "Truffle parmesan potato wedges, wood-baked garlic knots & stuffed arancini.",
    itemCount: "16 Varieties",
    imageUrl:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80",
    badge: "Crispy",
  },
  {
    id: "cat-6",
    name: "Beverages & Desserts",
    slug: "beverages-desserts",
    tagline: "Classic Venetian tiramisu, Italian cannoli, and craft sparkling sodas.",
    itemCount: "12 Varieties",
    imageUrl:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
    badge: "Sweet & Chilled",
  },
];

export const CategoriesSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-3">
              <SparklesIcon size={13} />
              <span>Explore Authentic Flavors</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C1917] dark:text-[#FBF9F5] tracking-tight">
              Curated Pizza <span className="text-red-600">Categories</span>
            </h2>
            <p className="mt-3 text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
              From historic Neapolitan classics to modern culinary creations — discover artisan pies
              baked to perfection by master pizzaiolos.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors group"
          >
            <span>View Complete Menu</span>
            <ArrowRightIcon
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {/* Categories Grid (Asymmetrical responsive grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <Link
                href={`/menu?category=${encodeURIComponent(category.name)}`}
                className="group relative rounded-3xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col h-full cursor-pointer"
              >
                {/* Category Image Box with Soft Zoom */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 backdrop-blur-md shadow-sm">
                      {category.badge}
                    </span>
                  </div>

                  {/* Item Count Pill */}
                  <div className="absolute bottom-3 left-4">
                    <span className="text-xs font-semibold text-white/90">
                      {category.itemCount}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-stone-900 dark:text-white group-hover:text-red-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {category.tagline}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-bold text-red-600">
                    <span>Browse Category</span>
                    <div className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all duration-200">
                      <ArrowRightIcon size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
