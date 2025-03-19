import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import axios from "axios";
import { Toaster } from "@/Components/ui/toaster";

export default function AppLayout({ children, auth: propAuth }) {
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Get auth from props if provided, otherwise from page props
  // This allows the layout to work both with direct auth prop (for guest pages)
  // and with auth from page props (for authenticated pages)
  const pageAuth = usePage().props.auth;
  const auth = propAuth || pageAuth;

  // Fetch cart count when component mounts or auth changes
  useEffect(() => {
    if (auth?.user) {
      fetchCartCount();
    } else {
      setCartItemCount(0);
    }
  }, [auth?.user]);

  const fetchCartCount = async () => {
    try {
      const response = await axios.get(route("cart.count"));
      setCartItemCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        auth={auth}
        showingNavigationDropdown={showingNavigationDropdown}
        setShowingNavigationDropdown={setShowingNavigationDropdown}
        cartItemCount={cartItemCount}
      />

      <main className="flex-grow">{children}</main>

      <Toaster />
    </div>
  );
}
