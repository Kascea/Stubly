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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
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

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(item);
      return;
    }

    setLoadingStates((prev) => ({
      ...prev,
      items: { ...prev.items, [item.id]: true },
    }));

    try {
      await axios.patch(route("cart.update", item.id), {
        quantity: newQuantity,
      });

      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        ),
      }));

      toast({
        title: "Cart updated",
        description: "Item quantity has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "error",
      });
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        items: { ...prev.items, [item.id]: false },
      }));
    }
  };

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

  const createSimilarTicket = (ticket) => {
    router.get(route("canvas"), {
      template: ticket.template_id,
      prefill: {
        eventName: ticket.event_name,
        eventLocation: ticket.event_location,
        date: new Date(ticket.event_datetime).toISOString().split("T")[0],
        time: new Date(ticket.event_datetime).toTimeString().split(" ")[0],
        section: ticket.section,
        row: ticket.row,
        seat: ticket.seat,
      },
    });
  };

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
                disabled={loadingStates.clearCart}
              >
                {loadingStates.clearCart ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-1" />
                )}
                Clear Cart
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
                      <TableHead>Actions</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {cart.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.generated_ticket_url ? (
                            <img
                              src={item.generated_ticket_url}
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
                          <div className="font-medium">{item.event_name}</div>
                          <div className="text-sm text-gray-500">
                            {item.event_location} •{" "}
                            {new Date(item.event_datetime).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {item.section && `Section ${item.section}`}
                            {item.row && ` • Row ${item.row}`}
                            {item.seat && ` • Seat ${item.seat}`}
                          </div>
                        </TableCell>

                        <TableCell>$2.99</TableCell>

                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-sky-200 text-sky-900 hover:text-sky-800 hover:bg-sky-50 transition-colors"
                              onClick={() => createSimilarTicket(item)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Create Similar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTicket(item)}
                              disabled={loadingStates.items[item.id]}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              {loadingStates.items[item.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6">
                <div className="mb-4 sm:mb-0">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold">
                      Subtotal:{" "}
                      <span className="text-sky-900">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Taxes will be calculated at checkout
                    </div>
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

                  <Link href={route("cart.checkout")} prefetch>
                    <Button className="bg-sky-800 hover:bg-sky-700 text-white transition-colors">
                      Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
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
                    style={{ backgroundColor: "#075985" }}
                  >
                    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                    Create a Ticket
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                      -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out"
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
