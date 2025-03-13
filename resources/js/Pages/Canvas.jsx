import React, { useState, useRef, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import TicketEditorSidebar from "@/Components/TicketEditorSidebar";
import TicketVisualizer from "@/Components/TicketVisualizer";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Button } from "@/Components/ui/button";
import { CheckCircle2, Loader2, TicketPlus, Eye, Edit } from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";
import { domToPng } from "modern-screenshot";
import axios from "axios";

export default function Canvas({ categories, ticket = null, auth }) {
  const { flash } = usePage().props;
  const isAuthenticated = auth?.user;
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Use smaller breakpoint for mobile (640px instead of 768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1024);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(
    window.innerWidth >= 640
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
        }
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

  const generateTicket = async () => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      window.location.href = route("login");
      return;
    }

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
          c.templates.some((t) => t.id === ticketInfo.template)
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

        // Send the ticket data to the server
        const response = await axios.post(route("tickets.store"), ticketData);

        setStatus("success");
        setSuccessMessage("Ticket created successfully!");

        // Redirect to the tickets page
        window.location.href = route("tickets.index");
      } catch (error) {
        console.error("Error generating ticket:", error);
        setStatus("error");
        setErrorMessage(
          error.response?.data?.message ||
            "An error occurred while creating your ticket."
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

      <div className="flex flex-col sm:flex-row h-[calc(100vh-64px)] relative">
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
        <div className="flex-1 bg-gradient-to-br from-sky-50 to-orange-50 flex items-center justify-center overflow-auto">
          {/* Ticket Visualizer Wrapper - Fixed size with scrolling */}
          <div className="p-4 sm:p-8 w-full max-w-md mx-auto">
            <div className="transform scale-100 transition-transform duration-300">
              <TicketVisualizer
                ref={ticketRef}
                template={ticketInfo.template}
                ticketInfo={ticketInfo}
              />
            </div>
          </div>
        </div>

        {/* Mobile Toggle Button - Show/Hide Sidebar */}
        {isMobile && (
          <button
            onClick={toggleSidebarVisibility}
            className="fixed bottom-20 right-6 z-40 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
          >
            {isSidebarVisible ? (
              <Eye className="h-6 w-6" />
            ) : (
              <Edit className="h-6 w-6" />
            )}
          </button>
        )}

        {/* Create Ticket Button - Fixed at bottom right */}
        <div className="fixed bottom-6 right-6 z-10">
          <Button
            onClick={generateTicket}
            disabled={isGenerating}
            className="bg-sky-900 hover:bg-sky-800 text-white py-4 px-6 rounded-lg shadow-lg text-sm sm:text-base flex items-center"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <TicketPlus className="mr-2 h-5 w-5" />
                {isAuthenticated ? "Create Ticket" : "Sign In to Create"}
              </>
            )}
          </Button>

          {/* Status Messages */}
          {status === "success" && (
            <Alert className="mt-2 bg-green-50 border-green-200 text-green-800">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert className="mt-2 bg-red-50 border-red-200 text-red-800">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </>
  );

  // Use the AppLayout for both authenticated and guest users
  return <AppLayout auth={auth}>{content}</AppLayout>;
}
