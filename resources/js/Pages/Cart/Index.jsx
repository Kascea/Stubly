import { useEffect, useState, useRef } from "react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  X,
  Loader2,
  Copy,
  HelpCircle,
} from "lucide-react";
import { router } from "@inertiajs/react";
import axios from "axios";
import TicketCard from "@/Components/TicketCard";
import TicketVisualizer from "@/Components/TicketVisualizer";
import { domToWebp } from "modern-screenshot";

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
    ticketInfo: null,
  });
  const { flash = {} } = usePage().props;
  const hasItems = cart.items && cart.items.length > 0;

  // Ref for the offscreen ticket visualizer
  const offscreenTicketRef = useRef(null);

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
      ticketInfo: null,
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
      ticketInfo: null,
    });
  };

  // Helper function to prepare ticket info for the visualizer
  const prepareTicketInfoForVisualizer = (
    originalTicket,
    newSeating,
    assets = {}
  ) => {
    console.log(originalTicket);
    const ticketInfo = {
      ticketId: null, // This will be set after creation
      eventName: originalTicket.event_name,
      eventLocation: originalTicket.event_location,
      date: new Date(originalTicket.event_datetime),
      time: new Date(originalTicket.event_datetime),
      section: newSeating.section || originalTicket.section,
      row: newSeating.row || originalTicket.row,
      seat: newSeating.seat || originalTicket.seat,
      template: originalTicket.template_id,
      template_id: originalTicket.template_id,
      accentColor: originalTicket.accent_color || "#000000",
    };

    // Add category-specific data based on ticketable data
    if (originalTicket.ticketable) {
      // Check if it's a sports ticket (has team_home and team_away)
      if (
        originalTicket.ticketable.team_home &&
        originalTicket.ticketable.team_away
      ) {
        ticketInfo.homeTeam = originalTicket.ticketable.team_home;
        ticketInfo.awayTeam = originalTicket.ticketable.team_away;

        // Use the asset URLs from the API
        if (assets.home_team_logo_url) {
          ticketInfo.homeTeamLogo = assets.home_team_logo_url;
        }
        if (assets.away_team_logo_url) {
          ticketInfo.awayTeamLogo = assets.away_team_logo_url;
        }
      }

      // Check if it's a concert ticket (has artist_name)
      if (originalTicket.ticketable.artist_name) {
        ticketInfo.artistName = originalTicket.ticketable.artist_name;
        ticketInfo.tourName = originalTicket.ticketable.tour_name;
      }
    }

    // Add background image if available
    if (assets.background_image_url) {
      ticketInfo.backgroundImage = assets.background_image_url;
    }

    return ticketInfo;
  };

  const handleDuplicateSubmit = async () => {
    if (!duplicateDialog.ticket || !offscreenTicketRef.current) return;

    setDuplicateDialog((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Capture the screenshot
      const dataUrl = await domToWebp(offscreenTicketRef.current, {
        quality: 4.0,
        scale: 4,
        backgroundColor: null,
        skipFonts: false,
        filter: (node) => {
          if (node.nodeType === 3 || node.nodeType === 1) {
            return true;
          }
          return false;
        },
      });

      // Convert base64 data URL to binary blob
      const response = await fetch(dataUrl);
      const ticketBlob = await response.blob();

      // Create FormData for upload
      const formData = new FormData();
      formData.append("original_ticket_id", duplicateDialog.ticket.ticket_id);
      formData.append("section", duplicateDialog.section);
      formData.append("row", duplicateDialog.row);
      formData.append("seat", duplicateDialog.seat);
      formData.append("generatedTicket", ticketBlob, "ticket.webp");

      // Send the duplicate request with the screenshot
      const duplicateResponse = await axios.post(
        route("tickets.duplicate.create"),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Add the new ticket to cart
      await axios.post(route("cart.add"), {
        ticket_id: duplicateResponse.data.ticket.ticket_id,
      });

      setCart((prevCart) => ({
        ...prevCart,
        items: [...prevCart.items, duplicateResponse.data.ticket],
        count: prevCart.count + 1,
      }));

      router.reload({ only: ["cart"] });
      closeDuplicateDialog();
    } catch (error) {
      console.error("Error duplicating ticket:", error);

      let errorMessage =
        "Unable to duplicate ticket. Please try again. If this persists, contact support at cole@stubly.shop";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openDuplicateDialog(ticket)}
                                    className="border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                  >
                                    <Copy className="h-4 w-4 mr-1" />
                                    Duplicate
                                    <HelpCircle className="h-3 w-3 ml-1 text-gray-400" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p className="text-sm">
                                    Create a copy of this ticket with different
                                    section, row, or seat numbers. All other
                                    details remain the same.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
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
                <div className="sticky top-20">
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
                      <a href={route("cart.checkout")} className="w-full">
                        <Button
                          size="lg"
                          className="w-full bg-sky-800 hover:bg-sky-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          Checkout <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </a>

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
              Create a copy with different seating information.
            </DialogDescription>
          </DialogHeader>

          {duplicateDialog.ticket && (
            <div className="space-y-4">
              {/* Visual explanation of what gets duplicated */}
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <Copy className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="text-sm">
                    <p className="text-blue-700 text-xs">
                      All ticket details stay the same except for the seating
                      information below.
                    </p>
                  </div>
                </div>
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

              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
                <strong>Note:</strong> The new ticket will be added to your cart
                as a separate item with the same $2.99 price.
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

      {/* Offscreen TicketVisualizer for duplicate screenshot generation */}
      {duplicateDialog.ticket && (
        <div
          className="fixed -top-[9999px] -left-[9999px] opacity-0 pointer-events-none"
          style={{ position: "absolute", zIndex: -1 }}
        >
          <div className="w-96">
            <TicketVisualizer
              ref={offscreenTicketRef}
              template={duplicateDialog.ticket.template_id}
              ticketInfo={prepareTicketInfoForVisualizer(
                duplicateDialog.ticket,
                {
                  section: duplicateDialog.section,
                  row: duplicateDialog.row,
                  seat: duplicateDialog.seat,
                },
                {
                  background_image_url:
                    duplicateDialog.ticket.background_image_url,
                  home_team_logo_url: duplicateDialog.ticket.home_team_logo_url,
                  away_team_logo_url: duplicateDialog.ticket.away_team_logo_url,
                }
              )}
            />
          </div>
        </div>
      )}
    </AppLayout>
  );
}
