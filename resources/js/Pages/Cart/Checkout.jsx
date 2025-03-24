import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export default function CartCheckout({
  checkoutData,
  clientSecret,
  publishableKey,
  auth,
}) {
  const stripePromise = loadStripe(publishableKey);
  const { flash = {} } = usePage().props;

  // Calculate totals
  const subtotal =
    checkoutData.items && checkoutData.items.length > 0
      ? checkoutData.items.reduce(
          (total, item) => total + parseFloat(item.price) * item.quantity,
          0
        )
      : 0;

  return (
    <AppLayout auth={auth}>
      <Head title="Checkout" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center text-sky-900">
              <ShoppingCart className="mr-2" /> Checkout
            </h1>
          </div>

          {flash?.error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
              {flash.error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Your Purchase</CardTitle>
                  <CardDescription>
                    Secure payment for your tickets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>
                    {checkoutData.items?.length}{" "}
                    {checkoutData.items?.length === 1 ? "item" : "items"} in
                    your cart
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {checkoutData.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between py-2 border-b"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">
                          {item.ticket.event_name}
                        </div>
                        <div className="text-sm text-gray-500 space-y-0.5">
                          {item.ticket.event_datetime && (
                            <div>
                              {new Date(
                                item.ticket.event_datetime
                              ).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(
                                item.ticket.event_datetime
                              ).toLocaleTimeString()}
                            </div>
                          )}
                          {item.ticket.event_location && (
                            <div>{item.ticket.event_location}</div>
                          )}
                          {(item.ticket.section ||
                            item.ticket.row ||
                            item.ticket.seat) && (
                            <div>
                              {item.ticket.section &&
                                `Section ${item.ticket.section}`}
                              {item.ticket.row && ` • Row ${item.ticket.row}`}
                              {item.ticket.seat &&
                                ` • Seat ${item.ticket.seat}`}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="font-medium">
                        ${parseFloat(item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}

                  <div className="pt-2">
                    <div className="flex justify-between mb-2">
                      <div>Subtotal</div>
                      <div>${checkoutData.subtotal?.toFixed(2)}</div>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <div>Total</div>
                      <div className="text-sky-900">
                        ${checkoutData.total?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link
                    href={route("cart.index")}
                    className="flex items-center text-sky-700 hover:text-sky-900"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Return to Cart
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
