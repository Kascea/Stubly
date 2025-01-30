import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";

export default function CheckoutForm({ ticket }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: route("payment.confirm", { ticket: ticket.ticket_id }),
      },
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      router.visit(route("tickets.edit", { ticket: ticket.ticket_id }));
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {message && <div className="text-red-500 text-sm">{message}</div>}

      <Button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
}
