import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import {
  ArrowLeftIcon,
  InfoIcon,
  Mail,
  Package,
  FileText,
  Loader2,
  CheckCircle,
  RefreshCwIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";

export default function RefundRequest() {
  const [showSuccess, setShowSuccess] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    order_id: "",
    email: "",
    reason: "",
    details: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("support.refund.submit"), {
      onSuccess: () => {
        reset();
        setShowSuccess(true);
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      },
    });
  };

  return (
    <AppLayout>
      <Head title="Request a Refund" />

      <div className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              href={route("support.index")}
              className="inline-flex items-center text-sky-700 hover:text-sky-900 font-medium transition-colors group"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Support
            </Link>
          </div>

          {showSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200 text-green-800 shadow-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="flex items-center font-medium">
                Your refund request has been submitted successfully! We'll
                review it and get back to you shortly.
              </AlertDescription>
            </Alert>
          )}

          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl">
                <RefreshCwIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-sky-900 lg:text-4xl mb-3">
              Request a Refund
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer hassle-free refunds with no additional fees. Just provide
              your email and we'll take care of the rest.
            </p>
          </div>

          {/* Guarantee Banner */}
          <div className="bg-gradient-to-r from-sky-50 to-orange-50 rounded-2xl p-5 mb-6 border border-sky-100">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-sky-100 rounded-lg flex-shrink-0">
                <ShieldCheckIcon className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-sky-900 mb-1">
                  100% Satisfaction Guarantee
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  This form submits directly to the business owner. All fields
                  except your email are optional, but providing more details
                  helps us process your refund faster. We typically respond
                  within 24 hours.
                </p>
              </div>
            </div>
          </div>

          <Card className="relative overflow-hidden border-orange-100 hover:border-orange-200 transition-all duration-300 shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full -translate-y-16 translate-x-16 opacity-30"></div>

            <CardHeader className="relative">
              <CardTitle className="text-2xl font-semibold text-sky-900 flex items-center">
                <Mail className="h-6 w-6 text-orange-500 mr-3" />
                Refund Information
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Please provide your email address and any additional information
                to help us process your request.
              </CardDescription>
            </CardHeader>

            <CardContent className="relative">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sky-900 font-medium flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-orange-500" />
                      Email Address
                    </div>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                      Required
                    </span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className="border-gray-200 focus:ring-orange-500 focus:border-orange-500 h-11"
                    required
                  />
                  {errors.email && (
                    <div className="text-red-500 text-sm font-medium">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="order_id"
                    className="text-sky-900 font-medium flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-orange-500" />
                      Order ID
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      Optional
                    </span>
                  </Label>
                  <Input
                    id="order_id"
                    type="text"
                    placeholder="e.g., ORD-2023-ABCDEF"
                    value={data.order_id}
                    onChange={(e) => setData("order_id", e.target.value)}
                    className="border-gray-200 focus:ring-orange-500 focus:border-orange-500 h-11"
                  />
                  {errors.order_id && (
                    <div className="text-red-500 text-sm font-medium">
                      {errors.order_id}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="reason"
                    className="text-sky-900 font-medium flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center">
                      <span className="bg-sky-100 text-sky-800 p-1.5 rounded-lg mr-2 text-xs font-medium">
                        REASON
                      </span>
                      Reason for Refund
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      Optional
                    </span>
                  </Label>
                  <Select
                    value={data.reason}
                    onValueChange={(value) => setData("reason", value)}
                  >
                    <SelectTrigger
                      id="reason"
                      className="border-gray-200 focus:ring-orange-500 focus:border-orange-500 h-11"
                    >
                      <SelectValue placeholder="Select a reason (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="duplicate_order">
                        Duplicate Order
                      </SelectItem>
                      <SelectItem value="changed_mind">
                        Changed My Mind
                      </SelectItem>
                      <SelectItem value="wrong_event">
                        Wrong Event/Date
                      </SelectItem>
                      <SelectItem value="technical_issue">
                        Technical Issues
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.reason && (
                    <div className="text-red-500 text-sm font-medium">
                      {errors.reason}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="details"
                    className="text-sky-900 font-medium flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-orange-500" />
                      Additional Details
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      Optional
                    </span>
                  </Label>
                  <Textarea
                    id="details"
                    rows={3}
                    placeholder="Any additional information that might help us process your refund faster..."
                    value={data.details}
                    onChange={(e) => setData("details", e.target.value)}
                    className="resize-none border-gray-200 focus:ring-orange-500 focus:border-orange-500"
                  />
                  {errors.details && (
                    <div className="text-red-500 text-sm font-medium">
                      {errors.details}
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-sky-800 hover:bg-sky-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Your Request...
                      </>
                    ) : (
                      <>
                        <RefreshCwIcon className="mr-2 h-5 w-5" />
                        Submit Refund Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="bg-gradient-to-r from-gray-50 to-sky-50 border-t border-gray-100 relative">
              <div className="flex items-start space-x-3 text-sm">
                <InfoIcon className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
                <div className="text-gray-600">
                  <p className="font-medium text-sky-900 mb-1">
                    What happens next?
                  </p>
                  <p>
                    We typically process refund requests within 1-2 business
                    days. You'll receive an email confirmation once your refund
                    is processed, and funds usually appear in your account
                    within 3-5 business days.
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Contact Support Section */}
          <div className="mt-8 text-center bg-gradient-to-r from-orange-50 to-sky-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-sky-900 mb-2">
              Need Help with Your Request?
            </h3>
            <p className="text-gray-600 mb-4">
              Have questions about the refund process? We're here to help with
              personal support.
            </p>
            <Link
              href="mailto:Cole@stubly.shop"
              className="inline-flex items-center border-2 border-sky-200 hover:border-sky-300 text-sky-700 hover:text-sky-800 px-6 py-3 rounded-lg font-medium transition-colors group"
            >
              Contact Support
              <Mail className="ml-2 w-5 h-5 transition-transform group-hover:scale-110" />
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
