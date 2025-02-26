import React, { forwardRef } from "react";
import { format } from "date-fns";

// Helper function to generate a barcode pattern
const generateBarcodePattern = () => {
  const bars = [];
  for (let i = 0; i < 30; i++) {
    const width = Math.random() > 0.7 ? 3 : 1;
    bars.push(
      `<rect x="${i * 3}" y="0" width="${width}" height="30" fill="black" />`
    );
  }
  return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="30" viewBox="0 0 100 30">${bars.join(
    ""
  )}</svg>`;
};

const ConcertsHorizontalTemplate = forwardRef(({ ticketInfo }, ref) => {
  // Generate a random ticket number
  const ticketNumber = Math.random().toString(36).substr(2, 8).toUpperCase();

  return (
    <div
      ref={ref}
      className="relative w-full max-w-2xl mx-auto aspect-[16/9] rounded-xl overflow-hidden shadow-xl"
    >
      {/* Main container with flex layout */}
      <div className="flex h-full">
        {/* Left side - Event info with background image */}
        <div className="w-2/3 relative">
          {/* Background image or gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-purple-800 to-pink-600"
            style={{
              backgroundImage: ticketInfo.backgroundImage
                ? `url(${ticketInfo.backgroundImage})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 h-full flex flex-col text-white">
            {/* Artist/Event Name */}
            <div className="mb-2">
              <h1 className="text-4xl font-bold tracking-tight">
                {ticketInfo.eventName || "Concert Event"}
              </h1>
              <div className="text-xl mt-1 opacity-90">
                {ticketInfo.eventLocation || "Event Location"}
              </div>
            </div>

            {/* Tour name / subtitle */}
            <div className="mt-auto">
              <div className="text-2xl font-semibold">
                {ticketInfo.tourName || "World Tour"}
              </div>
              <div className="text-lg mt-1">
                {ticketInfo.date
                  ? format(new Date(ticketInfo.date), "MMMM d, yyyy")
                  : "August 8, 2025"}
                {" • "}
                {ticketInfo.time
                  ? format(new Date(ticketInfo.time), "h:mm a")
                  : "7:00 PM"}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - White section with ticket details and barcode */}
        <div className="w-1/3 bg-white p-5 flex flex-col">
          {/* Venue info */}
          <div className="text-center mb-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Venue
            </div>
            <div className="text-sm font-medium">
              {ticketInfo.eventLocation || "Croke Park Stadium"}
            </div>
            <div className="text-xs text-gray-500">
              {ticketInfo.venueLocation || "Dublin, Ireland"}
            </div>
          </div>

          {/* Date and time */}
          <div className="text-center mb-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Date & Time
            </div>
            <div className="text-sm font-medium">
              {ticketInfo.date
                ? format(new Date(ticketInfo.date), "d MMMM yyyy")
                : "08 August 2025"}
            </div>
            <div className="text-xs text-gray-500">
              {ticketInfo.time
                ? format(new Date(ticketInfo.time), "h:mm a")
                : "Doors 7PM"}
            </div>
          </div>

          {/* Seating details */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                Gate
              </div>
              <div className="text-lg font-bold">{ticketInfo.gate || "01"}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                Row
              </div>
              <div className="text-lg font-bold">{ticketInfo.row || "02"}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                Seat
              </div>
              <div className="text-lg font-bold">{ticketInfo.seat || "03"}</div>
            </div>
          </div>

          {/* Barcode */}
          <div className="mt-auto">
            <div className="flex flex-col items-center">
              <img
                src={generateBarcodePattern()}
                alt="Barcode"
                className="w-full h-12 object-contain mb-1"
              />
              <div className="text-xs text-gray-500">{ticketNumber}</div>

              {/* Custom message */}
              <div className="mt-2 text-xs text-center text-gray-500">
                {ticketInfo.message || "MERRY CHRISTMAS EMMA!"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ConcertsHorizontalTemplate.displayName = "ConcertsHorizontalTemplate";

export default ConcertsHorizontalTemplate;
