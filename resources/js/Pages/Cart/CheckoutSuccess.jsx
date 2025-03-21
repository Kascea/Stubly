import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { CheckCircle2, Home, Ticket, ReceiptText } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function CheckoutSuccess({ orderDetails, auth }) {
  return (
    <AppLayout auth={auth}>
      <Head title="Order Confirmed" />
      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <Card className="border-green-100">
            <CardContent className="pt-6 pb-4 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Order Confirmed!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase.{" "}
                {!orderDetails.is_guest
                  ? "Your tickets are now available in your account."
                  : "Your tickets have been sent to your email."}
              </p>

              {orderDetails && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                  <h2 className="font-semibold text-gray-700 mb-2">
                    Order Details
                  </h2>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Order ID:</div>
                    <div>{orderDetails.id}</div>
                    <div className="text-gray-500">Date:</div>
                    <div>
                      {new Date(orderDetails.created_at).toLocaleString()}
                    </div>
                    <div className="text-gray-500">Total:</div>
                    <div>
                      ${parseFloat(orderDetails.total_amount).toFixed(2)}
                    </div>
                    {orderDetails.is_guest && (
                      <>
                        <div className="text-gray-500">Email:</div>
                        <div>{orderDetails.customer_email}</div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {!orderDetails.is_guest ? (
                  <>
                    <Link href={route("orders.show", orderDetails.id)}>
                      <Button className="bg-sky-800 hover:bg-sky-700 text-white w-full transition-colors">
                        <ReceiptText className="mr-2 h-4 w-4" /> View Order
                        Details
                      </Button>
                    </Link>

                    <Link href={route("dashboard")}>
                      <Button
                        variant="outline"
                        className="w-full border-sky-200 text-sky-700 hover:text-sky-900 hover:bg-sky-50 transition-colors"
                      >
                        <Ticket className="mr-2 h-4 w-4" /> View My Tickets
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/">
                    <Button className="bg-sky-800 hover:bg-sky-700 text-white w-full transition-colors">
                      <Home className="mr-2 h-4 w-4" /> Return to Home
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>

            <CardFooter className="border-t pt-4 text-center text-sm text-gray-500">
              A confirmation email has been sent to your email address.
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
