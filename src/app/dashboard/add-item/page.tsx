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
  PlusCircleIcon,
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

  // Multiple Images Support (Assignment 9 Requirement)
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");

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

  // Handle selecting multiple image files
  const handleMultipleImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validNewFiles: File[] = [];
    const validNewPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.warning(
          `"${file.name}" is not an image file. Skipped.`,
          "Invalid File",
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.warning(
          `"${file.name}" exceeds 5MB limit. Skipped.`,
          "File Too Large",
        );
        return;
      }

      validNewFiles.push(file);
      validNewPreviews.push(URL.createObjectURL(file));
    });

    if (validNewFiles.length > 0) {
      setImageFiles((prev) => [...prev, ...validNewFiles]);
      setImagePreviews((prev) => [...prev, ...validNewPreviews]);
      toast.success(
        `Added ${validNewFiles.length} photo(s).`,
        "Images Selected",
      );
    }

    // Reset file input value to allow selecting same files again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle adding image via direct URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;

    if (
      !imageUrlInput.startsWith("http://") &&
      !imageUrlInput.startsWith("https://")
    ) {
      toast.error(
        "Please enter a valid URL starting with http:// or https://",
        "Invalid URL",
      );
      return;
    }

    setImagePreviews((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput("");
    toast.success("Image URL added to gallery.", "Photo Added");
  };

  // Remove a single image from previews and files
  const handleRemoveImage = (indexToRemove: number) => {
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Form Submission
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

    if (imagePreviews.length === 0) {
      toast.error(
        "Please upload or provide at least one photo for this pizza.",
        "Image Required",
      );
      return;
    }

    setIsLoading(true);

    try {
      // 4. Upload all uploaded image files to ImgBB (or fallback)
      const uploadedImageUrls: string[] = [];

      for (const file of imageFiles) {
        try {
          const url = await uploadToImgBB(file);
          uploadedImageUrls.push(url);
        } catch (uploadError) {
          console.warn("ImgBB upload failed for file:", file.name, uploadError);
          // Fallback placeholder if ImgBB API key not configured
          uploadedImageUrls.push(
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
          );
        }
      }

      // Combine direct URLs and newly uploaded file URLs
      const directUrls = imagePreviews.filter((url) =>
        url.startsWith("http"),
      );
      const allFinalImages = Array.from(
        new Set([...uploadedImageUrls, ...directUrls]),
      );

      // Fallback if none succeeded
      if (allFinalImages.length === 0) {
        allFinalImages.push(
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
        );
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
        images: allFinalImages, // Multiple images saved here!
        image: allFinalImages[0] || "", // Primary thumbnail
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

      // Redirect to vendor menu management page
      router.push("/dashboard/menu");
    } catch (err: unknown) {
      console.error("Error creating menu item:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while saving the menu item.",
        "Submission Failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Vendor Kitchen
          </span>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <span className="text-xs font-semibold text-stone-500">
            Menu Catalog
          </span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
          Add New Pizza Item
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
          Submit artisanal pizza recipes with multiple photos, ingredients, and
          pricing.
        </p>
      </div>

      {/* Subscription Tier Banner */}
      {!isPremium && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
              <SparklesIcon size={20} />
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
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white py-2"
                  >
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

          {/* Multiple Images Upload Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Pizza Photos (Multiple Images Supported){" "}
                <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-stone-400">
                {imagePreviews.length} photo(s) added
              </span>
            </div>

            {/* Hidden native input for multiple file selection */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleMultipleImagesChange}
              className="hidden"
              id="menuItemMultipleImageInput"
            />

            {/* Images Preview Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700">
                {imagePreviews.map((previewUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 group shadow-xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Primary Badge for first photo */}
                    {index === 0 && (
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white shadow-xs">
                        Cover
                      </span>
                    )}

                    {/* Delete/Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove this photo"
                    >
                      <CloseIcon size={12} />
                    </button>
                  </div>
                ))}

                {/* Add More Photos Card */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-600 hover:border-red-500 flex flex-col items-center justify-center gap-1 text-stone-400 hover:text-red-500 transition-colors cursor-pointer bg-white/50 dark:bg-stone-900/50"
                >
                  <PlusCircleIcon size={24} />
                  <span className="text-[11px] font-bold">Add More</span>
                </button>
              </div>
            )}

            {/* Empty Upload Dropzone if no images yet */}
            {imagePreviews.length === 0 && (
              <label
                htmlFor="menuItemMultipleImageInput"
                className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-red-500 bg-stone-50/50 dark:bg-stone-800/30 cursor-pointer transition-colors group text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <CameraIcon size={24} />
                </div>
                <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  Upload Multiple Pizza Photos
                </span>
                <span className="text-xs text-stone-400 mt-1 max-w-sm">
                  Click or drag and drop multiple image files (JPG, PNG, WebP up
                  to 5MB).
                </span>
              </label>
            )}

            {/* Optional URL input for direct web images */}
            <div className="flex gap-2 pt-1">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Or paste an image web URL..."
                className="flex-1 px-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/30"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-xs transition-colors shrink-0"
              >
                Add URL
              </button>
            </div>
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold text-xs uppercase tracking-wider hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-center"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-red-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Submitting Pizza Item...</span>
                </>
              ) : (
                <>
                  <PizzaIcon size={16} />
                  <span>Submit for Review</span>
                  <ArrowRightIcon size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
