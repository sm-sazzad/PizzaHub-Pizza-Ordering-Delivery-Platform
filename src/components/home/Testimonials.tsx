"use client";

import React from "react";
import { StarIcon, QuoteIcon, ShieldCheckIcon } from "@/components/ui/Icons";

const REVIEWS = [
  {
    id: "rev-1",
    author: "Marco D'Angelo",
    role: "Food Journalist & Pizza Aficionado",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    pizzeria: "Luigi's Woodfired Pizzeria",
    item: "Diavola Hot Honey",
    comment:
      "I was skeptical about pizza delivery maintaining a crispy cornicione, but PizzaHub proved me completely wrong. The crust had authentic charring, and the hot honey was out of this world.",
  },
  {
    id: "rev-2",
    author: "Elena Rostova",
    role: "Verified Foodie Customer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    pizzeria: "Napoli Artisan Hearth",
    item: "Truffle Forest Mushroom",
    comment:
      "Being able to filter by stone-oven type and sourdough crust is a dream come true for real pizza enthusiasts. The delivery arrived in under 30 minutes, steaming hot!",
  },
  {
    id: "rev-3",
    author: "Tariq Mansoor",
    role: "Local Gourmet Enthusiast",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    pizzeria: "Bella Romana Kitchen",
    item: "Margherita D.O.P.",
    comment:
      "Direct ordering from neighborhood pizza masters without massive corporate markups. The buffalo mozzarella melted like butter, and the customer service was flawless.",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-stone-100/50 dark:bg-stone-900/30 border-t border-stone-200/80 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-4">
            <StarIcon size={14} className="text-amber-500" />
            <span>Real Foodie Impressions</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C1917] dark:text-[#FBF9F5] tracking-tight">
            Loved by Pizza <span className="text-red-600">Purists</span>
          </h2>
          <p className="mt-3 text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            Read authentic reviews from thousands of pizza lovers who refuse to compromise on crust,
            sauce, and bake quality.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="group relative rounded-3xl p-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-amber-500/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header with stars and quote icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <StarIcon key={i} size={16} />
                    ))}
                  </div>
                  <QuoteIcon size={24} className="text-stone-300 dark:text-stone-700" />
                </div>

                {/* Comment */}
                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>

                {/* Ordered Item Badge */}
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                  <span>Ordered:</span>
                  <strong className="text-red-600">{review.item}</strong>
                </div>
              </div>

              {/* Author profile */}
              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-stone-200 ring-2 ring-amber-500/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-bold text-stone-900 dark:text-white truncate">
                      {review.author}
                    </p>
                    <ShieldCheckIcon size={14} className="text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
