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
  ShieldCheckIcon,
  FlameIcon,
  ClockIcon,
  HeartIcon,
  CalendarIcon,
  StoreIcon,
  AlertCircleIcon,
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

  // Validate MongoDB ObjectId (24 hexadecimal characters)
  const isInvalidId = !id || !/^[0-9a-fA-F]{24}$/.test(id);

  // Item, loading, and not found states
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(!isInvalidId);
  const [isNotFound, setIsNotFound] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Favorite State
  const [isFavorite, setIsFavorite] = useState(false);

  // Order Popup Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch item details from API endpoint /menu?id=:id
  useEffect(() => {
    if (isInvalidId) return;

    const fetchItemDetails = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/menu?id=${id}`);

        if (!response.ok) {
          setIsNotFound(true);
          return;
        }

        const data = await response.json();

        if (!data || !data._id || !data.itemName) {
          setIsNotFound(true);
          return;
        }

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
        setIsNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id, isInvalidId]);

  // Handle clicking "Order Now"
  const handleOpenOrderModal = () => {
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
      deliveryDate: deliveryDate || new Date().toISOString().split("T")[0],
      specialNotes: notes.trim(),
      totalAmount: item.price,
      status: "pending",
      paymentStatus: "paid",
      createdAt: new Date().toISOString(),
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const resData = await res.json();

      // If backend blocked duplicate active order (status 409 or other error)
      if (!res.ok) {
        toast.error(
          resData.message || "Failed to place order. Please try again.",
          "Order Blocked",
        );
        return;
      }

      if (resData.insertedId) {
        toast.success(
          `Your order for "${item.itemName}" was placed successfully!`,
          "Order Confirmed",
        );
        setIsModalOpen(false);
        setPhone("");
        setAddress("");
        setNotes("");
      }
    } catch (error) {
      console.log("Order error:", error);
      toast.error("Failed to submit order. Please try again.", "Order Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Invalid or Not Found Error State (Assignment 9 Requirement)
  if (isInvalidId || isNotFound) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto shadow-sm">
          <AlertCircleIcon size={32} />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
            {isInvalidId ? "Invalid Item ID" : "Pizza Not Found"}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-3">
            পিৎজা আইটেম পাওয়া যায়নি
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2 max-w-md mx-auto leading-relaxed">
            {isInvalidId
              ? "প্রদত্ত Item ID-টি ইনভ্যালিড। MongoDB ObjectId অবশ্যই ২৪ ক্যারেক্টারের হেক্সাডেসিমেল স্ট্রিং হতে হবে।"
              : "অনুরোধকৃত পিৎজা রেসিপিটি মেনু ক্যাটালগে নেই অথবা ডাটাবেজ থেকে সরিয়ে ফেলা হয়েছে।"}
          </p>
        </div>

        {/* Monospace ID Badge */}
        <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-600 dark:text-stone-400 max-w-sm mx-auto flex items-center justify-between">
          <span>Requested ID:</span>
          <span className="font-bold text-rose-500 truncate max-w-[200px]">
            {id || "None"}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <PizzaIcon size={16} />
            <span>সব মেনু দেখুন</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <span>হোমে যান</span>
          </Link>
        </div>
      </div>
    );
  }

  // 2. Loading State
  if (loading || !item) {
    return (
      <div className="max-w-5xl mx-auto py-24 px-4 text-center">
        <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-stone-500">
          Loading delicious pizza details...
        </p>
      </div>
    );
  }

  // Gather multiple images with fallback
  const imagesList: string[] =
    Array.isArray(item.images) && item.images.length > 0
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
        {/* Left Column: Image Gallery (Multiple Images Support) */}
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

            {/* Image counter pill if multiple images exist */}
            {imagesList.length > 1 && (
              <span className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-xs text-white">
                {selectedImageIndex + 1} / {imagesList.length}
              </span>
            )}
          </div>

          {/* Thumbnail Gallery (Multiple Images Support) */}
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
                    alt={`${item.itemName} photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information, Vendor Details & Order Actions */}
        <div className="space-y-6">
          {/* Location & Category Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
              <MapPinIcon size={14} />
              <span>{item.location || "Woodfired Kitchen"}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <span>{item.category}</span>
            </span>
          </div>

          {/* Pizza Title & Price */}
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

          {/* Vendor Information Card (Assignment 9 Requirement) */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0">
                <StoreIcon size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Vendor & Kitchen
                </span>
                <h4 className="font-heading font-bold text-sm text-stone-900 dark:text-white">
                  {item.vendorName || "Artisan Pizza Partner"}
                </h4>
                {item.vendorEmail && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {item.vendorEmail}
                  </p>
                )}
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
              Verified Partner
            </span>
          </div>

          {/* Highlights checklist */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
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
      {/* POPUP ORDER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto no-scrollbar">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto no-scrollbar">
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

            {/* Selected Pizza Card Summary */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-700 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentDisplayImage}
                  alt={item.itemName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-bold text-sm text-stone-900 dark:text-white truncate">
                  {item.itemName}
                </h4>
                <p className="text-xs text-stone-500 truncate">
                  {item.category} • {item.location}
                </p>
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  ${item.price?.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleConfirmOrder} className="space-y-4">
              {/* Customer Name & Email (Readonly) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Your Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.name || "Customer"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-medium cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Your Email
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || "customer@pizzahub.com"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-medium cursor-not-allowed truncate"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label
                  htmlFor="customerPhone"
                  className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
                >
                  <PhoneIcon size={12} className="text-red-500" />
                  <span>Phone Number *</span>
                </label>
                <input
                  id="customerPhone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1700 000000 or (555) 234-5678"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                />
              </div>

              {/* Delivery Address */}
              <div className="space-y-1">
                <label
                  htmlFor="deliveryAddress"
                  className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
                >
                  <MapPinIcon size={12} className="text-red-500" />
                  <span>Delivery Destination Address *</span>
                </label>
                <textarea
                  id="deliveryAddress"
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, apartment or floor number, city..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                />
              </div>

              {/* Delivery Date */}
              <div className="space-y-1">
                <label
                  htmlFor="deliveryDate"
                  className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
                >
                  <CalendarIcon size={12} className="text-red-500" />
                  <span>Requested Delivery Date</span>
                </label>
                <input
                  id="deliveryDate"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all cursor-pointer"
                />
              </div>

              {/* Special Instructions */}
              <div className="space-y-1">
                <label
                  htmlFor="orderNotes"
                  className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
                >
                  Special Notes / Delivery Instructions (Optional)
                </label>
                <input
                  id="orderNotes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Ring bell twice, extra napkins..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                />
              </div>

              {/* Total & Submit */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-500">
                    Total Price:
                  </span>
                  <span className="font-heading font-black text-base text-stone-900 dark:text-white">
                    ${item.price?.toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Confirming Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon size={16} />
                      <span>Confirm & Place Order</span>
                    </>
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
