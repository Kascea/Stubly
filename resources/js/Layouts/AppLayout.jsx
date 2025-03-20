import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import { Toaster } from "@/Components/ui/toaster";
import { ShoppingCart } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function AppLayout({ children, auth: propAuth }) {
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);

  // Get auth from props if provided, otherwise from page props
  // This allows the layout to work both with direct auth prop (for guest pages)
  // and with auth from page props (for authenticated pages)
  const pageAuth = usePage().props.auth;
  const auth = propAuth || pageAuth;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        auth={auth}
        showingNavigationDropdown={showingNavigationDropdown}
        setShowingNavigationDropdown={setShowingNavigationDropdown}
      />

      <main className="flex-grow">{children}</main>

      <Toaster />
    </div>
  );
}
