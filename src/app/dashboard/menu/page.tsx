"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { uploadToImgBB } from "@/lib/uploadImage";
import {
  PizzaIcon,
  PlusCircleIcon,
  SparklesIcon,
  AlertCircleIcon,
  CloseIcon,
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

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  location: string;
  description?: string;
  image: string;
  images?: string[];
  status: "pending" | "approved" | "rejected" | "inactive";
  createdAt: string;
}

export default function MyMenuItemsPage() {
  const { user } = useAuth();
  const toast = useToast();

  // 1. Items and loading state
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Delete Confirmation state
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 3. Edit Modal state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editForm, setEditForm] = useState({
    itemName: "",
    price: "",
    category: CATEGORIES[0],
    location: "",
    description: "",
    image: "",
  });
  // Multiple images support in Edit Modal
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // 4. Fetch vendor menu items
  useEffect(() => {
    const fetchVendorMenuItems = async () => {
      if (!user?.email) return;
      setIsLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(
          `${serverUrl}/menu?vendorEmail=${encodeURIComponent(user.email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.items || [];
          setItems(
            list.map(
              (it: {
                _id?: string;
                id?: string;
                itemName?: string;
                name?: string;
                category?: string;
                price?: number;
                location?: string;
                description?: string;
                images?: string[];
                image?: string;
                status?: MenuItem["status"];
                createdAt?: string;
              }) => {
                const itemImages =
                  Array.isArray(it.images) && it.images.length > 0
                    ? it.images
                    : it.image
                      ? [it.image]
                      : [
                          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
                        ];
                return {
                  id: it._id || it.id || "",
                  name: it.itemName || it.name || "Artisan Pizza",
                  category: it.category || "Classic Pizzas",
                  price: typeof it.price === "number" ? it.price : 0,
                  location: it.location || "Kitchen",
                  description: it.description || "",
                  images: itemImages,
                  image: itemImages[0],
                  status: it.status || "pending",
                  createdAt: it.createdAt || new Date().toISOString(),
                };
              },
            ),
          );
        }
      } catch {
        // Backend not yet reachable or empty DB; keep empty state
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorMenuItems();
  }, [user?.email]);

  const getStatusBadge = (status: MenuItem["status"]) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "rejected":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20";
    }
  };

  // 5. Open Edit Modal with all existing images
  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    const existing =
      item.images && item.images.length > 0 ? [...item.images] : [item.image];
    setExistingImages(existing);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setEditForm({
      itemName: item.name,
      price: item.price.toString(),
      category: item.category || CATEGORIES[0],
      location: item.location || "",
      description: item.description || "",
      image: item.image || "",
    });
  };

  // Add one or multiple new photo files from computer
  const handleAddEditFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.warning(`"${file.name}" is not an image file.`, "Invalid File");
        return;
      }
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });

    if (validFiles.length > 0) {
      setNewImageFiles((prev) => [...prev, ...validFiles]);
      setNewImagePreviews((prev) => [...prev, ...validPreviews]);
    }
  };

  // Remove an existing photo
  const handleRemoveExistingImage = (indexToRemove: number) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Remove a newly added photo
  const handleRemoveNewImage = (indexToRemove: number) => {
    setNewImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setNewImagePreviews((prev) =>
      prev.filter((_, idx) => idx !== indexToRemove),
    );
  };

  // 6. Save Edit Changes
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Check if at least one photo exists
    if (existingImages.length === 0 && newImageFiles.length === 0) {
      toast.error(
        "Please provide at least one photo for this pizza.",
        "Image Required",
      );
      return;
    }

    setIsSavingEdit(true);

    try {
      // 1. Upload any newly added image files to ImgBB
      const uploadedUrls: string[] = [];
      for (const file of newImageFiles) {
        try {
          const url = await uploadToImgBB(file);
          uploadedUrls.push(url);
        } catch (uploadError) {
          console.error("ImgBB upload error:", uploadError);
        }
      }

      // 2. Combine kept existing images with newly uploaded images
      const allFinalImages = [...existingImages, ...uploadedUrls];
      if (allFinalImages.length === 0) {
        allFinalImages.push(
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
        );
      }

      const parsedPrice = parseFloat(editForm.price) || 0;

      const payload = {
        itemName: editForm.itemName.trim(),
        name: editForm.itemName.trim(),
        category: editForm.category,
        price: parsedPrice,
        location: editForm.location.trim(),
        description: editForm.description.trim(),
        images: allFinalImages,
        image: allFinalImages[0],
      };

      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${serverUrl}/menu/${editingItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Update local state directly
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                name: editForm.itemName.trim(),
                category: editForm.category,
                price: parsedPrice,
                location: editForm.location.trim(),
                description: editForm.description.trim(),
                images: allFinalImages,
                image: allFinalImages[0],
              }
            : i,
        ),
      );

      toast.success(
        `"${editForm.itemName}" has been updated successfully!`,
        "Recipe Updated",
      );
      setEditingItem(null);
    } catch (err) {
      console.error("Save edit error:", err);
      toast.error("Failed to update menu item.", "Error");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // 7. Delete Item
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${serverUrl}/menu/${itemToDelete.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Delete menu item error:", error);
    }

    setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
    toast.success(
      `"${itemToDelete.name}" was removed from your menu.`,
      "Item Deleted",
    );
    setIsDeleting(false);
    setItemToDelete(null);
  };

  // 8. Toggle Availability (Activate / Deactivate)
  const handleToggleAvailability = async (id: string) => {
    const current = items.find((i) => i.id === id);
    if (!current) return;

    if (current.status === "pending") {
      toast.warning(
        "This item is awaiting admin approval before it can be activated.",
        "Pending Approval",
      );
      return;
    }

    if (current.status === "rejected") {
      toast.error(
        "This item was rejected by an admin and cannot be activated.",
        "Action Not Allowed",
      );
      return;
    }

    const nextStatus = current.status === "inactive" ? "approved" : "inactive";

    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${serverUrl}/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch {
      // Graceful fallback
    }

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: nextStatus } : i)),
    );
    toast.success(
      nextStatus === "approved"
        ? `"${current.name}" is now available to order.`
        : `"${current.name}" has been marked as inactive.`,
      "Status Updated",
    );
  };

  const activeCount = items.filter((i) => i.status === "approved").length;
  const isFreePlan = (user?.subscriptionPlan || "free") === "free";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Kitchen Inventory
            </span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-xs font-semibold text-stone-500">
              {items.length} Recipe{items.length === 1 ? "" : "s"}
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            My Menu Items
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Manage your published pizzas, edit recipe details, update
            availability, or add new items.
          </p>
        </div>

        <Link
          href="/dashboard/add-item"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all w-fit"
        >
          <PlusCircleIcon size={16} />
          <span>Add New Pizza</span>
        </Link>
      </div>

      {/* Items Table / Cards */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PizzaIcon size={18} className="text-red-600" />
            <h3 className="font-heading text-base font-bold text-stone-900 dark:text-white">
              Published Pizzas ({items.length})
            </h3>
          </div>
          <span className="text-xs text-stone-400">
            {isFreePlan
              ? `Free Plan Capacity: ${activeCount}/3 Active`
              : "Premium Plan: Unlimited"}
          </span>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-stone-500">
              Fetching menu items from database...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-600 flex items-center justify-center mb-4">
              <PizzaIcon size={32} />
            </div>
            <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white mb-1">
              No Menu Items Published Yet
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mb-6 leading-relaxed">
              Your kitchen doesn&apos;t have any pizza items listed yet. Add
              your artisan crust recipes and let hungry customers find your
              kitchen!
            </p>
            <Link
              href="/dashboard/add-item"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              <PlusCircleIcon size={16} />
              <span>Create Your First Recipe</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-stone-200 dark:ring-stone-800 shrink-0 bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {item.category} •{" "}
                      <strong className="text-amber-600">
                        ${item.price.toFixed(2)}
                      </strong>
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {item.location}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>

                  {/* Activate / Deactivate Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleAvailability(item.id)}
                    className={`${item.status === "pending" ? "cursor-not-allowed opacity-60" : "cursor-pointer"} px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors`}
                  >
                    {item.status === "inactive" ? "Activate" : "Deactivate"}
                  </button>

                  {/* EDIT BUTTON (Requested) */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="px-3.5 py-1.5 rounded-xl border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setItemToDelete({ id: item.id, name: item.name })
                    }
                    className="px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/40 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade Banner for Free Plan */}
      {isFreePlan && (
        <div className="p-6 rounded-3xl bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <SparklesIcon size={20} />
            </div>
            <div>
              <h4 className="font-heading text-base font-bold">
                Need to publish unlimited pizzas?
              </h4>
              <p className="text-xs text-stone-400">
                Upgrade to the Premium Vendor Plan for unlimited listings and
                top homepage placement.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/subscription"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider text-center shrink-0"
          >
            View Plans
          </Link>
        </div>
      )}

      {/* Edit Menu Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto no-scrollbar">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <PizzaIcon size={18} />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-stone-900 dark:text-white">
                    Edit Pizza Recipe
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Update recipe details, pricing, and ingredients.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Item Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.itemName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, itemName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Category *
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Kitchen Location *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>

              {/* Multiple Pizza Photos Support */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Pizza Photos ({existingImages.length + newImagePreviews.length})
                  </label>
                  <span className="text-[11px] text-stone-400">
                    First photo is Cover
                  </span>
                </div>

                {/* Hidden File Input for Multiple Selection */}
                <input
                  id="editMultipleImagesInput"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAddEditFiles}
                  className="hidden"
                />

                {/* Photos Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  {/* 1. Existing Photos */}
                  {existingImages.map((imgUrl, idx) => (
                    <div
                      key={`existing-${idx}`}
                      className="relative aspect-square rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 group shadow-xs"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-600 text-white shadow-xs">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove photo"
                      >
                        <CloseIcon size={10} />
                      </button>
                    </div>
                  ))}

                  {/* 2. Newly Picked Photos from Computer */}
                  {newImagePreviews.map((previewUrl, idx) => (
                    <div
                      key={`new-${idx}`}
                      className="relative aspect-square rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-700 border-2 border-amber-500 group shadow-xs"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt={`New ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-stone-950 shadow-xs">
                        New
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove photo"
                      >
                        <CloseIcon size={10} />
                      </button>
                    </div>
                  ))}

                  {/* 3. Add More Photos Button */}
                  <label
                    htmlFor="editMultipleImagesInput"
                    className="aspect-square rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-600 hover:border-amber-500 flex flex-col items-center justify-center gap-1 text-stone-400 hover:text-amber-500 transition-colors cursor-pointer bg-white dark:bg-stone-900/50"
                  >
                    <PlusCircleIcon size={20} />
                    <span className="text-[10px] font-bold">Add Photo</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingEdit ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <CheckIcon size={14} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Box / Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-7 shadow-2xl space-y-5 text-center">
            {/* Warning Icon */}
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircleIcon size={30} />
            </div>

            {/* Dialog Text */}
            <div className="space-y-1.5">
              <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-white">
                Delete Menu Item?
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Are you sure you want to delete{" "}
                <strong className="text-stone-800 dark:text-stone-200">
                  &ldquo;{itemToDelete.name}&rdquo;
                </strong>
                ? This recipe will be permanently removed from your menu.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
