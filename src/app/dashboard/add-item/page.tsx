"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { uploadToImgBB } from "@/lib/uploadImage";
import {
  PizzaIcon,
  CameraIcon,
  CloseIcon,
  ArrowRightIcon,
  SparklesIcon,
  StoreIcon,
  CheckIcon,
} from "@/components/ui/Icons";

const CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

export default function AddMenuItemPage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form input states
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Number of menu items already created by this vendor
  const [existingItemsCount, setExistingItemsCount] = useState<number>(0);
  const isPremium = user?.subscriptionPlan === "premium";

  // Fetch current menu items count on component mount
  useEffect(() => {
    const fetchExistingItems = async () => {
      if (!user?.email) return;
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(
          `${serverUrl}/menu?vendorEmail=${encodeURIComponent(user.email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.items || [];
          setExistingItemsCount(items.length);
        }
      } catch {
        // Fallback default is 0 if server is offline
      }
    };

    fetchExistingItems();
  }, [user?.email]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please upload a valid image file (JPG, PNG, WebP).",
        "Invalid File",
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB.", "File Too Large");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check vendor subscription plan
    const isPremiumPlan = user?.subscriptionPlan === "premium";

    // 2. If vendor is on free plan and already has 3 or more items, redirect to subscription
    if (!isPremiumPlan && existingItemsCount >= 3) {
      toast.warning(
        "Free plan allows a maximum of 3 items. Please upgrade to premium to add more items.",
        "Free Plan Limit Reached",
      );
      router.push("/dashboard/subscription");
      return;
    }

    // 3. Validate required form fields
    if (!itemName.trim() || !description.trim() || !price || !location.trim()) {
      toast.error(
        "Please fill in all required menu item fields.",
        "Missing Fields",
      );
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error(
        "Please enter a valid price greater than zero.",
        "Invalid Price",
      );
      return;
    }

    if (!imageFile) {
      toast.error("Please upload a photo for the menu item.", "Image Required");
      return;
    }

    setIsLoading(true);

    try {
      // 4. Upload menu item image
      let hostedImageUrl = "";
      try {
        hostedImageUrl = await uploadToImgBB(imageFile);
      } catch (uploadError) {
        console.warn("Image upload failed:", uploadError);
        toast.error(
          "Failed to upload image. Please try again.",
          "Upload Error",
        );
        setIsLoading(false);
        return;
      }

      // 5. Prepare payload matching PDF specification
      const menuPayload = {
        vendorId: user?.id || "vend-01",
        vendorName:
          user?.businessName || user?.name || "Luigi's Woodfired Pizzeria",
        vendorEmail: user?.email || "luigi@woodfired.com",
        itemName: itemName.trim(),
        category,
        description: description.trim(),
        price: parsedPrice,
        location: location.trim(),
        images: [hostedImageUrl],
        status: "pending", // Default status Pending until admin approves
        createdAt: new Date().toISOString(),
      };

      // 6. POST to Express backend API
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const targetApiUrl = `${baseUrl}/menu`;

      const res = await fetch(targetApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuPayload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.message || `Server responded with status ${res.status}`,
        );
      }

      toast.success(
        `"${itemName}" submitted successfully! It is now pending admin approval.`,
        "Menu Item Added",
      );

      // Increment local count
      setExistingItemsCount((prev) => prev + 1);

      // Reset form
      setItemName("");
      setDescription("");
      setPrice("");
      setLocation("");
      handleRemoveImage();

      // Redirect to menu list
      setTimeout(() => {
        router.push("/dashboard/menu");
      }, 700);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to add menu item.";
      toast.error(errorMsg, "Submission Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Title & Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Menu Management
            </span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-xs font-semibold text-stone-500">
              Create New Recipe
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Add New Menu Item
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Published items are submitted with status &apos;Pending&apos; and
            will be reviewed by platform administrators.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors w-fit"
        >
          <span>&larr; Back to Overview</span>
        </Link>
      </div>

      {/* Free Plan Capacity Warning Banner (PDF Page 7) */}
      {!isPremium && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <SparklesIcon size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Free Plan Allowance: {existingItemsCount} of 3 Items Used
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                Upgrade to Premium for unlimited active menu slots and homepage
                promotion.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/subscription"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors whitespace-nowrap text-center"
          >
            Upgrade Plan
          </Link>
        </div>
      )}

      {/* Main Creation Form Card */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-10 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item Name */}
            <div className="space-y-1.5 md:col-span-2">
              <label
                htmlFor="itemName"
                className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
              >
                Item Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="itemName"
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Diavola Rustica con Tartufo"
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/70 text-stone-900 dark:text-white placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label
                htmlFor="category"
                className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/70 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price (USD) */}
            <div className="space-y-1.5">
              <label
                htmlFor="price"
                className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
              >
                Price ($ USD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-stone-400 font-bold text-sm">
                  $
                </span>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="18.50"
                  className="w-full pl-8 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/70 text-stone-900 dark:text-white placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            {/* Location (Area / City) */}
            <div className="space-y-1.5 md:col-span-2">
              <label
                htmlFor="location"
                className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
              >
                Restaurant Kitchen Location (Area / City){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Dhanmondi, Dhaka or Brooklyn, NY"
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/70 text-stone-900 dark:text-white placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label
                htmlFor="description"
                className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
              >
                Description & Flavor Profile{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe crust fermentation, tomato sauce origin, artisan cheeses, and toppings..."
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/70 text-stone-900 dark:text-white placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
              />
            </div>
          </div>

          {/* Item Image Upload */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Item Image <span className="text-red-500">*</span>
            </label>

            {/* Hidden native input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="menuItemImageInput"
            />

            {imagePreview ? (
              /* Preview state */
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 p-4 bg-stone-50 dark:bg-stone-800/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden ring-2 ring-red-500/20 shrink-0 bg-stone-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Menu item preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                      {imageFile?.name}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {imageFile && (imageFile.size / (1024 * 1024)).toFixed(2)}{" "}
                      MB • Ready for upload
                    </p>
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckIcon size={12} />
                      <span>File Validated</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Remove image"
                >
                  <CloseIcon size={20} />
                </button>
              </div>
            ) : (
              /* Empty Dropzone state */
              <label
                htmlFor="menuItemImageInput"
                className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-red-500 bg-stone-50/50 dark:bg-stone-800/30 cursor-pointer transition-colors group text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <CameraIcon size={24} />
                </div>
                <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  Upload High-Res Pizza Photo
                </span>
                <span className="text-xs text-stone-400 mt-1 max-w-sm">
                  Click or drag and drop image file (JPG, PNG, WebP up to 5MB).
                </span>
              </label>
            )}
          </div>

          {/* Submission Info Bar */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
            <StoreIcon size={16} className="text-amber-500 shrink-0" />
            <span>
              Item will be bound to vendor account:{" "}
              <strong className="text-stone-800 dark:text-stone-200">
                {user?.businessName ||
                  user?.name ||
                  "Luigi's Woodfired Pizzeria"}
              </strong>
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-linear-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>Publishing Item to Menu...</span>
              ) : (
                <>
                  <PizzaIcon size={18} />
                  <span>Publish Pizza to Menu</span>
                  <ArrowRightIcon size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
