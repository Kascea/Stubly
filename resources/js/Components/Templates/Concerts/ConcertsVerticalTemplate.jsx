import React, { forwardRef } from "react";
import { format } from "date-fns";
import { generateBarcodePattern } from "@/utils/barcode";

const ConcertsVerticalTemplate = forwardRef(({ ticketInfo }, ref) => {
  // Generate ticket number
  const ticketNumber = Math.random().toString(36).substr(2, 8).toUpperCase();

  // Define color themes - Use ticketInfo.dividerColor as the primary, or fall back to preset themes
  const primaryColor = ticketInfo?.dividerColor || "#ec4899"; // Default pink
  const secondaryColor = ticketInfo?.secondaryColor || "#facc15"; // Yellow accent

  // Optional pattern opacity - can be customized
  const patternOpacity = ticketInfo?.patternOpacity || 0.08;

  // Determine text color based on background brightness (simplified)
  const textColor = ticketInfo?.textColor || "white";

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div
        ref={ref}
        className="relative w-64 overflow-hidden bg-white shadow-lg shadow-purple-900/30"
        style={{
          aspectRatio: "2 / 5.5",
        }}
      >
        {/* Background with multiple design elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Base gradient or image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: ticketInfo.backgroundImage
                ? `url(${ticketInfo.backgroundImage})`
                : `linear-gradient(145deg, ${primaryColor}, #6d28d9)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Decorative background pattern - sound waves */}
          <div className="absolute inset-0">
            <svg
              width="100%"
              height="100%"
              className="opacity-10"
              style={{ opacity: patternOpacity }}
            >
              <defs>
                <pattern
                  id="soundWavePattern"
                  x="0"
                  y="0"
                  width="100"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  {/* Sound wave pattern */}
                  <path
                    d="M0,10 Q5,5 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T80,10 T90,10 T100,10"
                    fill="none"
                    stroke={textColor}
                    strokeWidth="1"
                  />
                  <path
                    d="M0,10 Q5,15 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T80,10 T90,10 T100,10"
                    fill="none"
                    stroke={textColor}
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="url(#soundWavePattern)"
              />
            </svg>
          </div>

          {/* Optional diagonal bands */}
          {ticketInfo.showDiagonalBands !== false && (
            <div className="absolute top-0 right-0 h-full w-full overflow-hidden">
              <div
                className="absolute -right-1/4 top-0 h-full w-1/3 transform rotate-12"
                style={{ backgroundColor: secondaryColor, opacity: 0.15 }}
              />
              <div
                className="absolute -left-1/4 bottom-0 h-full w-1/3 transform -rotate-12"
                style={{ backgroundColor: secondaryColor, opacity: 0.15 }}
              />
            </div>
          )}

          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/25 backdrop-blur-sm"></div>
        </div>

        {/* Content Area */}
        <div className="relative text-white h-full flex flex-col font-sans">
          {/* Concert Brand/Presenter - Optional */}
          {ticketInfo.showPresenter !== false && (
            <div className="absolute top-0 right-0 rotate-45 transform origin-top-right">
              <div
                className="py-1 px-3 text-xs font-bold tracking-wider"
                style={{ backgroundColor: secondaryColor, color: "#000" }}
              >
                {ticketInfo.presenter || "LIVE"}
              </div>
            </div>
          )}

          {/* Top Section */}
          <div
            className="flex-grow p-4 flex flex-col justify-between text-center"
            style={{ height: "65%" }}
          >
            {/* Artist/Event/Tour Info - with larger artist name */}
            <div className="mt-3">
              <h1
                className="text-2xl font-extrabold uppercase tracking-wider mb-1 leading-tight drop-shadow-lg"
                style={{ color: textColor }}
              >
                {ticketInfo.artistName || "Artist Name"}
              </h1>

              {/* Tour name with fun styling */}
              <div className="flex items-center justify-center">
                <div
                  className="w-10 h-px mx-1"
                  style={{ backgroundColor: secondaryColor }}
                ></div>
                <p
                  className="text-lg font-semibold drop-shadow-md px-1"
                  style={{ color: textColor }}
                >
                  {ticketInfo.tourName || "World Tour"}
                </p>
                <div
                  className="w-10 h-px mx-1"
                  style={{ backgroundColor: secondaryColor }}
                ></div>
              </div>

              {/* Location with icon */}
              <div className="flex items-center justify-center mt-2">
                <svg
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  stroke="currentColor"
                  fill="none"
                  className="mr-1 text-current opacity-90"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm opacity-90" style={{ color: textColor }}>
                  {ticketInfo.eventLocation || "The Venue"}
                </p>
              </div>
            </div>

            {/* Date/Time Block - with attractive styling */}
            <div className="mb-2">
              <div
                className="inline-block p-3 rounded shadow-md transform -rotate-1"
                style={{
                  backgroundColor: `${primaryColor}dd`, // Semi-transparent
                  border: `2px solid ${textColor}22`,
                }}
              >
                {/* Date with day highlighting */}
                <div className="flex items-center justify-center">
                  {ticketInfo.date ? (
                    <>
                      <div
                        className="flex flex-col items-center justify-center w-10 h-10 rounded-full mr-2"
                        style={{
                          backgroundColor: secondaryColor,
                          color: "#000",
                        }}
                      >
                        <span className="text-lg font-bold leading-none">
                          {format(new Date(ticketInfo.date), "d")}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold leading-tight">
                          {format(new Date(ticketInfo.date), "EEEE")}
                        </p>
                        <p className="text-xs opacity-90 leading-tight">
                          {format(new Date(ticketInfo.date), "MMMM yyyy")}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm font-bold">Date TBA</p>
                  )}
                </div>

                {/* Time */}
                <div className="mt-1 border-t border-white/20 pt-1 text-center">
                  <div className="flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      stroke="currentColor"
                      fill="none"
                      className="mr-1 opacity-80"
                    >
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M12 6v6l4 2"
                      />
                    </svg>
                    <p className="text-sm font-medium">
                      {ticketInfo.time
                        ? format(new Date(ticketInfo.time), "h:mm a")
                        : "Doors Open: 7:00 PM"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider Section - Various custom shapes */}
          <div className="relative">
            {/* Shape options: "angle", "wave", "zigzag", default: "angle" */}
            {(() => {
              const dividerStyle = ticketInfo.dividerStyle || "angle";

              switch (dividerStyle) {
                case "wave":
                  return (
                    <svg
                      className="absolute -top-6 left-0 w-full h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 100 24"
                      preserveAspectRatio="none"
                    >
                      <path d="M0,24 C16.6666667,8 33.3333333,0 50,0 C66.6666667,0 83.3333333,8 100,24 L100,24 L0,24 Z" />
                    </svg>
                  );
                case "zigzag":
                  return (
                    <svg
                      className="absolute -top-6 left-0 w-full h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 100 24"
                      preserveAspectRatio="none"
                    >
                      <polygon points="0,24 12.5,0 25,24 37.5,0 50,24 62.5,0 75,24 87.5,0 100,24 100,24 0,24" />
                    </svg>
                  );
                case "angle":
                default:
                  return (
                    <svg
                      className="absolute -top-8 left-0 w-full h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <polygon points="0,100 100,0 100,100" />
                    </svg>
                  );
              }
            })()}

            {/* Perforation Line */}
            <div className="absolute -top-3 left-0 right-0 flex z-10">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 border-l border-dashed border-gray-400 opacity-70"
                  style={{ width: "2.5%" }}
                />
              ))}
            </div>
          </div>

          {/* Stub Section */}
          <div
            className="bg-white p-4 text-gray-900 h-full flex flex-col justify-around"
            style={{ height: "35%" }}
          >
            {/* Seating Info with colored accents */}
            <div className="flex justify-around items-center text-center">
              <div>
                <p
                  className="text-xs font-semibold uppercase mb-1"
                  style={{ color: primaryColor }}
                >
                  {ticketInfo.gate ? "Gate" : "Section"}
                </p>
                <p className="text-2xl font-bold">
                  {ticketInfo.gate || ticketInfo.section || "N/A"}
                </p>
              </div>
              <div
                className="h-10 w-px"
                style={{ backgroundColor: secondaryColor }}
              />
              <div>
                <p
                  className="text-xs font-semibold uppercase mb-1"
                  style={{ color: primaryColor }}
                >
                  Row
                </p>
                <p className="text-2xl font-bold">{ticketInfo.row || "N/A"}</p>
              </div>
              <div
                className="h-10 w-px"
                style={{ backgroundColor: secondaryColor }}
              />
              <div>
                <p
                  className="text-xs font-semibold uppercase mb-1"
                  style={{ color: primaryColor }}
                >
                  Seat
                </p>
                <p className="text-2xl font-bold">{ticketInfo.seat || "N/A"}</p>
              </div>
            </div>

            {/* Barcode Area with subtle styling */}
            <div className="flex flex-col items-center">
              <div className="w-full relative">
                {/* Subtle background for barcode */}
                <div
                  className="absolute inset-0 rounded opacity-10"
                  style={{ backgroundColor: primaryColor }}
                ></div>

                <img
                  src={generateBarcodePattern()}
                  alt="Barcode"
                  className="w-56 h-10 object-contain relative z-10"
                />
              </div>

              <p className="text-xs mt-1 font-mono text-gray-600">
                {ticketNumber}
              </p>

              {/* Optional custom message */}
              {ticketInfo.message && (
                <p
                  className="mt-1 text-xs text-center font-semibold"
                  style={{ color: primaryColor }}
                >
                  {ticketInfo.message}
                </p>
              )}

              {/* Footer with subtle styling */}
              <div
                className="text-[10px] text-center mt-1 py-1 px-3 rounded-full"
                style={{
                  color: secondaryColor,
                  backgroundColor: `${primaryColor}22`,
                }}
              >
                ADMIT ONE · NON-TRANSFERABLE
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ConcertsVerticalTemplate.displayName = "ConcertsVerticalTemplate";

export default ConcertsVerticalTemplate;
