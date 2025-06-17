import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import {
  CheckCircle2,
  Home,
  Ticket,
  ReceiptText,
  Mail,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import axios from "axios";
import AppLayout from "@/Layouts/AppLayout";

export default function CheckoutSuccess({ orderDetails, auth }) {
  const [resendStatus, setResendStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleResend = async (e) => {
    e.preventDefault();

    if (isProcessing) return;

    setIsProcessing(true);
    setResendStatus(null);
    setStatusMessage("");

    try {
      // Make AJAX request - CSRF is handled automatically
      const response = await axios.post(
        route("orders.resend-confirmation", orderDetails.id),
        { email: orderDetails.customer_email }
      );

      // Set success status and message
      setResendStatus("success");
      setStatusMessage(
        response.data.message ||
          "Order confirmation email has been resent. Please allow a few minutes for delivery and check your spam folder."
      );
    } catch (error) {
      console.error("Error resending email:", error);

      // Get error message from response if available
      const errorMsg =
        error.response?.data?.error ||
        "Failed to resend email. Please try again later.";

      // Set error status and message
      setResendStatus("error");
      setStatusMessage(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Determine button text based on status
  const getButtonText = () => {
    if (isProcessing) return "Sending...";
    if (resendStatus === "success") return "Email Resent!";
    return "Didn't receive the email? Resend confirmation";
  };

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

                    <Button
                      variant="outline"
                      className="w-full border-sky-200 text-sky-700 hover:text-sky-900 hover:bg-sky-50 transition-colors"
                      onClick={() =>
                        window.open(
                          route("orders.printout", orderDetails.id),
                          "_blank"
                        )
                      }
                    >
                      <ReceiptText className="mr-2 h-4 w-4" /> View My PDF
                    </Button>
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

            <CardFooter className="border-t pt-4 text-center text-sm text-gray-500 flex flex-col gap-4">
              <div>
                A confirmation email has been sent to your email address.
                <span className="block mt-1">
                  Please allow a few minutes for delivery and check your spam
                  folder.
                </span>
              </div>

              {statusMessage && (
                <div
                  className={`mt-2 text-sm p-2 rounded ${
                    resendStatus === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {resendStatus === "success" ? (
                    <CheckCircle2 className="h-4 w-4 inline mr-1" />
                  ) : (
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                  )}
                  {statusMessage}
                </div>
              )}

              <div className="mt-2">
                <Button
                  onClick={handleResend}
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isProcessing || resendStatus === "success"}
                  className={`text-xs ${
                    resendStatus === "success"
                      ? "text-green-600 hover:text-green-800"
                      : resendStatus === "error"
                      ? "text-red-600 hover:text-red-800"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {isProcessing && (
                    <span className="mr-2 h-4 w-4 animate-spin">⟳</span>
                  )}
                  {resendStatus === "success" && (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  {getButtonText()}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
