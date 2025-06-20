import { useEffect, useState } from "react";
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
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";
import { router } from "@inertiajs/react";
import { toast } from "@/Components/ui/toaster";
import axios from "axios";
import TicketCard from "@/Components/TicketCard";

export default function CartIndex({ cart: initialCart, auth }) {
  const [cart, setCart] = useState(initialCart);
  const [loadingStates, setLoadingStates] = useState({
    items: {},
    clearCart: false,
  });
  const { flash = {} } = usePage().props;
  const hasItems = cart.items && cart.items.length > 0;

  // Calculate only subtotal
  const subtotal = hasItems
    ? cart.items.reduce((total, item) => total + 2.99, 0)
    : 0;

  const deleteTicket = async (item) => {
    setLoadingStates((prev) => ({
      ...prev,
      items: { ...prev.items, [item.id]: true },
    }));

    try {
      await axios.delete(route("tickets.destroy", item.id));

      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter((cartItem) => cartItem.id !== item.id),
        count: prevCart.count - 1,
      }));

      router.reload({ only: ["cart"] });

      toast({
        title: "Ticket removed",
        description: "Ticket has been removed from your cart",
      });
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast({
        title: "Error",
        description: "Failed to remove ticket",
        variant: "error",
      });
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        items: { ...prev.items, [item.id]: false },
      }));
    }
  };

  const clearCart = async () => {
    setLoadingStates((prev) => ({ ...prev, clearCart: true }));

    try {
      await axios.delete(route("cart.clear"));

      setCart((prevCart) => ({
        ...prevCart,
        items: [],
        count: 0,
      }));

      router.reload({ only: ["cart"] });

      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "error",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, clearCart: false }));
    }
  };

  return (
    <AppLayout auth={auth}>
      <Head title="Your Cart" />

      <div className="py-12 bg-gradient-to-br from-sky-50/30 via-white to-blue-50/20 min-h-screen">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center text-sky-900 mb-2">
                <ShoppingCart className="mr-3 h-8 w-8" />
                Your Cart
              </h1>
              <p className="text-sky-700/70">
                Review your custom tickets before checkout
              </p>
            </div>

            {hasItems && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-sky-600 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-sky-100">
                  <ShoppingCart className="inline h-4 w-4 mr-1" />
                  {cart.items.length}{" "}
                  {cart.items.length === 1 ? "Item" : "Items"}
                </div>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50/50 transition-colors"
                  onClick={clearCart}
                  disabled={loadingStates.clearCart}
                >
                  {loadingStates.clearCart ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-1" />
                  )}
                  Clear Cart
                </Button>
              </div>
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
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sky-900">Your Tickets</CardTitle>
                <CardDescription>Review before checkout</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {cart.items.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    price="2.99"
                    actions={
                      <div className="flex space-x-2">
                        <Link href={route("tickets.duplicate", ticket.id)}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Duplicate
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteTicket(ticket)}
                          disabled={loadingStates.items[ticket.id]}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50/50 border-red-200 hover:border-red-300 transition-colors w-9"
                        >
                          {loadingStates.items[ticket.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    }
                  />
                ))}
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 bg-gradient-to-r from-sky-50/20 to-blue-50/20">
                <div className="mb-4 sm:mb-0">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold">
                      Subtotal:{" "}
                      <span className="text-sky-900">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Taxes calculated at checkout
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link href={route("canvas")}>
                    <Button
                      variant="ghost"
                      className="text-sky-700 hover:text-sky-900 hover:bg-sky-100/50"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create Another
                    </Button>
                  </Link>

                  <Link href={route("cart.checkout")}>
                    <Button
                      size="lg"
                      className="bg-sky-800 hover:bg-sky-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card className="bg-gradient-to-br from-gray-50/80 to-white border-dashed border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/60 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-sky-100 rounded-full mb-6">
                  <ShoppingCart className="h-12 w-12 text-sky-700" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                  Create your first custom ticket to get started with building
                  amazing event experiences
                </p>

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
                    style={{ backgroundColor: "#075985" }}
                  >
                    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                    Create Your First Ticket
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                      -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                    />
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
