import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export default function Checkout({ ticket, clientSecret, publishableKey }) {
  const stripePromise = loadStripe(publishableKey);

  return (
    <AuthenticatedLayout>
      <Head title="Checkout" />
      <div className="py-12">
        <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold mb-2">Complete Purchase</h1>
              <p className="text-sky-900/70">
                Purchase your ticket for {ticket.event_name}
              </p>
            </div>

            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
