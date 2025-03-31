import React, { forwardRef } from "react";
import { format } from "date-fns";
import { generateBarcodePattern } from "@/utils/barcode";

const ConcertsHorizontalTemplate = forwardRef(({ ticketInfo }, ref) => {
  const ticketNumber = Math.random().toString(36).substr(2, 8).toUpperCase();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        ref={ref}
        className="relative w-full overflow-hidden shadow-xl bg-white"
        style={{
          maxWidth: "40rem",
          aspectRatio: "7/3",
        }}
      >
        <div className="flex h-full">
          <div className="w-[75%] relative">
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
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
            </div>

            <div className="relative z-10 p-6 h-full flex flex-col text-white">
              <div className="mb-3">
                <div className="bg-white/10 backdrop-blur-sm py-1 px-6 rounded inline-block">
                  <p className="font-bold tracking-widest text-sm">ADMIT ONE</p>
                </div>
              </div>

              <div className="mb-2">
                <h1 className="text-5xl font-bold tracking-tight drop-shadow-md">
                  {ticketInfo.eventName || "Concert Event"}
                </h1>
                <div className="text-xl mt-1 opacity-90">
                  {ticketInfo.eventLocation || "Event Location"}
                </div>
              </div>

              <div className="mt-auto">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-300 uppercase">
                        {ticketInfo.tourName || "World Tour"}
                      </p>
                      <p className="font-medium">
                        {ticketInfo.date
                          ? format(new Date(ticketInfo.date), "MMMM d, yyyy")
                          : "August 8, 2025"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-300 uppercase">Time</p>
                      <p className="font-medium">
                        {ticketInfo.time
                          ? format(new Date(ticketInfo.time), "h:mm a")
                          : "7:00 PM"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="h-full w-3"
              style={{
                backgroundColor: ticketInfo?.dividerColor || "#a855f7",
              }}
            />
            <div className="absolute top-0 bottom-0 -left-1.5 flex flex-col">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 border-t border-dashed border-gray-400"
                  style={{ height: "2.5%" }}
                />
              ))}
            </div>
          </div>

          <div className="w-[25%] bg-white p-4 text-gray-800 flex flex-col justify-between">
            <div className="text-center mb-2">
              <p className="text-sm text-gray-600 uppercase tracking-wider font-medium">
                {ticketInfo?.eventName || "Event Name"}
              </p>
              <p className="text-xs text-gray-500">
                {ticketInfo.date
                  ? format(new Date(ticketInfo.date), "EEE, MMM d, yyyy")
                  : "TBD"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 mb-4 text-center">
              <div>
                <p className="text-xs text-gray-500 uppercase">
                  {ticketInfo.gate ? "Gate" : "Section"}
                </p>
                <p className="text-3xl font-bold">
                  {ticketInfo.gate || ticketInfo.section || "TBD"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Row</p>
                <p className="text-3xl font-bold">{ticketInfo.row || "TBD"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Seat</p>
                <p className="text-3xl font-bold">{ticketInfo.seat || "TBD"}</p>
              </div>
            </div>

            <div className="mt-auto flex flex-col items-center">
              <div className="border-t border-dashed border-gray-300 w-full mb-2 pt-2">
                <p className="text-xs text-center text-gray-500 mb-1">
                  VOID IF DETACHED
                </p>
              </div>
              <img
                src={generateBarcodePattern()}
                alt="Barcode"
                className="w-full h-12 object-contain mb-1"
              />
              <div className="text-xs text-gray-500">{ticketNumber}</div>

              {ticketInfo.message && (
                <div className="mt-2 text-xs text-center text-gray-500">
                  {ticketInfo.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ConcertsHorizontalTemplate.displayName = "ConcertsHorizontalTemplate";

export default ConcertsHorizontalTemplate;
