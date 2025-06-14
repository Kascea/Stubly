import React, { useState, useRef, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
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

export default function Canvas({ categories, ticket = null, auth }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  const addTicketToCart = async () => {
    if (ticketRef.current) {
      setIsGenerating(true);
      setStatus(null);
      setErrorMessage("");

      // Capture the screenshot
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

        // Add the screenshot to ticketInfo
        const updatedTicketInfo = {
          ...ticketInfo,
          generatedTicket: dataUrl,
        };

        // Add category-specific fields
        if (selectedCategory === "sports") {
          updatedTicketInfo.team_home = ticketInfo.homeTeam;
          updatedTicketInfo.team_away = ticketInfo.awayTeam;
        } else if (selectedCategory === "concerts") {
          updatedTicketInfo.artist_name = ticketInfo.artistName;
          updatedTicketInfo.tour_name = ticketInfo.tourName;
        }

        // Send directly
        const response = await axios.post(
          route("tickets.store"),
          updatedTicketInfo,
        );

        // Add the created ticket to cart
        await axios.post(route("cart.add"), {
          ticket_id: response.data.ticket.ticket_id,
        });

        setStatus("success");
        setSuccessMessage("Ticket added to cart successfully!");

        // Redirect to the cart page using Inertia navigation
        router.visit(route("cart.index"));
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

      <div className="flex h-[calc(100vh-65px)] relative overflow-hidden">
        {/* Sidebar */}
        <div className="relative">
          <TicketEditorSidebar
            ticketInfo={ticketInfo}
            setTicketInfo={setTicketInfo}
            categories={categories}
          />
        </div>

        {/* Ticket Visualizer Container */}
        <div className="flex-1 bg-gradient-to-br from-sky-50 to-orange-50 flex flex-col items-center justify-center relative">
          {/* Status Messages */}
          {status && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-20">
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
            </div>
          )}

          {/* Ticket Visualizer Wrapper */}
          <div className="p-8 w-full max-w-md mx-auto">
            <div className="transform scale-100 transition-transform duration-300">
              <TicketVisualizer
                ref={ticketRef}
                template={ticketInfo.template}
                ticketInfo={ticketInfo}
              />
            </div>
          </div>
        </div>

        {/* Add to Cart Button - Fixed at bottom right */}
        <div className="fixed bottom-8 right-8 z-20">
          <Button
            onClick={addTicketToCart}
            disabled={isGenerating}
            className={`
              py-6 px-8 rounded-xl shadow-xl text-lg font-semibold flex items-center
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
