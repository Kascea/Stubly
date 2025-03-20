import React, { useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { Button } from "@/Components/ui/button";
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
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, X } from "lucide-react";
import axios from "axios";
import { router } from "@inertiajs/react";
import { toast } from "@/Components/ui/toaster";

export default function CartIndex({ cart, auth }) {
  const { flash = {} } = usePage().props;
  const hasItems = cart.items && cart.items.length > 0;

  // Calculate totals
  const subtotal = hasItems
    ? cart.items.reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0
      )
    : 0;

  const updateQuantity = async (item, newQuantity) => {
    try {
      if (newQuantity < 1) {
        removeItem(item);
        return;
      }

      await axios.patch(route("cart.update", item.id), {
        quantity: newQuantity,
      });

      await updateCartCount();
      router.reload();
    } catch (error) {
      console.error("Failed to update item quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "error",
      });
    }
  };

  const removeItem = async (item) => {
    try {
      await axios.delete(route("cart.remove", item.id));
      router.visit(route("cart.index"), { preserveScroll: true });
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "error",
      });
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(route("cart.clear"));
      await updateCartCount();
      router.reload();
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "error",
      });
    }
  };

  const updateCartCount = async () => {
    try {
      await axios.get(route("cart.count"));
    } catch (error) {
      console.error("Failed to update cart count:", error);
    }
  };

  // Add this useEffect to check for infinite loops
  useEffect(() => {
    console.log("Cart component mounted at:", new Date().toISOString());

    // Add performance monitoring
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      console.log("Fetch request to:", args[0]);
      return originalFetch.apply(this, args);
    };

    // Add axios request monitoring
    const requestInterceptor = axios.interceptors.request.use((request) => {
      console.log("Axios request to:", request.url);
      return request;
    });

    return () => {
      // Clean up
      window.fetch = originalFetch;
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  return (
    <AppLayout auth={auth}>
      <Head title="Your Cart" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center text-sky-900">
              <ShoppingCart className="mr-2" /> Your Cart
            </h1>

            {hasItems && (
              <Button
                variant="outline"
                className="border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                onClick={clearCart}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Clear Cart
              </Button>
            )}
          </div>

          {flash?.success && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-6">
              {flash.success}
            </div>
          )}

          {flash?.error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
              {flash.error}
            </div>
          )}

          {hasItems ? (
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cart.items.length})</CardTitle>
                <CardDescription>
                  Review your tickets before checkout
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket</TableHead>
                      <TableHead>Event Details</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {cart.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.ticket.generated_ticket_url ? (
                            <img
                              src={item.ticket.generated_ticket_url}
                              alt="Ticket"
                              className="w-20 h-auto rounded shadow-sm"
                            />
                          ) : (
                            <div className="w-20 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="font-medium">
                            {item.ticket.event_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.ticket.event_location} •{" "}
                            {new Date(
                              item.ticket.event_datetime
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {item.ticket.section &&
                              `Section ${item.ticket.section}`}
                            {item.ticket.row && ` • Row ${item.ticket.row}`}
                            {item.ticket.seat && ` • Seat ${item.ticket.seat}`}
                          </div>
                        </TableCell>

                        <TableCell>
                          ${parseFloat(item.price).toFixed(2)}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0 border-sky-200 text-sky-900 hover:text-sky-800 hover:bg-sky-50 transition-colors"
                              onClick={() =>
                                updateQuantity(item, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>

                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0 border-sky-200 text-sky-900 hover:text-sky-800 hover:bg-sky-50 transition-colors"
                              onClick={() =>
                                updateQuantity(item, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>

                        <TableCell className="font-medium">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6">
                <div className="mb-4 sm:mb-0">
                  <div className="text-lg font-semibold">
                    Total:{" "}
                    <span className="text-sky-900">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link href={route("canvas")}>
                    <Button
                      variant="outline"
                      className="border-sky-200 text-sky-700 hover:text-sky-900 hover:bg-sky-50 transition-colors"
                    >
                      Continue Shopping
                    </Button>
                  </Link>

                  <Button
                    className="bg-sky-800 hover:bg-sky-700 text-white transition-colors"
                    onClick={() => router.post(route("checkout"))}
                  >
                    Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card className="bg-gray-50 border-dashed border-2 border-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Add some custom tickets to get started
                </p>

                <Link href={route("canvas")}>
                  <Button className="bg-sky-800 hover:bg-sky-700 text-white transition-colors">
                    Create a Ticket
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
