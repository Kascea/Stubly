import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  MailIcon,
  RefreshCwIcon,
  ArrowRightIcon,
  HelpCircleIcon,
  UserIcon,
} from "lucide-react";

export default function Support() {
  return (
    <AppLayout>
      <Head title="Support" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-sky-900">
                Need Help?
              </CardTitle>
              <CardDescription>
                We're a small business dedicated to providing personal
                assistance with any questions or concerns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col h-full">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Contact Us
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Having issues with your order or tickets? Unlike large
                    corporations, we're a small business that values personal
                    connection with our customers.
                  </p>

                  <div className="bg-gray-50 p-5 rounded-lg space-y-3 h-full flex-grow">
                    <div className="flex items-start">
                      <UserIcon className="h-5 w-5 text-sky-700 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700">
                          Small Business, Personal Support
                        </p>
                        <p className="text-gray-600">
                          When you reach out, you'll be speaking directly with
                          the business owner, not a support team.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MailIcon className="h-5 w-5 text-sky-700 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700">
                          Email us at:
                        </p>
                        <a
                          href="mailto:Cole@stubly.shop"
                          className="text-sky-600 hover:text-sky-800 transition-colors"
                        >
                          Cole@stubly.shop
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <HelpCircleIcon className="h-5 w-5 text-sky-700 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700">
                          Response Time:
                        </p>
                        <p className="text-gray-600">
                          We typically respond to all inquiries within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col h-full">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Refund Policy
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Not satisfied with your purchase? We offer hassle-free
                    refunds to ensure your complete satisfaction.
                  </p>

                  <div className="bg-sky-50 border border-sky-100 p-5 rounded-lg space-y-3 h-full flex-grow">
                    <div className="flex items-start">
                      <RefreshCwIcon className="h-5 w-5 text-sky-700 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700">
                          100% Satisfaction Guarantee
                        </p>
                        <p className="text-gray-600">
                          If you're not completely satisfied with your purchase,
                          we'll process a full refund at no additional cost.
                          Simply send us your email address and we'll help you
                          out.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <HelpCircleIcon className="h-5 w-5 text-sky-700 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700">
                          No Additional Fees
                        </p>
                        <p className="text-gray-600">
                          We process all refunds without any additional fees or
                          charges to ensure your satisfaction.
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 pt-2">
                      <Link
                        href={route("support.refund.form")}
                        className="flex items-center text-sky-700 hover:text-sky-900 font-medium group"
                      >
                        Request a refund
                        <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sky-900">
                      How long do refunds take to process?
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Most refunds are processed within 3-5 business days,
                      depending on your payment method.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sky-900">
                      What if I have trouble accessing my tickets?
                    </h3>
                    <p className="text-gray-600 mt-1">
                      If you're having trouble accessing your tickets, please
                      email us with your order details and we'll assist you
                      right away.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sky-900">
                      Are there any fees for refunds?
                    </h3>
                    <p className="text-gray-600 mt-1">
                      No, we process all refunds without any additional fees or
                      charges.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
