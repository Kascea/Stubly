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

      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href={route("support.index")}
              className="inline-flex items-center text-sky-700 hover:text-sky-900"
            >
              <ArrowLeftIcon className="mr-1 h-4 w-4" /> Back to Support
            </Link>
          </div>

          {showSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="flex items-center">
                Your refund request has been submitted successfully! We'll
                review it and get back to you shortly.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-sky-900">
                Request a Refund
              </CardTitle>
              <CardDescription>
                Please provide your email address and any information that might
                help us process your refund faster.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="bg-sky-50/50 rounded-lg p-3 text-sm text-sky-800 border-l-4 border-sky-500 mb-6">
                <p>
                  This form submits directly to the business owner. All fields
                  except Email Address are optional, but providing more details
                  helps us process your refund faster.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sky-900 font-medium flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-orange-500" />
                      Email Address
                    </div>
                    <span className="text-orange-500 text-xs font-medium">
                      Required
                    </span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                  {errors.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="order_id"
                    className="text-sky-900 font-medium flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1 text-orange-500" />
                      Order ID
                    </div>
                    <span className="text-gray-500 text-xs font-medium">
                      Optional
                    </span>
                  </Label>
                  <Input
                    id="order_id"
                    type="text"
                    placeholder="e.g., ORD-2023-ABCDEF"
                    value={data.order_id}
                    onChange={(e) => setData("order_id", e.target.value)}
                    className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                  {errors.order_id && (
                    <div className="text-red-500 text-sm">
                      {errors.order_id}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="reason"
                    className="text-sky-900 font-medium flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="bg-sky-100 text-sky-800 p-1 rounded-md mr-2 text-xs">
                        REASON
                      </span>
                      Reason for Refund
                    </div>
                    <span className="text-gray-500 text-xs font-medium">
                      Optional
                    </span>
                  </Label>
                  <Select
                    value={data.reason}
                    onValueChange={(value) => setData("reason", value)}
                  >
                    <SelectTrigger
                      id="reason"
                      className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <SelectValue placeholder="Select a reason" />
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
                    <div className="text-red-500 text-sm">{errors.reason}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="details"
                    className="text-sky-900 font-medium flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1 text-orange-500" />
                      Additional Details
                    </div>
                    <span className="text-gray-500 text-xs font-medium">
                      Optional
                    </span>
                  </Label>
                  <Textarea
                    id="details"
                    rows={4}
                    placeholder="Please provide any additional information that might help us process your refund."
                    value={data.details}
                    onChange={(e) => setData("details", e.target.value)}
                    className="resize-none mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                  {errors.details && (
                    <div className="text-red-500 text-sm">{errors.details}</div>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-sky-800 hover:bg-sky-700 text-white transition-colors"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Submit Refund Request"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
              We typically process refund requests within 1-2 business days.
              You'll receive an email confirmation once your refund is
              processed.
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
