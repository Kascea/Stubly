import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/Components/CheckoutForm";

const stripePromise = loadStripe(window.stripeKey);

export default function Checkout({ ticket }) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch(route("payment.process", { ticket: ticket.ticket_id }), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [ticket]);

  return (
    <AuthenticatedLayout>
      <Head title="Checkout" />

      <div className="py-12">
        <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold mb-2">Complete Purchase</h1>
              <p className="text-gray-600">
                Purchase your ticket for {ticket.event_name}
              </p>
            </div>

            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm ticket={ticket} />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
