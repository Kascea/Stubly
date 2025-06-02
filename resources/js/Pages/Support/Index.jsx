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
  HeartIcon,
  ShieldCheckIcon,
  MessageCircleIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";

export default function Support() {
  const { flash } = usePage().props;

  const featuredFaqs = [
    {
      q: "How do I contact support?",
      a: "We're a small business that values personal connection! Email us directly at Cole@stubly.shop and you'll be speaking with the business owner, not a support team. We typically respond within 24 hours.",
    },
    {
      q: "Do you offer refunds?",
      a: "Yes! We offer a 100% satisfaction guarantee with hassle-free refunds. If you're not completely satisfied, we'll process a full refund at no additional cost to you.",
    },
    {
      q: "What if I have trouble accessing my tickets?",
      a: "No worries! Email us with your order details at Cole@stubly.shop and we'll help you access your tickets right away. We're here to make sure you get what you paid for.",
    },
  ];

  return (
    <AppLayout>
      <Head title="Support" />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {flash.success && (
            <Alert className="mb-6 bg-green-50 border border-green-200 text-green-800 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
              <AlertDescription>{flash.success}</AlertDescription>
            </Alert>
          )}

          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-sky-900 lg:text-5xl mb-4">
              We're Here to Help
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Personal support from a small business that cares about your
              experience
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="relative overflow-hidden border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <CardHeader className="relative pb-4">
                <div className="flex items-center mb-3">
                  <div className="p-3 bg-orange-100 rounded-lg mr-4">
                    <MessageCircleIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl text-sky-900">
                    Direct Support
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  Get personal help from the business owner
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-3">
                <div className="flex items-start space-x-3">
                  <HeartIcon className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Small Business, Big Care
                    </p>
                    <p className="text-gray-600">
                      When you email us, you're speaking directly with the
                      business owner who genuinely cares about your experience.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MailIcon className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Email Us Directly
                    </p>
                    <a
                      href="mailto:Cole@stubly.shop"
                      className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                      Cole@stubly.shop
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <HelpCircleIcon className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Quick Response</p>
                    <p className="text-gray-600">
                      We typically respond within 24 hours, often much sooner.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-sky-100 hover:border-sky-200 transition-all duration-300 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100 to-sky-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <CardHeader className="relative pb-4">
                <div className="flex items-center mb-3">
                  <div className="p-3 bg-sky-100 rounded-lg mr-4">
                    <ShieldCheckIcon className="h-6 w-6 text-sky-600" />
                  </div>
                  <CardTitle className="text-xl text-sky-900">
                    Satisfaction Guarantee
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  100% satisfaction or your money back
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-3">
                <div className="flex items-start space-x-3">
                  <RefreshCwIcon className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Hassle-Free Refunds
                    </p>
                    <p className="text-gray-600">
                      Not satisfied? We'll process a full refund with no
                      additional fees or questions asked.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <UserIcon className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Personal Touch</p>
                    <p className="text-gray-600">
                      We work with you personally to make sure everything is
                      exactly right.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href={route("support.refund.form")}
                    className="inline-flex items-center bg-sky-800 hover:bg-sky-700 text-white px-4 py-2.5 rounded-lg font-medium group transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Request a refund
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="border-t border-gray-200 pt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-sky-900 mb-3">
                Common Questions
              </h2>
              <p className="text-gray-600">
                Quick answers to help you get started
              </p>
            </div>

            {/* Featured FAQs */}
            <div className="space-y-4 mb-8">
              {featuredFaqs.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-100 rounded-lg p-5 hover:border-orange-200 hover:shadow-md transition-all duration-300"
                >
                  <h4 className="text-lg font-semibold text-sky-900 mb-2">
                    {item.q}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>

            {/* View All FAQs CTA */}
            <div className="text-center bg-gradient-to-r from-orange-50 to-sky-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-sky-900 mb-3">
                Need More Answers?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Find comprehensive answers to all your questions in our detailed
                FAQ section, or reach out directly for personal assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="https://stubly.shop/faq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors group"
                >
                  View All FAQs
                  <ArrowRightIcon className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="mailto:Cole@stubly.shop"
                  className="inline-flex items-center border-2 border-sky-200 hover:border-sky-300 text-sky-700 hover:text-sky-800 px-6 py-3 rounded-lg font-medium transition-colors group"
                >
                  Contact Support
                  <MailIcon className="ml-2 w-5 h-5 transition-transform group-hover:scale-110" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
