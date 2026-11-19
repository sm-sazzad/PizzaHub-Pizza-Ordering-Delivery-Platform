"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  PizzaIcon,
  MapPinIcon,
  ShoppingBagIcon,
  CloseIcon,
  PhoneIcon,
  CheckIcon,
  SparklesIcon,
  ShieldCheckIcon,
  FlameIcon,
  ClockIcon,
  HeartIcon,
} from "@/components/ui/Icons";

// Data shape for single pizza item
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
  vendorEmail?: string;
}

export default function MenuItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const toast = useToast();

  // Item and loading state
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Favorite State
  const [isFavorite, setIsFavorite] = useState(false);

  // Order Popup Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch item details from API endpoint /menu?id=:id
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/menu?id=${id}`);
        const data = await response.json();
        setItem(data);

        // Check if item is already in user's saved favorites
        if (data?._id && typeof window !== "undefined") {
          try {
            const saved: string[] = JSON.parse(
              localStorage.getItem("pizzahub_favorites") || "[]",
            );
            setIsFavorite(saved.includes(data._id));
          } catch {
            // Storage error fallback
          }
        }
      } catch (error) {
        console.error("Failed to fetch menu item details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItemDetails();
    }
  }, [id]);

  // Handle clicking "Order Now"
  const handleOpenOrderModal = () => {
    // If not logged in, prompt user to sign in first
    if (!isLoggedIn) {
      toast.warning("Please sign in to place an order.", "Login Required");
      router.push("/signin");
      return;
    }

    // Prevent vendors from ordering their own pizzas
    if (user?.email && item?.vendorEmail && user.email === item.vendorEmail) {
      toast.error("You cannot order your own menu item.", "Vendor Restriction");
      return;
    }

    setIsModalOpen(true);
  };

  // Handle toggling favorite status
  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      toast.warning(
        "Please sign in to save pizzas to your favorites.",
        "Login Required",
      );
      return;
    }

    const nextState = !isFavorite;
    setIsFavorite(nextState);

    if (item?._id && typeof window !== "undefined") {
      try {
        const saved: string[] = JSON.parse(
          localStorage.getItem("pizzahub_favorites") || "[]",
        );
        let updated: string[];
        if (nextState) {
          updated = Array.from(new Set([...saved, item._id]));
          toast.success(
            `"${item.itemName}" added to your favorites!`,
            "Saved to Favorites",
          );
        } else {
          updated = saved.filter((favId) => favId !== item._id);
          toast.info(
            `"${item.itemName}" removed from your favorites.`,
            "Removed from Favorites",
          );
        }
        localStorage.setItem("pizzahub_favorites", JSON.stringify(updated));
      } catch {
        // Fallback
      }
    }
  };

  // Handle Order Submission
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item) return;

    // Validate phone and address
    if (!phone.trim()) {
      toast.warning("Please enter your mobile phone number.", "Phone Required");
      return;
    }

    if (!address.trim()) {
      toast.warning(
        "Please provide your delivery address.",
        "Address Required",
      );
      return;
    }

    setIsSubmitting(true);

    // Prepare complete order information
    const orderData = {
      menuItemId: item._id,
      itemName: item.itemName,
      category: item.category,
      price: item.price,
      image: item.images?.[0] || item.image || "",
      vendorName: item.vendorName || "Artisan Kitchen",
      vendorEmail: item.vendorEmail || "",
      customerName: user?.name || "Customer",
      customerEmail: user?.email || "",
      customerPhone: phone.trim(),
      deliveryAddress: address.trim(),
      specialNotes: notes.trim(),
      totalAmount: item.price,
      status: "pending",
      paymentStatus: "paid",
      createdAt: new Date().toISOString(),
    };

    try {
      // Send POST request to backend /orders
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const resData = await res.json();
      if (resData.insertedId) {
        // Show success toast
        toast.success(
          `Your order for "${item.itemName}" was placed successfully!`,
          "Order Confirmed",
        );
      }
    } catch (error) {
      // Graceful fallback if backend /orders is not yet wired
      console.log("Order submitted to client state:", error);
    } finally {
      setIsSubmitting(false);
      // Close the popup modal
      setIsModalOpen(false);

      // Reset form fields
      setPhone("");
      setAddress("");
      setNotes("");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-24 px-4 text-center">
        <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-stone-500">
          Loading delicious pizza details...
        </p>
      </div>
    );
  }

  // Not Found State
  if (!item || !item.itemName) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto">
          <PizzaIcon size={32} />
        </div>
        <h2 className="font-heading text-2xl font-bold text-stone-900 dark:text-white">
          Pizza Recipe Not Found
        </h2>
        <p className="text-xs text-stone-500">
          The requested pizza item could not be loaded or may have been removed.
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <span>Back to Menu</span>
        </Link>
      </div>
    );
  }

  // Gather images with fallback
  const imagesList =
    item.images && item.images.length > 0
      ? item.images
      : [
          item.image ||
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
        ];

  const currentDisplayImage = imagesList[selectedImageIndex] || imagesList[0];

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-red-600 transition-colors uppercase tracking-wider"
        >
          <span>&larr; Back to Menu</span>
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentDisplayImage}
              alt={item.itemName}
              className="w-full h-full object-cover"
            />
            {/* Category Badge overlay */}
            <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 shadow-sm">
              {item.category}
            </span>
          </div>

          {/* Thumbnail Gallery (if multiple images) */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    selectedImageIndex === idx
                      ? "border-red-600 ring-2 ring-red-600/30 scale-105"
                      : "border-stone-200 dark:border-stone-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`${item.itemName} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div className="space-y-6">
          {/* Location & Kitchen badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
              <MapPinIcon size={14} />
              <span>{item.location || "Woodfired Kitchen"}</span>
            </span>

            {item.vendorName && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <SparklesIcon size={14} />
                <span>Chef: {item.vendorName}</span>
              </span>
            )}
          </div>

          {/* Pizza Title */}
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
              {item.itemName}
            </h1>
            <p className="font-heading text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
              ${item.price?.toFixed(2)}
            </p>
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert">
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {item.description ||
                "Handcrafted artisan pizza prepared with authentic slow-fermented dough, crushed San Marzano tomato sauce, and premium whole-milk mozzarella cheese."}
            </p>
          </div>

          {/* Highlights checklist */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Kitchen Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-center gap-2">
                <FlameIcon size={16} className="text-amber-500 shrink-0" />
                <span>Wood-Fired Oven Baked</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon size={16} className="text-emerald-500 shrink-0" />
                <span>100% Whole Milk Mozzarella</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon size={16} className="text-red-500 shrink-0" />
                <span>Fast 30-min Hot Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon
                  size={16}
                  className="text-emerald-500 shrink-0"
                />
                <span>Hygienic Contactless Prep</span>
              </div>
            </div>
          </div>

          {/* Order Action & Favorite Heart Button */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenOrderModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <ShoppingBagIcon size={20} />
              <span>Order Now &bull; ${item.price?.toFixed(2)}</span>
            </button>

            {/* Favorite / Heart Button */}
            <button
              type="button"
              onClick={handleToggleFavorite}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                isFavorite
                  ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-900/50 text-red-600 scale-105 shadow-md shadow-red-500/10"
                  : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50/50 dark:hover:bg-red-950/20"
              }`}
            >
              <HeartIcon size={22} filled={isFavorite} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POPUP ORDER MODAL                                                         */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center">
                  <PizzaIcon size={18} />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-stone-900 dark:text-white">
                    Place Your Pizza Order
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Review order details and enter delivery destination.
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {/* Pizza Item Summary Pill */}
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentDisplayImage}
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                    {item.itemName}
                  </h4>
                  <p className="text-[11px] text-stone-500">{item.category}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-heading text-sm font-bold text-amber-600 dark:text-amber-400">
                  ${item.price?.toFixed(2)}
                </span>
                <p className="text-[10px] text-emerald-600 font-semibold">
                  Free Delivery
                </p>
              </div>
            </div>

            {/* VISUAL PAYMENT CARD (Mastercard / Visa Simulation) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Payment Method Preview
              </span>
              <div className="relative rounded-2xl bg-gradient-to-tr from-stone-950 via-stone-900 to-amber-950 text-white p-5 border border-amber-500/30 shadow-xl overflow-hidden space-y-4">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

                {/* Top: Chip & Brand Logo */}
                <div className="flex items-center justify-between">
                  {/* Gold Chip Mockup */}
                  <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 border border-amber-600/40 relative shadow-xs flex items-center justify-center">
                    <div className="w-6 h-4 border border-amber-800/40 rounded-xs" />
                  </div>

                  {/* Mastercard Simulation Two Circles */}
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-red-600 opacity-90 -mr-2.5 shadow-sm" />
                    <div className="w-6 h-6 rounded-full bg-amber-500 opacity-90 shadow-sm" />
                  </div>
                </div>

                {/* Middle: Masked Card Number */}
                <div className="pt-1">
                  <p className="font-mono text-sm tracking-widest text-stone-200">
                    &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;
                    &bull;&bull;&bull;&bull; 8842
                  </p>
                </div>

                {/* Bottom: Cardholder Name & Expiry */}
                <div className="flex items-center justify-between text-[11px] text-stone-300 pt-1">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-stone-400 block">
                      Cardholder
                    </span>
                    <strong className="text-white uppercase truncate max-w-[180px] inline-block">
                      {user?.name || "CUSTOMER"}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-stone-400 block">
                      Expires
                    </span>
                    <strong className="text-white">12/28</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* ORDER INPUT FORM */}
            <form onSubmit={handleConfirmOrder} className="space-y-4 pt-1">
              {/* Customer Email (Pre-filled from session) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Account Email
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-500 dark:text-stone-400 cursor-not-allowed"
                />
              </div>

              {/* Mobile Phone Number */}
              <div className="space-y-1">
                <label
                  htmlFor="customerPhone"
                  className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
                >
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <PhoneIcon
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                  <input
                    id="customerPhone"
                    type="tel"
                    required
                    placeholder="+880 1700-000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1">
                <label
                  htmlFor="deliveryAddress"
                  className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
                >
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPinIcon
                    size={16}
                    className="absolute left-3.5 top-3 text-stone-400"
                  />
                  <textarea
                    id="deliveryAddress"
                    rows={2}
                    required
                    placeholder="House / Apartment #, Road #, Area, City"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Special Instructions (Optional) */}
              <div className="space-y-1">
                <label
                  htmlFor="specialNotes"
                  className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
                >
                  Special Notes (Optional)
                </label>
                <input
                  id="specialNotes"
                  type="text"
                  placeholder="e.g. Extra napkins, please call upon arrival"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span>Placing Order...</span>
                  ) : (
                    <span>Confirm Order &bull; ${item.price?.toFixed(2)}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
