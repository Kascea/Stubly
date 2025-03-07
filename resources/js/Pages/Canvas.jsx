import React, { useState, useRef } from "react";
import { Head, usePage } from "@inertiajs/react";
import CanvasForm from "@/Components/CanvasForm";
import TicketVisualizer from "@/Components/TicketVisualizer";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";

export default function Canvas({ categories, ticket = null, auth }) {
  const { flash } = usePage().props;
  const isAuthenticated = auth?.user;

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
          template: "modern",
          isPaid: false,
        }
  );
  const ticketRef = useRef(null);

  // Content to render inside the layout
  const content = (
    <>
      <Head title="Design Your Ticket" />

      <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-sky-50 to-orange-50">
        {flash?.success && (
          <div className="p-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                {flash.success}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Ticket Visualizer - Fixed position with navbar offset */}
        <div className="lg:w-3/5 order-1 lg:order-2 lg:fixed lg:right-0 lg:top-16 lg:bottom-0 flex items-center justify-center">
          <div className="p-4 lg:p-8 max-w-full">
            <TicketVisualizer
              ref={ticketRef}
              template={ticketInfo.template}
              ticketInfo={ticketInfo}
            />
          </div>
        </div>

        {/* Form - Scrollable with margin to account for fixed visualizer */}
        <div className="lg:w-2/5 border-t lg:border-t-0 lg:border-l border-sky-200 p-4 lg:p-8 bg-white/80 backdrop-blur-sm shadow-lg order-2 lg:order-1 overflow-y-auto">
          <h2 className="text-2xl font-bold text-sky-900 mb-6">
            Customize Your Ticket
          </h2>
          <CanvasForm
            ticketInfo={ticketInfo}
            setTicketInfo={setTicketInfo}
            ticketRef={ticketRef}
            categories={categories}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </>
  );

  // Use the single AppLayout for both authenticated and guest users
  return <AppLayout auth={auth}>{content}</AppLayout>;
}
