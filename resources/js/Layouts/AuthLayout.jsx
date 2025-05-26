import React from "react";
import { Link } from "@inertiajs/react";

export default function AuthLayout({ children, title }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-sky-50 to-orange-50 py-8 sm:justify-center sm:py-12">
      <div>
        <Link href="/" className="flex items-center">
          <img
            src="/images/logo-no-background.png"
            alt="Stubly"
            className="h-10 w-auto"
          />
        </Link>
      </div>

      <div className="mt-8 w-full overflow-hidden bg-white px-8 py-8 shadow-md sm:max-w-lg sm:rounded-lg border border-sky-200">
        {title && (
          <h2 className="text-2xl font-bold text-sky-900 text-center mb-8">
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  );
}
