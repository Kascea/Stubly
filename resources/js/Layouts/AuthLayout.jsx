import React from "react";
import { Link } from "@inertiajs/react";

export default function AuthLayout({ children, title }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-sky-50 to-orange-50 pt-6 sm:justify-center sm:pt-0">
      <div>
        <Link href="/" className="flex items-center">
          <img
            src="/images/logo-no-background.webp"
            alt="Stubly"
            className="h-10 w-auto"
          />
        </Link>
      </div>

      <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg border border-sky-200">
        {title && (
          <h2 className="text-2xl font-bold text-sky-900 text-center mb-6">
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  );
}
