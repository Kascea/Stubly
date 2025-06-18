import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
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
  CheckCircle,
  ExternalLinkIcon,
  HeadphonesIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Button } from "@/Components/ui/button";

export default function Support() {
  const { flash } = usePage().props;

  return (
    <AppLayout>
      <Head title="Support" />

      <div className="py-8 bg-gradient-to-br from-sky-50/30 via-white to-blue-50/20 min-h-screen">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {flash.success && (
            <Alert className="bg-green-50 border border-green-200 text-green-800 flex items-center shadow-sm">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
              <AlertDescription>{flash.success}</AlertDescription>
            </Alert>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold flex items-center justify-center text-sky-900 mb-3">
              <HeadphonesIcon className="mr-3 h-8 w-8" />
              Support Center
            </h1>
            <p className="text-sky-700/70 max-w-2xl mx-auto">
              We're a small business dedicated to providing personal assistance with any questions or concerns
            </p>
          </div>

          {/* Main Support Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Contact Us Card */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-sky-900 flex items-center">
                  <MailIcon className="mr-3 h-6 w-6 text-sky-700" />
                  Contact Us
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Having issues with your order or tickets? We're here to help with personal support.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-br from-sky-50 to-blue-50/40 p-5 rounded-lg border border-sky-100/60">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-sky-100 rounded-lg">
                        <UserIcon className="h-4 w-4 text-sky-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Small Business, Personal Support</p>
                        <p className="text-gray-600 text-sm">
                          When you reach out, you'll be speaking directly with the business owner, not a support team.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-sky-100 rounded-lg">
                        <MailIcon className="h-4 w-4 text-sky-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Email us at:</p>
                        <a
                          href="mailto:Cole@stubly.shop"
                          className="text-sky-600 hover:text-sky-800 transition-colors font-medium"
                        >
                          Cole@stubly.shop
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-sky-100 rounded-lg">
                        <ClockIcon className="h-4 w-4 text-sky-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Response Time:</p>
                        <p className="text-gray-600 text-sm">
                          We typically respond to all inquiries within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refund Policy Card */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-sky-900 flex items-center">
                  <RefreshCwIcon className="mr-3 h-6 w-6 text-sky-700" />
                  Refund Policy
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Not satisfied with your purchase? We offer hassle-free refunds to ensure your satisfaction.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-br from-sky-50 to-blue-50/40 p-5 rounded-lg border border-sky-100/60">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <ShieldCheckIcon className="h-4 w-4 text-orange-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">100% Satisfaction Guarantee</p>
                        <p className="text-gray-600 text-sm">
                          If you're not completely satisfied with your purchase, we'll process a full refund at no additional cost.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <HelpCircleIcon className="h-4 w-4 text-orange-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">No Additional Fees</p>
                        <p className="text-gray-600 text-sm">
                          We process all refunds without any additional fees or charges to ensure your satisfaction.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Section */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-sky-900 mb-2">Need a Refund?</h3>
                <p className="text-gray-600 mb-4">
                  Simply fill out our quick form and we'll process your request within 1-2 business days.
                </p>
                <Link href={route("support.refund.form")}>
                  <Button className="bg-sky-800 hover:bg-sky-700 text-white transition-all duration-200 hover:scale-105 px-8">
                    <RefreshCwIcon className="mr-2 h-4 w-4" />
                    Request a Refund
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold text-sky-900 flex items-center">
                <HelpCircleIcon className="mr-3 h-6 w-6 text-sky-700" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-sky-50/50 rounded-lg border border-sky-100">
                    <h3 className="font-semibold text-sky-900 mb-2">
                      How long do refunds take to process?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Most refunds are processed within 3-5 business days, depending on your payment method.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-sky-50/50 rounded-lg border border-sky-100">
                    <h3 className="font-semibold text-sky-900 mb-2">
                      Are there any fees for refunds?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      No, we process all refunds without any additional fees or charges.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-sky-50/50 rounded-lg border border-sky-100">
                    <h3 className="font-semibold text-sky-900 mb-2">
                      What if I have trouble accessing my tickets?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      If you're having trouble accessing your tickets, please email us with your order details and we'll assist you right away.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-sky-50/50 rounded-lg border border-sky-100">
                    <h3 className="font-semibold text-sky-900 mb-2">
                      How can I contact support?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Simply email us at Cole@stubly.shop and you'll get a personal response from the business owner within 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* More FAQs Link */}
              <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <a
                  href="https://stubly.shop/faq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sky-600 hover:text-sky-800 font-medium transition-colors duration-200 group"
                >
                  <span>More FAQs</span>
                  <ExternalLinkIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
