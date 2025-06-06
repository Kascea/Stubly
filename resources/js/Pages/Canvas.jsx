import React, { useState, useRef, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import TicketEditorSidebar from "@/Components/TicketEditorSidebar";
import TicketVisualizer from "@/Components/TicketVisualizer";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Button } from "@/Components/ui/button";
import {
  CheckCircle2,
  Loader2,
  TicketPlus,
  Eye,
  Edit,
  ShoppingCart,
} from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";
import { domToPng } from "modern-screenshot";
import axios from "axios";
import FreeTicketPromo from "@/Components/FreeTicketPromo";

export default function Canvas({ categories, ticket = null, auth, cartCount }) {
  const isAuthenticated = auth?.user;
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPromoDismissed, setIsPromoDismissed] = useState(false);
  const [isPromoDismissing, setIsPromoDismissing] = useState(false);

  // Use smaller breakpoint for mobile (640px instead of 768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1024);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(
    window.innerWidth >= 640,
  );
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Check for screen size on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      const smallScreen = window.innerWidth < 1024;

      setIsMobile(mobile);
      setIsSmallScreen(smallScreen);

      // On desktop, sidebar should always be expanded by default
      if (!mobile && !isSidebarExpanded) {
        setIsSidebarExpanded(true);
      }

      // Reset sidebar visibility when switching between mobile and desktop
      if (!mobile) {
        setIsSidebarVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarExpanded]);

  const [ticketInfo, setTicketInfo] = useState(
    ticket
      ? {
          ticketId: ticket.ticket_id,
          eventName: ticket.event_name,
          eventLocation: ticket.event_location,
          date: new Date(ticket.event_datetime),
          time: new Date(ticket.event_datetime),
          section: ticket.section,
          row: ticket.row,
          seat: ticket.seat,
          backgroundImage: ticket.background_image,
          background_url: ticket.background_url,
          filename: ticket.background_filename,
          template: ticket.template,
          template_id: ticket.template_id,
          isPaid: ticket.isPaid,
        }
      : {
          ticketId: null,
          eventName: "",
          eventLocation: "",
          date: null,
          time: null,
          section: "",
          row: "",
          seat: "",
          backgroundImage: null,
          background_url: null,
          filename: null,
          template: null,
          template_id: null,
          isPaid: false,
          dividerColor: "#0c4a6e",
        },
  );
  const ticketRef = useRef(null);

  // Handle sidebar expansion state
  const handleSidebarToggle = (isExpanded) => {
    setIsSidebarExpanded(isExpanded);
  };

  // Toggle sidebar visibility on mobile
  const toggleSidebarVisibility = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Handle promo dismissal with animation
  const handlePromoDismiss = () => {
    setIsPromoDismissing(true);
    setTimeout(() => {
      setIsPromoDismissed(true);
    }, 300); // Match the transition duration
  };

  const addTicketToCart = async () => {
    if (ticketRef.current) {
      setIsGenerating(true);
      setStatus(null);
      setErrorMessage("");
      try {
        const dataUrl = await domToPng(ticketRef.current, {
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

        // Get the selected category
        const selectedCategory = categories.find((c) =>
          c.templates.some((t) => t.id === ticketInfo.template),
        )?.id;

        // Base ticket data for all ticket types
        const ticketData = {
          eventName: ticketInfo.eventName,
          eventLocation: ticketInfo.eventLocation,
          date: ticketInfo.date,
          time: ticketInfo.time,
          section: ticketInfo.section,
          row: ticketInfo.row,
          seat: ticketInfo.seat,
          generatedTicket: dataUrl,
          template_id: ticketInfo.template_id,
        };

        // Add category-specific fields based on the selected category
        if (selectedCategory === "sports") {
          ticketData.team_home = ticketInfo.homeTeam;
          ticketData.team_away = ticketInfo.awayTeam;
          ticketData.dividerColor = ticketInfo.dividerColor;
        } else if (selectedCategory === "concerts") {
          ticketData.artist = ticketInfo.artist;
          ticketData.tour_name = ticketInfo.tourName;
        }

        // Add background image if available
        if (ticketInfo.backgroundImage) {
          ticketData.backgroundImage = ticketInfo.backgroundImage;
          ticketData.filename = ticketInfo.filename;
        }

        // Send the ticket data to the server to create a ticket
        const response = await axios.post(route("tickets.store"), ticketData);

        // Add the created ticket to cart
        await axios.post(route("cart.add"), {
          ticket_id: response.data.ticket.ticket_id,
        });

        setStatus("success");
        setSuccessMessage("Ticket added to cart successfully!");

        // Redirect to the cart page
        window.location.href = route("cart.index");
      } catch (error) {
        console.error("Error generating ticket:", error);
        setStatus("error");
        setErrorMessage(
          error.response?.data?.message ||
            "An error occurred while creating your ticket.",
        );
      } finally {
        setIsGenerating(false);
      }
    }
  };

  // Content to render inside the layout
  const content = (
    <>
      <Head title="Design Your Ticket" />

      <div className="flex flex-col sm:flex-row h-[calc(100vh-65px)] relative overflow-hidden">
        {/* Sidebar - On left for large screens, overlay for small screens */}
        <div
          className={`
            ${
              isSmallScreen
                ? "absolute inset-y-0 left-0 z-30"
                : "relative order-first"
            } 
            ${isMobile ? (isSidebarVisible ? "block" : "hidden") : ""}
            transition-all duration-300 ease-in-out
          `}
        >
          <TicketEditorSidebar
            ticketInfo={ticketInfo}
            setTicketInfo={setTicketInfo}
            categories={categories}
            onToggleExpand={handleSidebarToggle}
            isMobile={isMobile}
          />
        </div>

        {/* Ticket Visualizer Container - Full width */}
        <div className="flex-1 bg-gradient-to-br from-sky-50 to-orange-50 flex flex-col items-center justify-center relative">
          {/* Status Messages and Promo */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-20 space-y-3">
            {/* Free Ticket Promo for Guest Users */}
            {!isAuthenticated && !isPromoDismissed && (
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isPromoDismissing
                    ? "opacity-0 transform -translate-y-2 scale-95"
                    : "opacity-100 transform translate-y-0 scale-100"
                }`}
              >
                <FreeTicketPromo
                  showSignUpLink={true}
                  onDismiss={handlePromoDismiss}
                />
              </div>
            )}

            {/* Status Messages */}
            {status && (
              <>
                {status === "success" && (
                  <Alert className="bg-green-50 border-green-200 text-green-800 shadow-md">
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}

                {status === "error" && (
                  <Alert className="bg-red-50 border-red-200 text-red-800 shadow-md">
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>

          {/* Ticket Visualizer Wrapper - Responsive sizing */}
          <div className="p-4 sm:p-8 w-full h-full flex items-center justify-center">
            <TicketVisualizer
              ref={ticketRef}
              template={ticketInfo.template}
              ticketInfo={ticketInfo}
              containerWidth="100%"
              containerHeight="100%"
            />
          </div>
        </div>

        {/* Add to Cart Button - Fixed at bottom right */}
        <div className="fixed bottom-8 right-8 z-20">
          <Button
            onClick={addTicketToCart}
            disabled={isGenerating}
            className={`
              py-6 px-8 rounded-xl shadow-xl text-base sm:text-lg font-semibold flex items-center
              transform hover:scale-105 transition-all duration-300
              ${
                isGenerating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-sky-800 hover:bg-sky-700 text-white border-2 border-sky-600"
              }
            `}
            size="xl"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                <span className="text-lg">Creating...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="mr-3 h-6 w-6" />
                <span className="text-lg">Add to Cart</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );

  // Use the AppLayout for both authenticated and guest users
  return <AppLayout auth={auth}>{content}</AppLayout>;
}
