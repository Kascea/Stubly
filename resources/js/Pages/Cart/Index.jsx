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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  X,
  Loader2,
  Copy,
} from "lucide-react";
import { router } from "@inertiajs/react";
import axios from "axios";
import TicketCard from "@/Components/TicketCard";

export default function CartIndex({ cart: initialCart, auth }) {
  const [cart, setCart] = useState(initialCart);
  const [loadingStates, setLoadingStates] = useState({
    items: {},
    clearCart: false,
  });
  const [duplicateDialog, setDuplicateDialog] = useState({
    isOpen: false,
    ticket: null,
    section: "",
    row: "",
    seat: "",
    error: null,
    isLoading: false,
  });
  const { flash = {} } = usePage().props;
  const hasItems = cart.items && cart.items.length > 0;

  // Calculate only subtotal
  const subtotal = hasItems
    ? cart.items.reduce((total, item) => total + 2.99, 0)
    : 0;

  const openDuplicateDialog = (ticket) => {
    setDuplicateDialog({
      isOpen: true,
      ticket: ticket,
      section: ticket.section || "",
      row: ticket.row || "",
      seat: ticket.seat || "",
      error: null,
      isLoading: false,
    });
  };

  const closeDuplicateDialog = () => {
    setDuplicateDialog({
      isOpen: false,
      ticket: null,
      section: "",
      row: "",
      seat: "",
      error: null,
      isLoading: false,
    });
  };

  const handleDuplicateSubmit = async () => {
    if (!duplicateDialog.ticket) return;

    setDuplicateDialog((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await axios.post(route("tickets.duplicate.create"), {
        original_ticket_id: duplicateDialog.ticket.ticket_id,
        section: duplicateDialog.section,
        row: duplicateDialog.row,
        seat: duplicateDialog.seat,
      });

      // Add the new ticket to cart
      await axios.post(route("cart.add"), {
        ticket_id: response.data.ticket.ticket_id,
      });

      setCart((prevCart) => ({
        ...prevCart,
        items: [...prevCart.items, response.data.ticket],
        count: prevCart.count + 1,
      }));

      router.reload({ only: ["cart"] });

      closeDuplicateDialog();
    } catch (error) {
      console.error("Error duplicating ticket:", error);

      let errorMessage = "Failed to duplicate ticket. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to duplicate this ticket.";
      } else if (error.response?.status === 404) {
        errorMessage = "Original ticket not found.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      setDuplicateDialog((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const deleteTicket = async (item) => {
    setLoadingStates((prev) => ({
      ...prev,
      items: { ...prev.items, [item.ticket_id]: true },
    }));

    try {
      await axios.delete(route("tickets.destroy", item.ticket_id));

      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter(
          (cartItem) => cartItem.ticket_id !== item.ticket_id
        ),
        count: prevCart.count - 1,
      }));

      router.reload({ only: ["cart"] });
    } catch (error) {
      console.error("Error deleting ticket:", error);
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        items: { ...prev.items, [item.ticket_id]: false },
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
    } catch (error) {
      console.error("Error clearing cart:", error);
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - Tickets */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sky-900">
                          Your Tickets
                        </CardTitle>
                        <CardDescription>
                          Review before checkout
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center text-sm text-sky-600 bg-sky-50/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-sky-200">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {cart.items.length}{" "}
                          {cart.items.length === 1 ? "ticket" : "tickets"}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50/50 transition-colors"
                          onClick={clearCart}
                          disabled={loadingStates.clearCart}
                        >
                          {loadingStates.clearCart ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-1" />
                          )}
                          Clear cart
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {cart.items.map((ticket) => (
                      <TicketCard
                        key={ticket.ticket_id}
                        ticket={ticket}
                        price="2.99"
                        actions={
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDuplicateDialog(ticket)}
                              className="border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Duplicate
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteTicket(ticket)}
                              disabled={loadingStates.items[ticket.ticket_id]}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50/50 border-red-200 hover:border-red-300 transition-colors w-9"
                            >
                              {loadingStates.items[ticket.ticket_id] ? (
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
                </Card>
              </div>

              {/* Sidebar - Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-sky-900">
                        Order Summary
                      </CardTitle>
                      <CardDescription>
                        {cart.items.length}{" "}
                        {cart.items.length === 1 ? "ticket" : "tickets"} in your
                        cart
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {cart.items.length} × Digital Ticket
                            {cart.items.length !== 1 ? "s" : ""}
                          </span>
                          <span className="font-medium">
                            ${subtotal.toFixed(2)}
                          </span>
                        </div>

                        <div className="border-t pt-3">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Subtotal</span>
                            <span className="text-sky-900">
                              ${subtotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Taxes calculated at checkout
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-3 pt-6 border-t bg-gradient-to-r from-sky-50/20 to-blue-50/20">
                      <Link href={route("cart.checkout")} className="w-full">
                        <Button
                          size="lg"
                          className="w-full bg-sky-800 hover:bg-sky-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          Checkout <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>

                      <Link href={route("canvas")} className="w-full">
                        <Button
                          variant="ghost"
                          className="w-full text-sky-700 hover:text-sky-900 hover:bg-sky-100/50"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Create Another
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
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

      {/* Duplicate Dialog */}
      <Dialog open={duplicateDialog.isOpen} onOpenChange={closeDuplicateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Copy className="h-5 w-5 mr-2 text-sky-700" />
              Duplicate Ticket
            </DialogTitle>
            <DialogDescription>
              Create a copy of this ticket with custom seating information.
            </DialogDescription>
          </DialogHeader>

          {duplicateDialog.ticket && (
            <div className="space-y-4">
              <div className="bg-sky-50 p-3 rounded-lg border border-sky-200">
                <p className="text-sm text-sky-800 font-medium">
                  {duplicateDialog.ticket.event_name}
                </p>
                <p className="text-xs text-sky-600">
                  {duplicateDialog.ticket.event_location}
                </p>
              </div>

              {/* Error Message */}
              {duplicateDialog.error && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800">
                    {duplicateDialog.error}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="section" className="text-sm font-medium">
                    Section
                  </Label>
                  <Input
                    id="section"
                    value={duplicateDialog.section}
                    onChange={(e) =>
                      setDuplicateDialog((prev) => ({
                        ...prev,
                        section: e.target.value,
                        error: null, // Clear error when user starts typing
                      }))
                    }
                    placeholder="e.g. 101"
                    className="mt-1"
                    disabled={duplicateDialog.isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="row" className="text-sm font-medium">
                    Row
                  </Label>
                  <Input
                    id="row"
                    value={duplicateDialog.row}
                    onChange={(e) =>
                      setDuplicateDialog((prev) => ({
                        ...prev,
                        row: e.target.value,
                        error: null, // Clear error when user starts typing
                      }))
                    }
                    placeholder="e.g. A"
                    className="mt-1"
                    disabled={duplicateDialog.isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="seat" className="text-sm font-medium">
                    Seat
                  </Label>
                  <Input
                    id="seat"
                    value={duplicateDialog.seat}
                    onChange={(e) =>
                      setDuplicateDialog((prev) => ({
                        ...prev,
                        seat: e.target.value,
                        error: null, // Clear error when user starts typing
                      }))
                    }
                    placeholder="e.g. 15"
                    className="mt-1"
                    disabled={duplicateDialog.isLoading}
                  />
                </div>
              </div>

              <div className="text-xs text-gray-500">
                All other ticket details will be copied from the original
                ticket.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDuplicateDialog}
              disabled={duplicateDialog.isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDuplicateSubmit}
              disabled={duplicateDialog.isLoading}
              className="bg-sky-800 hover:bg-sky-700"
            >
              {duplicateDialog.isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Duplicating...
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Ticket
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
