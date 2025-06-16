import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  ShoppingBag,
  ArrowLeft,
  Clock,
  FileCheck,
  FileX,
  ReceiptText,
  Download,
  Ticket as TicketIcon,
  Calendar,
  DollarSign,
  MapPin,
  User,
  CreditCard,
  Package,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import TicketCard from "@/Components/TicketCard";

export default function OrderShow({ order, auth }) {
  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to format event date
  const formatEventDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to get status badge class
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
      failed: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
      canceled: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
    };

    return statusMap[status] || "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
  };

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FileCheck className="h-4 w-4 text-green-500" />;
      case "failed":
        return <FileX className="h-4 w-4 text-red-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <ReceiptText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <AppLayout auth={auth}>
      <Head title={`Order #${order.order_id}`} />

      <div className="py-12 bg-gradient-to-br from-sky-50/30 via-white to-blue-50/20 min-h-screen">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link
                href={route("orders.index")}
                className="mr-4 p-2 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold flex items-center text-sky-900 mb-2">
                  <ShoppingBag className="mr-3 h-8 w-8" />
                  Order #{order.order_id}
                </h1>
                <p className="text-sky-700/70">
                  Order details and ticket information
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <Badge
              className={`px-4 py-2 text-sm font-medium border transition-all duration-300 hover:scale-105 cursor-default
                ${getStatusBadge(order.status)}`}
            >
              {getStatusIcon(order.status)}
              <span className="ml-2">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Tickets */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center text-xl">
                        <TicketIcon className="mr-2 h-5 w-5 text-sky-700" />
                        Your Tickets
                      </CardTitle>
                    </div>
                    <div className="text-sm text-sky-600 bg-sky-50 px-3 py-1 rounded-lg">
                      <Package className="inline h-4 w-4 mr-1" />
                      {order.tickets.length} {order.tickets.length === 1 ? 'ticket' : 'tickets'} in this order
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {order.tickets.map((ticket, index) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      price={parseFloat(ticket.price || 2.99)}
                      onClick={() => window.open(route("tickets.view", ticket.ticket_id), '_blank')}
                      showViewIndicator={true}
                    />
                  ))}
                </CardContent>

                {/* Actions Footer */}
                <CardFooter className="border-t bg-gray-50/50 rounded-b-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-sky-200 text-sky-700 hover:bg-sky-50 transition-colors"
                      onClick={() => window.open(route("orders.printout", order.order_id), '_blank')}
                    >
                      <Download className="h-4 w-4" />
                      View PDF
                    </Button>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Sidebar - Order Details */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ReceiptText className="mr-2 h-5 w-5 text-sky-700" />
                    Order Details
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">Order Date</span>
                      <span className="text-sm text-gray-900">{formatDate(order.created_at)}</span>
                    </div>

                    {order.payment_id && (
                      <div className="py-3 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-500 mb-2">Payment ID</div>
                        <div className="text-xs font-mono bg-gray-50 p-3 rounded-lg border border-gray-200 break-all">
                          {order.payment_id}
                        </div>
                      </div>
                    )}

                    <div className="py-3">
                      <div className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Billing Information
                      </div>
                      <div className="space-y-2">
                        <div className="font-medium text-gray-900">{auth.user.name}</div>
                        <div className="text-gray-600">{auth.user.email}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t bg-gray-50/50 space-y-3">
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
