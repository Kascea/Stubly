import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import { ToastProvider } from "@/Components/ui/use-toast";

export default function CheckoutSuccessLayout({ children, auth }) {
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);

  // Create a modified cart prop with count 0
  const { props } = usePage();
  const modifiedProps = {
    ...props,
    cart: {
      count: 0,
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        auth={auth}
        showingNavigationDropdown={showingNavigationDropdown}
        setShowingNavigationDropdown={setShowingNavigationDropdown}
        // Pass modified cart count of 0
        cart={{ count: 0 }}
      />

      <main>{children}</main>
    </div>
  );
}
