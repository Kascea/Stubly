import React, { forwardRef } from "react";
import { generateBarcodePattern } from "@/utils/barcode";

const ConcertsCreativeTemplate = forwardRef(({ ticketInfo }, ref) => {
  // Helper function to create harmonious colors from accent color
  const getHarmoniousColors = (accentColor) => {
    const defaultAccent = "#6366f1";
    const accent = accentColor || defaultAccent;

    return {
      // Primary accent (header)
      primary: accent,
      primaryDark: accent + "dd",

      // Analogous colors (adjacent on color wheel) - more distinct variations
      warm: accent.replace(/#(.{2})(.{2})(.{2})/, (_, r, g, b) => {
        const red = Math.min(255, parseInt(r, 16) + 40);
        const green = Math.max(0, parseInt(g, 16) - 20);
        const blue = Math.max(0, parseInt(b, 16) - 50);
        return `#${red.toString(16).padStart(2, "0")}${green
          .toString(16)
          .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
      }),
      cool: accent.replace(/#(.{2})(.{2})(.{2})/, (_, r, g, b) => {
        const red = Math.max(0, parseInt(r, 16) - 50);
        const green = Math.min(255, parseInt(g, 16) + 20);
        const blue = Math.min(255, parseInt(b, 16) + 40);
        return `#${red.toString(16).padStart(2, "0")}${green
          .toString(16)
          .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
      }),

      // Neutral tones that complement the accent
      neutral: "#f8fafc",
      neutralMid: "#e2e8f0",
      neutralDark: "#475569",
    };
  };

  const colors = getHarmoniousColors(ticketInfo?.accentColor);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div
        ref={ref}
        className="w-80 bg-white shadow-xl shadow-gray-900/20 overflow-hidden"
        style={{ aspectRatio: "3/7", maxHeight: "40rem" }}
      >
        {/* Header with accent color */}
        <div
          className="relative p-6 pb-8"
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
          }}
        >
          {/* Organic blob shapes */}
          <div className="absolute top-2 right-4">
            <div
              className="w-16 h-16 bg-white/10 transform rotate-12"
              style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
            ></div>
          </div>
          <div className="absolute bottom-2 left-2">
            <div
              className="w-12 h-12 bg-white/8"
              style={{ borderRadius: "40% 60% 70% 30% / 40% 70% 30% 60%" }}
            ></div>
          </div>

          <div className="relative z-10 text-center">
            <h1 className="text-3xl font-light text-white tracking-wide mb-3">
              {ticketInfo?.artistName || "ARTIST NAME"}
            </h1>
            <div
              className="inline-block bg-white/15 backdrop-blur-sm px-6 py-2 text-white/95"
              style={{ borderRadius: "20px 5px 20px 5px" }}
            >
              <p className="text-sm font-medium uppercase tracking-widest">
                {ticketInfo?.tourName || "WORLD TOUR"}
              </p>
            </div>
          </div>
        </div>

        {/* Harmonious wavy divider */}
        <div className="relative h-6">
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 320 24"
            preserveAspectRatio="none"
          >
            <path
              d="M0,24 C80,8 160,8 240,24 C280,32 300,16 320,24 L320,0 C240,16 160,16 80,0 C40,-8 20,8 0,0 Z"
              style={{ fill: colors.neutralMid }}
            />
          </svg>
        </div>

        {/* More traditional content layout with creative touches */}
        <div className="flex-grow p-6 space-y-5">
          {/* Date and Time in a row - more traditional */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="p-4 transform -rotate-1"
              style={{
                borderRadius: "16px 4px 16px 4px",
                backgroundColor: colors.warm + "20",
                border: `1px solid ${colors.warm}40`,
              }}
            >
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: colors.warm }}
              >
                Date
              </p>
              <p
                className="text-lg font-light"
                style={{ color: colors.warm + "dd" }}
              >
                {ticketInfo?.date
                  ? new Date(ticketInfo.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "2-digit",
                    })
                  : "DATE"}
              </p>
            </div>

            <div
              className="p-4 transform rotate-1"
              style={{
                borderRadius: "4px 16px 4px 16px",
                backgroundColor: colors.cool + "20",
                border: `1px solid ${colors.cool}40`,
              }}
            >
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: colors.cool }}
              >
                Time
              </p>
              <p
                className="text-lg font-light"
                style={{ color: colors.cool + "dd" }}
              >
                {ticketInfo?.time
                  ? new Date(`${ticketInfo.time}`).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "TIME"}
              </p>
            </div>
          </div>

          {/* Central venue section */}
          <div
            className="p-5 relative overflow-hidden"
            style={{
              borderRadius: "20px 8px 20px 8px",
              backgroundColor: colors.neutral,
              border: `1px solid ${colors.neutralMid}`,
              color: colors.neutralDark,
            }}
          >
            {/* Flowing background shapes */}
            <div
              className="absolute top-0 right-0 w-16 h-16 transform translate-x-4 -translate-y-4"
              style={{
                borderRadius: "50% 20% 50% 20%",
                backgroundColor: colors.neutralMid + "40",
              }}
            ></div>

            <div className="relative z-10 text-center">
              <p className="text-xs uppercase tracking-wider opacity-70 mb-2">
                Venue
              </p>
              <p className="text-xl font-light leading-tight">
                {ticketInfo?.eventLocation || "VENUE NAME"}
              </p>
            </div>
          </div>

          {/* Traditional seat information grid with creative touches */}
          <div className="grid grid-cols-3 gap-3">
            <div
              className="p-4 text-center transform -rotate-1"
              style={{
                borderRadius: "12px 4px 12px 4px",
                background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}25)`,
                border: `1px solid ${colors.primary}40`,
              }}
            >
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: colors.primary }}
              >
                Section
              </p>
              <p
                className="text-2xl font-light"
                style={{ color: colors.primary + "dd" }}
              >
                {ticketInfo?.section || "N/A"}
              </p>
            </div>

            <div
              className="p-4 text-center"
              style={{
                borderRadius: "16px 16px 4px 16px",
                backgroundColor: colors.warm + "20",
                border: `1px solid ${colors.warm}40`,
              }}
            >
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: colors.warm }}
              >
                Row
              </p>
              <p
                className="text-2xl font-light"
                style={{ color: colors.warm + "dd" }}
              >
                {ticketInfo?.row || "N/A"}
              </p>
            </div>

            <div
              className="p-4 text-center transform rotate-1"
              style={{
                borderRadius: "4px 12px 4px 12px",
                backgroundColor: colors.cool + "20",
                border: `1px solid ${colors.cool}40`,
              }}
            >
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: colors.cool }}
              >
                Seat
              </p>
              <p
                className="text-2xl font-light"
                style={{ color: colors.cool + "dd" }}
              >
                {ticketInfo?.seat || "N/A"}
              </p>
            </div>
          </div>

          {/* Flowing decorative element */}
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3"
                style={{
                  borderRadius: "50% 20% 50% 20%",
                  backgroundColor: colors.primary + "60",
                }}
              ></div>
              <div
                className="w-8 h-0.5 rounded-full transform rotate-6"
                style={{ backgroundColor: colors.neutralMid }}
              ></div>
              <div
                className="w-2 h-2"
                style={{
                  borderRadius: "30% 70% 30% 70%",
                  backgroundColor: colors.warm + "60",
                }}
              ></div>
              <div
                className="w-8 h-0.5 rounded-full transform -rotate-6"
                style={{ backgroundColor: colors.neutralMid }}
              ></div>
              <div
                className="w-3 h-3"
                style={{
                  borderRadius: "70% 30% 70% 30%",
                  backgroundColor: colors.cool + "60",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Larger barcode section */}
        <div
          className="p-4 relative border-t"
          style={{
            backgroundColor: colors.neutral,
            borderColor: colors.neutralMid,
          }}
        >
          {/* Subtle flowing background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div
              className="absolute -top-2 -left-2 w-12 h-12"
              style={{
                borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                backgroundColor: colors.neutralMid + "30",
              }}
            ></div>
            <div
              className="absolute -bottom-2 -right-2 w-10 h-10"
              style={{
                borderRadius: "40% 60% 70% 30% / 40% 70% 30% 60%",
                backgroundColor: colors.neutralMid + "40",
              }}
            ></div>
          </div>

          <div className="relative z-10">
            <img
              src={generateBarcodePattern()}
              alt="Barcode"
              className="w-full h-16 mb-2"
            />
            <p
              className="text-xs font-mono text-center"
              style={{ color: colors.neutralDark }}
            >
              {Math.random().toString(36).substr(2, 12).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Footer with neutral theme */}
        <div className="relative">
          {/* Curved top edge */}
          <svg
            className="absolute top-0 left-0 w-full h-4"
            viewBox="0 0 320 16"
            preserveAspectRatio="none"
          >
            <path
              d="M0,16 C80,0 160,0 240,16 C280,24 300,8 320,16 L320,16 L0,16 Z"
              style={{ fill: colors.neutralDark }}
            />
          </svg>
          <div
            className="pt-4 pb-3"
            style={{ backgroundColor: colors.neutralDark }}
          >
            <div className="text-center">
              <p className="text-white font-light uppercase tracking-widest text-sm">
                ADMIT ONE
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ConcertsCreativeTemplate.displayName = "ConcertsCreativeTemplate";

export default ConcertsCreativeTemplate;
