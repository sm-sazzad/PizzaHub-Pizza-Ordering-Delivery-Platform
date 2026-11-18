"use client";

import React from "react";
import Link from "next/link";
import {
  PizzaIcon,
  XIcon,
  InstagramIcon,
  FacebookIcon,
  YouTubeIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ShieldCheckIcon,
} from "@/components/ui/Icons";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#12100E] text-stone-300 border-t border-stone-800/80 pt-16 pb-12 relative overflow-hidden">
      {/* Decorative top accent gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-orange-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-stone-800/80">
          {/* Col 1: Brand Info & Description (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3 w-fit group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
                <PizzaIcon size={22} className="text-white" />
              </div>
              <span className="font-heading text-2xl font-black tracking-tight text-white">
                Pizza<span className="text-red-600">Hub</span>
              </span>
            </Link>

            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              The premier platform connecting passionate foodies with independent artisan pizzerias.
              Handcrafted stone-baked pizzas, authentic buffalo mozzarella, and blistered crusts
              delivered fresh to your doorstep.
            </p>

            {/* Social Media Links with explicit new X logo */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:border-stone-600 transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <XIcon size={16} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:border-stone-600 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:border-stone-600 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon size={18} />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:border-stone-600 transition-colors"
                aria-label="YouTube"
              >
                <YouTubeIcon size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-stone-400 hover:text-white hover:underline transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="text-stone-400 hover:text-white hover:underline transition-colors"
                >
                  Browse Pizza Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/signin"
                  className="text-stone-400 hover:text-white hover:underline transition-colors"
                >
                  Sign In to Account
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-stone-400 hover:text-white hover:underline transition-colors"
                >
                  Customer Registration
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-stone-400 hover:text-white hover:underline transition-colors"
                >
                  Member Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Restaurants / Vendors (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              For Vendors
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/signup?role=vendor"
                  className="text-stone-400 hover:text-white hover:underline transition-colors"
                >
                  Join as Restaurant
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-stone-400 hover:text-white hover:underline transition-colors"
                >
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/menu"
                  className="text-stone-400 hover:text-white hover:underline transition-colors"
                >
                  Menu Item Manager
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/vendor-orders"
                  className="text-stone-400 hover:text-white hover:underline transition-colors"
                >
                  Incoming Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Support (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Contact & Support
            </h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPinIcon size={18} className="text-red-500 shrink-0 mt-0.5" />
                <span>Via Toledo 42, Artisan Food District, Dhaka / Rome</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneIcon size={18} className="text-amber-500 shrink-0" />
                <span>+880 1700-PIZZAHUB</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MailIcon size={18} className="text-emerald-500 shrink-0" />
                <span>support@pizzahub.io</span>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300">
                  <ShieldCheckIcon size={16} className="text-emerald-400 shrink-0" />
                  <span>Stripe Verified & SSL Encrypted</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} PizzaHub Inc. All rights reserved. Built for Assignment 9.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-stone-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-stone-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-stone-400 transition-colors">
              Cookie Preferences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
