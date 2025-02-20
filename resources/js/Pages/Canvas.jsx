import React, { useState, useRef } from "react"; // Remove useEffect import
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import CanvasForm from "@/Components/CanvasForm";
import TicketTemplate from "@/Components/TicketTemplate";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export default function Canvas({ ticket = null }) {
  const { flash } = usePage().props;
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

  return (
    <AuthenticatedLayout>
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

        <div className="lg:w-2/3 p-4 lg:p-8 order-1 lg:order-2">
          <TicketTemplate
            ref={ticketRef}
            template={ticketInfo.template}
            ticketInfo={ticketInfo}
          />
        </div>
        <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-sky-200 p-4 lg:p-8 bg-white/80 backdrop-blur-sm shadow-lg order-2 lg:order-1">
          <h2 className="text-2xl font-bold text-sky-900 mb-6">
            Customize Your Ticket
          </h2>
          <CanvasForm
            ticketInfo={ticketInfo}
            setTicketInfo={setTicketInfo}
            ticketRef={ticketRef}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
