import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
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
  ArrowRight,
  Ticket,
  Plus,
} from "lucide-react";
import { Button } from "@/Components/ui/button";

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
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      canceled: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return statusMap[status] || "bg-gray-100 text-gray-800 border-gray-200";
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

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center text-sky-900">
              <ShoppingBag className="mr-2 h-6 w-6" />
              Order History
            </h1>
          </div>

          {orders.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>
                  View all your past and current orders
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Ts</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={order.order_id}
                        className="transition-colors hover:bg-sky-50/50 cursor-pointer"
                      >
                        <TableCell className="font-medium">
                          {order.order_id}
                        </TableCell>

                        <TableCell>{formatDate(order.created_at)}</TableCell>

                        <TableCell>
                          <div className="flex items-center">
                            <Ticket className="h-4 w-4 mr-1 text-sky-700" />
                            {order.tickets.length}
                          </div>
                        </TableCell>

                        <TableCell>
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border
                              transition-all duration-300 ease-in-out
                              hover:scale-105
                              flex items-center gap-1 w-fit
                              ${getStatusBadge(order.status)}`}
                          >
                            <span className="transition-transform duration-300 hover:rotate-12">
                              {getStatusIcon(order.status)}
                            </span>
                            <span className="ml-1 inline-block">
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </span>
                        </TableCell>

                        <TableCell>
                          <Link href={route("orders.show", order.order_id)}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-sky-900 hover:text-sky-700
                                transition-all duration-300
                                hover:scale-105
                                flex items-center gap-2
                                relative
                                overflow-hidden
                                group"
                            >
                              View
                              <ArrowRight
                                className="ml-1 h-4 w-4 transition-transform duration-300 
                                group-hover:translate-x-1"
                              />
                              <div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-100/30 to-transparent 
                                -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                              />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-50 border-dashed border-2 border-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create a custom ticket or check your cart to complete a
                  purchase
                </p>

                <div className="flex gap-4 items-center">
                  <Link href={route("canvas")} prefetch>
                    <Button
                      className="relative !bg-sky-800 hover:!bg-sky-700 text-white border-0
                        transition-all duration-300 ease-in-out
                        hover:scale-105 hover:shadow-lg
                        active:scale-100
                        flex items-center gap-2
                        bg-gradient-to-r from-sky-800 to-sky-700
                        hover:from-sky-700 hover:to-sky-600
                        overflow-hidden"
                    >
                      <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                      Create a Ticket
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out"
                      />
                    </Button>
                  </Link>

                  <Link href={route("cart.index")} prefetch>
                    <Button
                      variant="outline"
                      className="relative border-sky-200 text-sky-800
                        transition-all duration-300 ease-in-out
                        hover:scale-105 hover:shadow-lg
                        active:scale-100
                        flex items-center gap-2
                        hover:bg-sky-50
                        overflow-hidden"
                    >
                      <ShoppingBag className="h-4 w-4 transition-transform group-hover:rotate-12" />
                      View Cart
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-100/30 to-transparent 
                        -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out"
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
