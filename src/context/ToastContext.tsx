"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  CheckIcon,
  AlertCircleIcon,
  InfoIcon,
  CloseIcon,
  FlameIcon,
} from "@/components/ui/Icons";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", title?: string, duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) => showToast(message, "success", title),
    [showToast]
  );

  const error = useCallback(
    (message: string, title?: string) => showToast(message, "error", title),
    [showToast]
  );

  const info = useCallback(
    (message: string, title?: string) => showToast(message, "info", title),
    [showToast]
  );

  const warning = useCallback(
    (message: string, title?: string) => showToast(message, "warning", title),
    [showToast]
  );

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          icon: CheckIcon,
          bg: "bg-white dark:bg-stone-900 border-emerald-500/30 dark:border-emerald-500/20",
          iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          titleColor: "text-emerald-600 dark:text-emerald-400",
          barColor: "bg-emerald-500",
        };
      case "error":
        return {
          icon: AlertCircleIcon,
          bg: "bg-white dark:bg-stone-900 border-red-500/30 dark:border-red-500/20",
          iconBg: "bg-red-500/10 text-red-600 dark:text-red-400",
          titleColor: "text-red-600 dark:text-red-400",
          barColor: "bg-red-500",
        };
      case "warning":
        return {
          icon: FlameIcon,
          bg: "bg-white dark:bg-stone-900 border-amber-500/30 dark:border-amber-500/20",
          iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
          titleColor: "text-amber-600 dark:text-amber-400",
          barColor: "bg-amber-500",
        };
      default:
        return {
          icon: InfoIcon,
          bg: "bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700",
          iconBg: "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300",
          titleColor: "text-stone-800 dark:text-stone-200",
          barColor: "bg-stone-500",
        };
    }
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        success,
        error,
        info,
        warning,
      }}
    >
      {children}

      {/* Top-Right Fixed Toast Container (Responsive for all screen sizes) */}
      <div
        aria-live="polite"
        className="fixed top-4 left-4 right-4 sm:left-auto sm:right-5 sm:max-w-sm z-[9999] flex flex-col gap-2.5 pointer-events-none"
      >
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          const Icon = styles.icon;

          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto relative overflow-hidden rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 transform translate-x-0 animate-in slide-in-from-top-3 fade-in duration-200 ${styles.bg}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg}`}
                >
                  <Icon size={18} />
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  {toast.title && (
                    <h5 className={`text-xs font-bold uppercase tracking-wider ${styles.titleColor}`}>
                      {toast.title}
                    </h5>
                  )}
                  <p className="text-xs font-medium text-stone-700 dark:text-stone-200 leading-relaxed mt-0.5">
                    {toast.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg transition-colors focus:outline-none"
                  aria-label="Close notification"
                >
                  <CloseIcon size={16} />
                </button>
              </div>

              {/* Subtle bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-100 dark:bg-stone-800">
                <div className={`h-full ${styles.barColor} w-full opacity-70`} />
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
