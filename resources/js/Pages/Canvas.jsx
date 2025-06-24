import React, { useState, useRef, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import TicketEditorSidebar from "@/Components/TicketEditorSidebar";
import TicketVisualizer from "@/Components/TicketVisualizer";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Button } from "@/Components/ui/button";
import {
  CheckCircle2,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";
import { domToPng } from "modern-screenshot";
import axios from "axios";

export default function Canvas({ categories, auth }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState({
    type: null, // 'success' or 'error'
    message: "",
  });

  const [ticketInfo, setTicketInfo] = useState({
    ticketId: null,
    eventName: "",
    eventLocation: "",
    date: null,
    time: null,
    section: "",
    row: "",
    seat: "",
    backgroundImage: null,
    filename: null,
    template: null,
    template_id: null,
    accentColor: "#0c4a6e",
    homeTeamLogo: null,
    awayTeamLogo: null,
  });
  const ticketRef = useRef(null);

  const addTicketToCart = async () => {
    if (ticketRef.current) {
      setIsGenerating(true);
      setNotification({ type: null, message: "" });

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

        // Convert base64 data URL to binary blob
        const response = await fetch(dataUrl);
        const ticketBlob = await response.blob();

        // Get the selected category
        const selectedCategory = categories.find((c) =>
          c.templates.some((t) => t.id === ticketInfo.template),
        )?.id;

        // Create FormData for binary upload
        const formData = new FormData();
        
        // Add the ticket image as binary
        formData.append('generatedTicket', ticketBlob, 'ticket.png');
        
        // Add all other ticket data
        formData.append('eventName', ticketInfo.eventName || '');
        formData.append('eventLocation', ticketInfo.eventLocation || '');
        formData.append('date', ticketInfo.date ? ticketInfo.date.toISOString().split('T')[0] : '');
        formData.append('time', ticketInfo.time ? ticketInfo.time.toTimeString().split(' ')[0] : '');
        formData.append('section', ticketInfo.section || '');
        formData.append('row', ticketInfo.row || '');
        formData.append('seat', ticketInfo.seat || '');
        formData.append('template', ticketInfo.template || '');
        formData.append('template_id', ticketInfo.template_id || '');

        // Add background image as binary if exists
        if (ticketInfo.backgroundImage) {
          const bgResponse = await fetch(ticketInfo.backgroundImage);
          const bgBlob = await bgResponse.blob();
          formData.append('backgroundImage', bgBlob, 'background.png');
        }

        // Add category-specific fields and logos
        if (selectedCategory === "sports") {
          formData.append('team_home', ticketInfo.homeTeam || '');
          formData.append('team_away', ticketInfo.awayTeam || '');
          
          // Add team logos as binary if they exist
          if (ticketInfo.homeTeamLogo) {
            const homeLogoResponse = await fetch(ticketInfo.homeTeamLogo);
            const homeLogoBlob = await homeLogoResponse.blob();
            formData.append('homeTeamLogo', homeLogoBlob, 'home-logo.png');
          }
          
          if (ticketInfo.awayTeamLogo) {
            const awayLogoResponse = await fetch(ticketInfo.awayTeamLogo);
            const awayLogoBlob = await awayLogoResponse.blob();
            formData.append('awayTeamLogo', awayLogoBlob, 'away-logo.png');
          }
        } else if (selectedCategory === "concerts") {
          formData.append('artist_name', ticketInfo.artistName || '');
          formData.append('tour_name', ticketInfo.tourName || '');
        }

        // Send FormData with binary data
        const ticketResponse = await axios.post(
          route("tickets.store"),
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        // Add the created ticket to cart
        await axios.post(route("cart.add"), {
          ticket_id: ticketResponse.data.ticket.ticket_id,
        });

        setNotification({
          type: "success",
          message: "Ticket added to cart successfully!",
        });

        // Redirect to the cart page using Inertia navigation
        router.visit(route("cart.index"));
      } catch (error) {
        console.error("Error generating ticket:", error);
        setNotification({
          type: "error",
          message: error.response?.data?.message ||
            "An error occurred while creating your ticket.",
        });
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
          {notification.type && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-20">
              {notification.type === "success" && (
                <Alert className="bg-green-50 border-green-200 text-green-800 shadow-md">
                  <AlertDescription>{notification.message}</AlertDescription>
                </Alert>
              )}

              {notification.type === "error" && (
                <Alert className="bg-red-50 border-red-200 text-red-800 shadow-md">
                  <AlertDescription>{notification.message}</AlertDescription>
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
