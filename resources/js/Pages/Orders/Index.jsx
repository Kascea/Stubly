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
  ShoppingBag,
  FileCheck,
  FileX,
  Clock,
  ReceiptText,
  Ticket,
  Plus,
  Calendar,
  DollarSign,
  Package,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";

export default function OrdersIndex({ orders, auth }) {
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

  // Function to get status badge class
  const getStatusBadge = (status) => {
    const statusMap = {
      pending:
        "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
      completed:
        "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
      failed: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
      canceled: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
    };

    return (
      statusMap[status] ||
      "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
    );
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
      <Head title="Order History" />

      <div className="py-12 bg-gradient-to-br from-sky-50/30 via-white to-blue-50/20 min-h-screen">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center text-sky-900 mb-2">
                <ShoppingBag className="mr-3 h-8 w-8" />
                Order History
              </h1>
              <p className="text-sky-700/70">
                Track and manage all your ticket orders
              </p>
            </div>

            {orders.length > 0 && (
              <div className="text-sm text-sky-600 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-sky-100">
                <Package className="inline h-4 w-4 mr-1" />
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </div>
            )}
          </div>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <Link key={order.order_id} href={route("orders.show", order.order_id)} className="block">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:border-orange-300 border border-transparent cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-sky-100 rounded-lg group-hover:bg-sky-200 transition-colors duration-200">
                              <ReceiptText className="h-5 w-5 text-sky-700" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-sky-900 transition-colors">
                                #{order.order_id}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(order.created_at)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <Badge
                              className={`px-3 py-1 text-xs font-medium border transition-all duration-300 hover:scale-105 cursor-default
                                ${getStatusBadge(order.status)}`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1">
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </Badge>
                          </div>
                        </div>

                        {/* Order Preview */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
                          {/* Tickets Preview */}
                          <div className="flex items-center gap-3 px-4 py-2 bg-sky-50/50 rounded-lg border border-sky-100/50 group-hover:bg-sky-100/50 transition-colors">
                            <Ticket className="h-4 w-4 text-sky-700" />
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">
                                {order.tickets.length}
                              </span>
                              <span className="text-gray-500 ml-1">
                                {order.tickets.length === 1 ? 'Ticket' : 'Tickets'}
                              </span>
                            </div>
                          </div>

                          {/* Total Amount */}
                          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50/50 rounded-lg border border-gray-100/50 group-hover:bg-gray-100/50 transition-colors">
                            <div className="text-sm">
                              <span className="font-semibold text-gray-900 text-lg">
                                ${parseFloat(order.total_amount).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Expansion Indicator */}
                          <div className="flex items-center text-sky-600 group-hover:text-sky-800">
                            <span className="text-sm font-medium mr-2 hidden sm:inline">View Details</span>
                            <ChevronRight className="h-5 w-5 transform transition-transform duration-200 group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>

                      {/* Ticket Preview Section */}
                      {order.tickets && order.tickets.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {order.tickets.slice(0, 4).map((ticket, index) => (
                              <div key={ticket.id || index} className="flex flex-col gap-3 p-4 bg-gradient-to-br from-sky-50/80 to-blue-50/40 rounded-lg border border-sky-100/60 hover:from-sky-50 hover:to-blue-50/60 transition-all duration-200 group">
                                {/* Ticket Image */}
                                <div className="w-full h-24 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg overflow-hidden group-hover:scale-[1.02] transition-transform duration-200">
                                  {ticket.generated_ticket_url ? (
                                    <img 
                                      src={ticket.generated_ticket_url} 
                                      alt={`Ticket for ${ticket.event_name || 'Event'}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="h-8 w-8 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a1 1 0 001 1h1m0 0v4a2 2 0 002 2h2M7 9h10a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg></div>';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Ticket className="h-8 w-8 text-sky-700" />
                                    </div>
                                  )}
                                </div>
                                
                                {/* Ticket Info */}
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                                    {ticket.event_name || `Event ${index + 1}`}
                                  </p>
                                  {ticket.event_location && (
                                    <p className="text-xs text-gray-600 truncate mb-1">
                                      {ticket.event_location}
                                    </p>
                                  )}
                                  {(ticket.section || ticket.row || ticket.seat) && (
                                    <p className="text-xs text-gray-500 mb-1">
                                      {[ticket.section, ticket.row && `Row ${ticket.row}`, ticket.seat && `Seat ${ticket.seat}`]
                                        .filter(Boolean)
                                        .join(' • ')}
                                    </p>
                                  )}
                                  {ticket.event_datetime && (
                                    <p className="text-xs text-gray-400">
                                      {new Date(ticket.event_datetime).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                            {order.tickets.length > 4 && (
                              <div className="flex items-center justify-center p-4 bg-gradient-to-br from-gray-50/60 to-gray-100/40 rounded-lg border border-gray-200/60 border-dashed">
                                <div className="text-center">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Plus className="h-4 w-4 text-gray-500" />
                                  </div>
                                  <span className="text-sm text-gray-500 font-medium">
                                    +{order.tickets.length - 4} more
                                  </span>
                                  <p className="text-xs text-gray-400">
                                    {order.tickets.length - 4 === 1 ? 'ticket' : 'tickets'}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="bg-gradient-to-br from-gray-50 to-white border-dashed border-2 border-gray-200 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-gray-100 rounded-full mb-6">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                  No orders yet
                </h3>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                  Create your first custom ticket or check your cart to complete
                  a purchase and start building your order history
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Link href={route("canvas")}>
                    <Button
                      className="relative !bg-sky-800 hover:!bg-sky-700 text-white border-0
                        transition-all duration-300 ease-in-out
                        hover:scale-105 hover:shadow-lg
                        active:scale-100
                        flex items-center gap-2
                        bg-gradient-to-r from-sky-800 to-sky-700
                        hover:from-sky-700 hover:to-sky-600
                        overflow-hidden group px-6 py-3"
                    >
                      <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                      Create Your First Ticket
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                      />
                    </Button>
                  </Link>

                  <Link href={route("cart.index")}>
                    <Button
                      variant="outline"
                      className="relative border-sky-200 text-sky-800
                        transition-all duration-300 ease-in-out
                        hover:scale-105 hover:shadow-lg
                        active:scale-100
                        flex items-center gap-2
                        hover:bg-sky-50
                        overflow-hidden group px-6 py-3"
                    >
                      <ShoppingBag className="h-4 w-4 transition-transform group-hover:rotate-12" />
                      View Cart
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-100/30 to-transparent 
                        -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                      />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
