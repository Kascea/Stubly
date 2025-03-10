import React, { useState, useRef } from "react";
import { Head, usePage } from "@inertiajs/react";
import TicketEditorSidebar from "@/Components/TicketEditorSidebar";
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

  // Content to render inside the layout
  const content = (
    <>
      <Head title="Design Your Ticket" />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
        {flash?.success && (
          <div className="p-4 absolute top-4 right-4 z-50">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                {flash.success}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Sidebar - Collapsible */}
        <TicketEditorSidebar
          ticketInfo={ticketInfo}
          setTicketInfo={setTicketInfo}
          ticketRef={ticketRef}
          categories={categories}
          isAuthenticated={isAuthenticated}
        />

        {/* Ticket Visualizer - Takes remaining space */}
        <div className="flex-1 bg-gradient-to-br from-sky-50 to-orange-50 flex items-center justify-center overflow-auto">
          <div className="p-8 max-w-full">
            <TicketVisualizer
              ref={ticketRef}
              template={ticketInfo.template}
              ticketInfo={ticketInfo}
            />
          </div>
        </div>
      </div>
    </>
  );

  // Use the AppLayout for both authenticated and guest users
  return <AppLayout auth={auth}>{content}</AppLayout>;
}
