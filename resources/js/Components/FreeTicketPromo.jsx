import React from "react";
import { Link } from "@inertiajs/react";
import { X } from "lucide-react";

export default function FreeTicketPromo({
  showSignUpLink = false,
  onDismiss = null,
}) {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-sky-50 border border-orange-200 rounded-lg p-3 my-4 shadow-lg relative">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div className="flex items-center justify-center gap-2 text-orange-600 font-semibold text-sm mb-1">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        Get your first ticket FREE!
      </div>
      <p className="text-xs text-gray-600 text-center">
        Create an account and design your first custom ticket at no cost.
      </p>
      {showSignUpLink && (
        <div className="mt-2 text-center">
          <Link
            href={route("register")}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
          >
            Sign Up Now
          </Link>
        </div>
      )}
    </div>
  );
}
