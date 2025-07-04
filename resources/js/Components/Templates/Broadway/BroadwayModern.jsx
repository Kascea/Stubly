import React, { forwardRef } from "react";
import { generateBarcodePattern } from "@/utils/barcode";

const BroadwayModernTemplate = forwardRef(({ ticketInfo }, ref) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div
        ref={ref}
        className="relative w-80 overflow-hidden bg-white shadow-lg shadow-sky-900/25"
        style={{ aspectRatio: "3/7", maxHeight: "40rem" }}
      >
        {/* Background Image */}
        {ticketInfo?.backgroundImage ? (
          <img
            src={ticketInfo.backgroundImage}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sky-300 to-orange-300" />
        )}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content Container */}
        <div className="relative text-white h-full flex flex-col">
          {/* Admit One Banner - Updated to be smaller and rounded */}
          <div className="flex justify-center mt-2">
            <div className="bg-white/10 backdrop-blur-sm py-1 px-6 rounded inline-block">
              <p className="font-bold tracking-widest text-sm">ADMIT ONE</p>
            </div>
          </div>

          {/* Main Content - Adjusted to take 60% of height */}
          <div
            className="flex-grow p-6 flex flex-col justify-end"
            style={{ height: "60%" }}
          >
            {/* Play and Theater Names - Moved lower */}
            <div className="text-center mb-4 mt-auto">
              <h1 className="text-4xl font-bold mb-4 leading-tight drop-shadow-md">
                {ticketInfo?.playName || "Play Name"}
              </h1>

              {/* Theater Name */}
              <div className="flex items-center justify-center mt-4">
                <div className="flex flex-col items-center">
                  <div className="text-xl font-bold drop-shadow-md mb-2">
                    {ticketInfo?.theaterName || "Theater Name"}
                  </div>
                </div>
              </div>
            </div>

            {/* Updated Event Information */}
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded">
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-300">DATE</p>
                    <p className="font-medium">
                      {ticketInfo?.date
                        ? new Date(ticketInfo.date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-300">TIME</p>
                    <p className="font-medium">
                      {ticketInfo?.time
                        ? new Date(`${ticketInfo.time}`).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tear-off Section with Colored Divider and Location - Now 40% of height */}
          <div className="relative" style={{ height: "40%" }}>
            {/* Colored Divider Line with Location */}
            <div
              className="py-3 w-full flex items-center justify-center"
              style={{
                backgroundColor: ticketInfo?.accentColor || "#000000",
              }}
            >
              <p className="text-white font-medium tracking-wide text-center px-4">
                {ticketInfo?.eventLocation || "Event Location"}
                {ticketInfo?.eventLocation ? " • " : ""}
                {ticketInfo?.date
                  ? new Date(ticketInfo.date).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </p>
            </div>

            {/* Perforation Line */}
            <div className="absolute -top-3 left-0 right-0 flex">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 border-l border-dashed border-gray-400"
                  style={{ width: "2.5%" }}
                />
              ))}
            </div>

            {/* Stub Content - Now with white background and larger section/row/seat */}
            <div className="bg-white p-4 text-gray-800 h-full flex flex-col">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-500 uppercase">Section</p>
                  <p className="text-3xl font-bold">
                    {ticketInfo?.section || "N/A"}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-500 uppercase">Row</p>
                  <p className="text-3xl font-bold">
                    {ticketInfo?.row || "N/A"}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-500 uppercase">Seat</p>
                  <p className="text-3xl font-bold">
                    {ticketInfo?.seat || "N/A"}
                  </p>
                </div>
              </div>

              {/* Additional broadway details */}
              <div className="text-xs text-center mb-3 text-gray-600 uppercase tracking-wider flex-shrink-0">
                <p>{ticketInfo?.playName || "N/A"}</p>
                <p>
                  {ticketInfo?.date
                    ? new Date(ticketInfo.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
                <p>
                  Curtain Time:{" "}
                  {ticketInfo?.time
                    ? new Date(`${ticketInfo.time}`).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )
                    : "N/A"}
                </p>
              </div>

              <div className="flex flex-col items-center mt-auto min-h-0">
                <div className="border-t border-dashed border-gray-300 w-full mb-2 pt-2 flex-shrink-0">
                  <p className="text-xs text-center text-gray-500 mb-1">
                    VOID IF DETACHED
                  </p>
                </div>
                <img
                  src={generateBarcodePattern()}
                  alt="Barcode"
                  className="w-full max-w-full h-auto flex-shrink-0"
                />
                <p className="text-xs mt-1 text-gray-600 flex-shrink-0">
                  {Math.random().toString(36).substr(2, 12).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

BroadwayModernTemplate.displayName = "BroadwayModernTemplate";

export default BroadwayModernTemplate;
