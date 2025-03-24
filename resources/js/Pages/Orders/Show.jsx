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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  ShoppingBag,
  ArrowLeft,
  Clock,
  FileCheck,
  FileX,
  ReceiptText,
  Download,
  Ticket as TicketIcon,
} from "lucide-react";
import { Button } from "@/Components/ui/button";

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
      <Head title={`Order #${order.order_id}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link
              href={route("orders.index")}
              className="mr-4 text-sky-600 hover:text-sky-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold flex items-center text-sky-900">
              <ShoppingBag className="mr-2 h-6 w-6" />
              Order #{order.order_id}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tickets</CardTitle>
                  <CardDescription>
                    Tickets purchased in this order
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {order.tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>
                            {ticket.generated_ticket_url ? (
                              <img
                                src={ticket.generated_ticket_url}
                                alt="Ticket"
                                className="w-20 h-auto rounded shadow-sm"
                              />
                            ) : (
                              <div className="w-20 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                <TicketIcon className="h-6 w-6" />
                              </div>
                            )}
                          </TableCell>

                          <TableCell>
                            <div className="font-medium">
                              {ticket.event_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {ticket.event_location} •{" "}
                              {formatDate(ticket.event_datetime)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {ticket.section && `Section ${ticket.section}`}
                              {ticket.row && ` • Row ${ticket.row}`}
                              {ticket.seat && ` • Seat ${ticket.seat}`}
                            </div>
                          </TableCell>

                          <TableCell className="font-medium">
                            ${parseFloat(ticket.price).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>

                <CardFooter className="flex justify-between border-t pt-6">
                  <div>
                    <Link
                      href={route("orders.download", order.order_id)}
                      className="inline-flex items-center text-sky-600 hover:text-sky-800 transition-colors"
                    >
                      <Download className="mr-1 h-4 w-4" /> Download Tickets
                    </Link>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">
                      Total Amount
                    </div>
                    <div className="text-xl font-bold text-sky-900">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Status</div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border inline-flex items-center ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1">
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </span>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Order Date</div>
                    <div>{formatDate(order.created_at)}</div>
                  </div>

                  {order.payment_id && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Payment ID
                      </div>
                      <div className="text-sm font-mono bg-gray-50 p-2 rounded border">
                        {order.payment_id}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t mt-4">
                    <div className="text-sm text-gray-500 mb-1">
                      Billing Information
                    </div>
                    <div className="font-medium">{auth.user.name}</div>
                    <div>{auth.user.email}</div>
                  </div>
                </CardContent>

                <CardFooter className="border-t pt-4">
                  <Button
                    variant="outline"
                    className="w-full justify-center border-sky-200 text-sky-700 hover:text-sky-900 hover:bg-sky-50 transition-colors"
                    onClick={() => window.print()}
                  >
                    <ReceiptText className="mr-1 h-4 w-4" /> Print Receipt
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
