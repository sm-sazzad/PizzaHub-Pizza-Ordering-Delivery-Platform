"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

export default function SuccessToast() {
  const toast = useToast();
  const { refreshSession } = useAuth();
  const hasTriggered = useRef(false);

  useEffect(() => {
    // Show toast only once when component mounts
    if (!hasTriggered.current) {
      hasTriggered.current = true;
      toast.success(
        "Your account has been upgraded to Premium!",
        "Payment Successful",
      );

      // Refresh the session so the new subscription status takes effect immediately
      if (refreshSession) {
        refreshSession();
      }
    }
  }, [toast, refreshSession]);

  return null;
}
