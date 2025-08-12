"use client";

import React, { forwardRef } from "react";
import { generateBarcodePattern } from "@/utils/barcode";

const ConcertsClassicTemplate = forwardRef(({ ticketInfo }, ref) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div
        ref={ref}
        className="w-80 bg-white shadow-lg shadow-gray-900/25 flex flex-col"
        style={{ aspectRatio: "3/7", maxHeight: "40rem" }}
      >
        {/* Ticket header */}
        <div
          className="py-6 px-4"
          style={{
            backgroundColor: ticketInfo?.accentColor || "#d22b2b",
          }}
        >
          <h1 className="text-2xl font-black tracking-widest text-center text-white uppercase font-sans leading-tight">
            {ticketInfo?.artistName || "ARTIST NAME"}
          </h1>
        </div>

        {/* Tour name */}
        <div
          className="px-4 py-3 border-b-2"
          style={{
            backgroundColor: ticketInfo?.accentColor || "#d22b2b",
            borderColor: `rgba(255, 255, 255, 0.3)`,
          }}
        >
          <h2 className="text-base font-semibold text-center text-white uppercase font-sans tracking-wider opacity-90">
            {ticketInfo?.tourName || "WORLD TOUR"}
          </h2>
        </div>

        {/* Ticket body - Make this flex-grow to fill available space */}
        <div className="flex-grow p-6 space-y-6 border-b border-black flex flex-col justify-center">
          {/* Event details */}
          <div className="text-center space-y-3">
            <p className="text-xl font-bold font-mono">
              {ticketInfo?.date
                ? new Date(ticketInfo.date)
                    .toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                    .toUpperCase()
                : "DATE"}
            </p>
            <p className="text-lg font-mono">
              {ticketInfo?.time
                ? new Date(`${ticketInfo.time}`)
                    .toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                    .toUpperCase()
                : "TIME"}
            </p>
            <div className="my-4 border-t border-b border-dashed border-gray-700 py-4">
              <p className="text-lg font-bold font-mono uppercase">
                {ticketInfo?.eventLocation || "VENUE NAME"}
              </p>
              <p className="text-sm font-mono">
                {ticketInfo?.eventLocation || "VENUE LOCATION"}
              </p>
            </div>
          </div>

          {/* Seat information */}
          <div className="grid grid-cols-3 gap-0 text-center border-2 border-black">
            <div className="p-4 border-r-2 border-black">
              <p className="text-sm text-gray-700 font-mono">SECTION</p>
              <p className="text-xl font-bold font-mono">
                {ticketInfo?.section || "N/A"}
              </p>
            </div>
            <div className="p-4 border-r-2 border-black">
              <p className="text-sm text-gray-700 font-mono">ROW</p>
              <p className="text-xl font-bold font-mono">
                {ticketInfo?.row || "N/A"}
              </p>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-700 font-mono">SEAT</p>
              <p className="text-xl font-bold font-mono">
                {ticketInfo?.seat || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Barcode section */}
        <div className="p-4 bg-white">
          <img
            src={generateBarcodePattern()}
            alt="Barcode"
            className="w-full h-12"
          />
          <p className="text-xs font-mono text-center mt-2">
            {Math.random().toString(36).substr(2, 12).toUpperCase()}
          </p>
        </div>

        {/* Footer */}
        <div
          className="text-center text-sm font-mono p-4 text-white"
          style={{
            backgroundColor: ticketInfo?.accentColor || "#d22b2b",
          }}
        >
          <p>ADMIT ONE</p>
        </div>
      </div>
    </div>
  );
});

ConcertsClassicTemplate.displayName = "ConcertsClassicTemplate";

export default ConcertsClassicTemplate;
