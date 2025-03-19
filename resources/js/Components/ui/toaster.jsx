import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ToastContainer } from "./toast";

export function Toaster() {
  const [isMounted, setIsMounted] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setIsMounted(true);

    const handleToast = (event) => {
      const { toast } = event.detail;

      if (toast) {
        setToasts((prev) => [...prev, { id: Date.now(), ...toast }]);

        // Auto-remove toast after duration
        if (toast.duration !== Infinity) {
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== toast.id));
          }, toast.duration || 5000);
        }
      }
    };

    window.addEventListener("toast", handleToast);
    return () => window.removeEventListener("toast", handleToast);
  }, []);

  if (!isMounted) return null;

  return createPortal(
    <ToastContainer toasts={toasts} setToasts={setToasts} />,
    document.body
  );
}

// Helper function to create toasts from anywhere
export function toast({
  title,
  description,
  variant = "default",
  duration = 5000,
}) {
  const event = new CustomEvent("toast", {
    detail: {
      toast: { title, description, variant, duration },
    },
  });

  window.dispatchEvent(event);
}
