import React from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Loader2, ChevronRight } from "lucide-react";

export default function TicketCard({
  ticket,
  onClick,
  actions,
  price,
  showViewIndicator = false,
  className = "",
}) {
  // Function to format event date
  const formatEventDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const cardClasses = `
    border border-gray-100 transition-all duration-300 bg-gradient-to-br from-gray-50/50 to-white
    ${
      onClick
        ? "hover:border-orange-300 hover:shadow-md group cursor-pointer"
        : ""
    }
    ${className}
  `;

  const content = (
    <CardContent className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Ticket Image */}
        <div className="flex-shrink-0">
          <div
            className={`w-full lg:w-32 h-48 lg:h-20 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg overflow-hidden ${
              onClick
                ? "group-hover:scale-105 transition-transform duration-300"
                : ""
            }`}
          >
            {ticket.generated_ticket_url ? (
              <img
                src={ticket.generated_ticket_url}
                alt={`Ticket for ${ticket.event_name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML =
                    '<div class="w-full h-full flex items-center justify-center"><svg class="h-8 w-8 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a1 1 0 001 1h1m0 0v4a2 2 0 002 2h2M7 9h10a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg></div>';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-sky-700" />
              </div>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="flex-1 space-y-3">
          <div>
            <h3
              className={`text-lg font-semibold text-gray-900 mb-1 ${
                onClick ? "group-hover:text-sky-900 transition-colors" : ""
              }`}
            >
              {ticket.event_name}
            </h3>
            {ticket.event_location && (
              <div className="flex items-center text-gray-600 mb-2">
                <span className="text-sm">{ticket.event_location}</span>
              </div>
            )}
            {ticket.event_datetime && (
              <div className="flex items-center text-gray-600 mb-3">
                <span className="text-sm">
                  {formatEventDate(ticket.event_datetime)}
                </span>
              </div>
            )}
          </div>

          {/* Seating Information */}
          {(ticket.section || ticket.row || ticket.seat) && (
            <div className="flex flex-wrap gap-2">
              {ticket.section && (
                <span className="px-3 py-1 bg-sky-50 text-sky-700 text-xs font-medium rounded-full border border-sky-200">
                  Section {ticket.section}
                </span>
              )}
              {ticket.row && (
                <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-medium rounded-full border border-sky-300">
                  Row {ticket.row}
                </span>
              )}
              {ticket.seat && (
                <span className="px-3 py-1 bg-sky-200 text-sky-900 text-xs font-medium rounded-full border border-sky-400">
                  Seat {ticket.seat}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex flex-col justify-between items-end">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${typeof price === "number" ? price.toFixed(2) : price}
            </div>
            <div className="text-xs text-gray-500">per ticket</div>
          </div>

          {/* Actions or View Indicator */}
          <div className="mt-4">
            {actions ? (
              actions
            ) : showViewIndicator ? (
              <div className="flex items-center text-sky-600 group-hover:text-sky-800">
                <span className="text-sm font-medium mr-2 hidden sm:inline">
                  View Ticket
                </span>
                <ChevronRight className="h-5 w-5 transform transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </CardContent>
  );

  return (
    <Card className={cardClasses} onClick={onClick}>
      {content}
    </Card>
  );
}
