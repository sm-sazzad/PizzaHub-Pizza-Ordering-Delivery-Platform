"use client";

import React, { useState, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { useAuth } from "@/context/AuthContext";
import { uploadToImgBB } from "@/lib/uploadImage";
import {
  PizzaIcon,
  UserIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  GoogleIcon,
  AlertCircleIcon,
  CheckIcon,
  StoreIcon,
  UploadIcon,
  CameraIcon,
  CloseIcon,
} from "@/components/ui/Icons";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get("role");
  const defaultRole = initialRoleParam === "vendor" ? "vendor" : "customer";

  const { refreshSession, loginAs } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [role, setRole] = useState<"customer" | "vendor">(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Password rules validation (Assignment 9 requirement)
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size must be less than 5MB.");
      return;
    }

    setErrorMsg("");
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
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (!isPasswordValid) {
      setErrorMsg(
        "Password must be at least 6 characters long, with at least one uppercase letter and one lowercase letter."
      );
      return;
    }

    if (role === "vendor" && !businessName.trim()) {
      setErrorMsg("Please provide your Restaurant or Business name.");
      return;
    }

    setIsLoading(true);

    let hostedImageUrl = "";

    // 1. Upload file to ImgBB if selected
    if (imageFile) {
      try {
        setUploadingImg(true);
        hostedImageUrl = await uploadToImgBB(imageFile);
      } catch (uploadError) {
        // If API key is missing or network fails, report clearly
        console.warn("ImgBB upload failed:", uploadError);
        const errMsg =
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to upload image to ImgBB. Please verify your NEXT_PUBLIC_IMGBB_API_KEY in .env.";
        setErrorMsg(errMsg);
        setIsLoading(false);
        setUploadingImg(false);
        return;
      } finally {
        setUploadingImg(false);
      }
    }

    // 2. Submit user registration to Better Auth & MongoDB
    try {
      const res = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: hostedImageUrl || undefined,
        // Custom additional fields stored in MongoDB via Better Auth
        ...({
          role,
          businessName: role === "vendor" ? businessName.trim() : undefined,
          isBlocked: false,
          subscriptionPlan: "free",
        } as Record<string, unknown>),
      });

      if (res.error) {
        setErrorMsg(res.error.message || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccessMsg("Account created successfully with your profile photo! Redirecting...");
      await refreshSession();

      setTimeout(() => {
        if (role === "vendor") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }, 800);
    } catch {
      // Offline / development fallback
      loginAs(role);
      setSuccessMsg(`Welcome ${name}! Setting up your ${role} account...`);
      setTimeout(() => {
        router.push(role === "vendor" ? "/dashboard" : "/");
      }, 900);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: role === "vendor" ? "/dashboard" : "/",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to connect to Google OAuth.";
      setErrorMsg(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Warm Ambient Glow Overlays */}
      <div className="ambient-glow-pizza w-96 h-96 -top-20 -left-20 bg-red-600/15" />
      <div className="ambient-glow-pizza w-96 h-96 -bottom-24 -right-20 bg-amber-500/15" />

      <div className="w-full max-w-lg relative z-10">
        <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 sm:p-10 shadow-2xl transition-all">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
                <PizzaIcon size={22} className="text-white" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
                Pizza<span className="text-red-600">Hub</span>
              </span>
            </Link>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              Create an Account
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Join PizzaHub as a passionate foodie or an artisanal pizzeria owner.
            </p>
          </div>

          {/* Role Selection Tabs (Vendor vs Customer only; Admin protected) */}
          <div className="mb-7">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2.5">
              Select Your Account Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Customer Option */}
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  role === "customer"
                    ? "bg-red-500/10 border-red-500 text-red-700 dark:text-red-400 shadow-sm ring-1 ring-red-500"
                    : "bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/80 text-stone-700 dark:text-stone-300 hover:border-red-400"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center">
                    <PizzaIcon size={18} />
                  </div>
                  {role === "customer" && (
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
                      <CheckIcon size={12} />
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-heading text-sm font-bold block">Customer</span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight block mt-0.5">
                    Order stone-baked pizzas & track delivery.
                  </span>
                </div>
              </button>

              {/* Vendor Option */}
              <button
                type="button"
                onClick={() => setRole("vendor")}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  role === "vendor"
                    ? "bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 shadow-sm ring-1 ring-amber-500"
                    : "bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/80 text-stone-700 dark:text-stone-300 hover:border-amber-400"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                    <StoreIcon size={18} />
                  </div>
                  {role === "vendor" && (
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">
                      <CheckIcon size={12} />
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-heading text-sm font-bold block">Restaurant Owner</span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight block mt-0.5">
                    Publish menu & accept customer orders.
                  </span>
                </div>
              </button>
            </div>
            <p className="text-[11px] text-stone-400 mt-2 italic">
              * Note: Admin accounts cannot be created via public registration.
            </p>
          </div>

          {/* Error / Success Toast Messages */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
              <AlertCircleIcon size={18} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <CheckIcon size={18} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700/80 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-200 shadow-xs hover:shadow-md"
          >
            <GoogleIcon size={18} />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-7 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200 dark:border-stone-800" />
            </div>
            <span className="relative px-4 bg-white dark:bg-stone-900 text-xs uppercase tracking-widest text-stone-400 font-semibold">
              Or with email & password
            </span>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <UserIcon size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rahman"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/70 text-stone-900 dark:text-white placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            {/* Restaurant / Business Name (Vendor only) */}
            {role === "vendor" && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label
                  htmlFor="businessName"
                  className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
                >
                  Restaurant / Pizzeria Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <StoreIcon size={18} />
                  </div>
                  <input
                    id="businessName"
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Luigi's Woodfired Pizzeria"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/70 text-stone-900 dark:text-white placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <MailIcon size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/70 text-stone-900 dark:text-white placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <LockIcon size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/70 text-stone-900 dark:text-white placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>

              {/* Password Rule Validation Indicator */}
              <div className="pt-2 grid grid-cols-3 gap-1.5 text-[11px]">
                <div
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    hasMinLength ? "text-emerald-600 dark:text-emerald-400" : "text-stone-400"
                  }`}
                >
                  <CheckIcon size={12} className={hasMinLength ? "opacity-100" : "opacity-40"} />
                  <span>6+ chars</span>
                </div>
                <div
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    hasUppercase ? "text-emerald-600 dark:text-emerald-400" : "text-stone-400"
                  }`}
                >
                  <CheckIcon size={12} className={hasUppercase ? "opacity-100" : "opacity-40"} />
                  <span>1 uppercase</span>
                </div>
                <div
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    hasLowercase ? "text-emerald-600 dark:text-emerald-400" : "text-stone-400"
                  }`}
                >
                  <CheckIcon size={12} className={hasLowercase ? "opacity-100" : "opacity-40"} />
                  <span>1 lowercase</span>
                </div>
              </div>
            </div>

            {/* Profile Image File Upload to ImgBB (Assignment 9 & User Request) */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Profile Image <span className="text-stone-400 font-normal">(File upload to ImgBB)</span>
              </label>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profileImageInput"
              />

              {imagePreview ? (
                /* Preview State */
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-red-500/20 bg-stone-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate">
                      {imageFile?.name}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {imageFile && (imageFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for ImgBB upload
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Remove image"
                  >
                    <CloseIcon size={18} />
                  </button>
                </div>
              ) : (
                /* Empty / Upload Trigger Box */
                <label
                  htmlFor="profileImageInput"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-700/80 hover:border-amber-500/50 bg-stone-50/50 dark:bg-stone-800/30 cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                    <CameraIcon size={20} />
                  </div>
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Upload Profile Photo
                  </span>
                  <span className="text-[11px] text-stone-400 mt-0.5">
                    Click to browse JPG, PNG, WebP (Max 5MB)
                  </span>
                </label>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || uploadingImg}
              className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {uploadingImg ? (
                <span className="flex items-center gap-2">
                  <UploadIcon size={16} className="animate-bounce" />
                  <span>Uploading Photo to ImgBB...</span>
                </span>
              ) : isLoading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Account as {role === "vendor" ? "Vendor" : "Customer"}</span>
                  <ArrowRightIcon size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-bold text-red-600 hover:text-red-700 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center text-sm font-semibold text-stone-500">
          Loading registration form...
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
