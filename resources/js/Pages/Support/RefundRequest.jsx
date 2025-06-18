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
  ClockIcon,
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

      <div className="py-8 bg-gradient-to-br from-sky-50/30 via-white to-blue-50/20 min-h-screen">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link
              href={route("support.index")}
              className="inline-flex items-center p-2 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-all duration-200"
            >
              <ArrowLeftIcon className="mr-2 h-5 w-5" />
              <span className="font-medium">Back to Support</span>
            </Link>
          </div>

          {/* Success Alert */}
          {showSuccess && (
            <Alert className="mb-6 bg-orange-50 border-orange-200 text-orange-800 shadow-lg">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <AlertDescription className="flex items-center font-medium">
                Your refund request has been submitted successfully! We'll review it and get back to you shortly.
              </AlertDescription>
            </Alert>
          )}

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold flex items-center justify-center text-sky-900 mb-3">
              <RefreshCwIcon className="mr-3 h-8 w-8" />
              Request a Refund
            </h1>
            <p className="text-sky-700/70 max-w-2xl mx-auto">
              Please provide your email address and any information that might help us process your refund faster.
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="bg-sky-50/50 rounded-lg p-3 border-l-4 border-sky-500">
                <div className="flex items-start gap-3">
                  <InfoIcon className="h-5 w-5 text-sky-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sky-800 font-medium mb-1">Direct to Business Owner</p>
                    <p className="text-sky-700 text-sm">
                      This form submits directly to the business owner. All fields except Email Address are optional, 
                      but providing more details helps us process your refund faster.
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sky-900 font-semibold flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-orange-100 rounded-lg">
                        <Mail className="h-4 w-4 text-orange-600" />
                      </div>
                      Email Address
                    </div>
                    <span className="text-orange-600 text-sm font-medium bg-orange-50 px-2 py-1 rounded">
                      Required
                    </span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className="h-11 border-gray-300 focus:ring-sky-500 focus:border-sky-500"
                    required
                  />
                  {errors.email && (
                    <div className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded border border-red-200">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Order ID Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="order_id"
                    className="text-sky-900 font-semibold flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-sky-100 rounded-lg">
                        <Package className="h-4 w-4 text-sky-600" />
                      </div>
                      Order ID
                    </div>
                    <span className="text-gray-500 text-sm font-medium bg-gray-50 px-2 py-1 rounded">
                      Optional
                    </span>
                  </Label>
                  <Input
                    id="order_id"
                    type="text"
                    placeholder="e.g., ORD-2023-ABCDEF"
                    value={data.order_id}
                    onChange={(e) => setData("order_id", e.target.value)}
                    className="h-11 border-gray-300 focus:ring-sky-500 focus:border-sky-500"
                  />
                  {errors.order_id && (
                    <div className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded border border-red-200">
                      {errors.order_id}
                    </div>
                  )}
                </div>

                {/* Reason Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="reason"
                    className="text-sky-900 font-semibold flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-sky-100 rounded-lg">
                        <span className="text-sky-600 text-xs font-bold">R</span>
                      </div>
                      Reason for Refund
                    </div>
                    <span className="text-gray-500 text-sm font-medium bg-gray-50 px-2 py-1 rounded">
                      Optional
                    </span>
                  </Label>
                  <Select
                    value={data.reason}
                    onValueChange={(value) => setData("reason", value)}
                  >
                    <SelectTrigger
                      id="reason"
                      className="h-11 border-gray-300 focus:ring-sky-500 focus:border-sky-500"
                    >
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="duplicate_order">Duplicate Order</SelectItem>
                      <SelectItem value="changed_mind">Changed My Mind</SelectItem>
                      <SelectItem value="wrong_event">Wrong Event/Date</SelectItem>
                      <SelectItem value="technical_issue">Technical Issues</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.reason && (
                    <div className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded border border-red-200">
                      {errors.reason}
                    </div>
                  )}
                </div>

                {/* Details Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="details"
                    className="text-sky-900 font-semibold flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-sky-100 rounded-lg">
                        <FileText className="h-4 w-4 text-sky-600" />
                      </div>
                      Additional Details
                    </div>
                    <span className="text-gray-500 text-sm font-medium bg-gray-50 px-2 py-1 rounded">
                      Optional
                    </span>
                  </Label>
                  <Textarea
                    id="details"
                    rows={4}
                    placeholder="Please provide any additional information that might help us process your refund."
                    value={data.details}
                    onChange={(e) => setData("details", e.target.value)}
                    className="resize-none border-gray-300 focus:ring-sky-500 focus:border-sky-500"
                  />
                  {errors.details && (
                    <div className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded border border-red-200">
                      {errors.details}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-11 bg-sky-800 hover:bg-sky-700 text-white transition-all duration-200 hover:scale-105 font-semibold"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Request...
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

            <CardFooter className="bg-gray-50/50 border-t border-gray-100 rounded-b-lg">
              <div className="flex items-center justify-center w-full text-sm text-gray-600 gap-2">
                <ClockIcon className="h-4 w-4 text-gray-500" />
                <span>We typically process refund requests within 1-2 business days. You'll receive an email confirmation once your refund is processed.</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
