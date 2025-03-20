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
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.order_id}>
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
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
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
                              className="text-sky-900 hover:text-orange-400 hover:bg-orange-50 transition-colors"
                            >
                              View <ArrowRight className="ml-1 h-4 w-4" />
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
                  Add some tickets to your cart and complete your purchase
                </p>

                <Link href={route("cart.index")}>
                  <Button className="bg-sky-800 hover:bg-sky-700 text-white transition-colors">
                    Go to Cart
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
