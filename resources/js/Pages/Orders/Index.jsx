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
  ChevronDown,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import TicketCard from "@/Components/TicketCard";

export default function OrdersIndex({ orders, auth }) {
  const [expandedOrders, setExpandedOrders] = React.useState(new Set());

  const toggleOrder = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

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
              {orders.map((order) => {
                const isExpanded = expandedOrders.has(order.order_id);
                
                return (
                  <Card key={order.order_id} className="group transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                      {/* Order Header - Clickable to view order details */}
                      <Link href={route("orders.show", order.order_id)}>
                        <div className="p-6 hover:bg-white/90 transition-colors cursor-pointer">
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
                        </div>
                      </Link>

                      {/* Expand/Collapse Button */}
                      <div className="border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleOrder(order.order_id);
                          }}
                          className="w-full p-4 flex items-center justify-center gap-3 text-sky-700 hover:text-sky-900 hover:bg-sky-50/50 transition-all duration-200 group/chevron"
                        >
                          <span className="text-sm font-medium">
                            {isExpanded ? 'Hide Tickets' : 'Show Tickets'}
                          </span>
                          <ChevronDown 
                            className={`h-5 w-5 transition-transform duration-200 group-hover/chevron:scale-110 ${
                              isExpanded ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                      </div>

                      {/* Expanded Tickets Section */}
                      {isExpanded && order.tickets && order.tickets.length > 0 && (
                        <div className="border-t border-gray-100 bg-gray-50/30 p-6">
                          <div className="space-y-4">
                            {order.tickets.map((ticket) => (
                              <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                price={parseFloat(ticket.price || 2.99)}
                                onClick={() => window.open(route("tickets.view", ticket.ticket_id), '_blank')}
                                showViewIndicator={true}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
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
