import React from "react";
import { Head } from "@inertiajs/react";
import TicketVisualizer from "@/Components/TicketVisualizer";

export default function TicketScreenshot({ ticket }) {
  return (
    <>
      <Head title={`Ticket - ${ticket.eventName}`} />

      {/* Clean layout for screenshot capture - following Canvas component pattern */}
      <div className="w-screen h-screen bg-transparent flex items-center justify-center overflow-hidden">
        {/* Container that matches Canvas layout but optimized for screenshots */}
        <div className="w-full max-w-md mx-auto flex items-center justify-center">
          <div id="ticket-element" className="transform scale-100">
            <TicketVisualizer template={ticket.template} ticketInfo={ticket} />
          </div>
        </div>
      </div>
    </>
  );
}
