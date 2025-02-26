import React, { forwardRef } from "react";
import { format } from "date-fns";

const ConcertsHorizontalTemplate = forwardRef(({ ticketInfo }, ref) => {
  return (
    <div
      ref={ref}
      className="relative w-full max-w-2xl mx-auto aspect-[16/9] rounded-xl overflow-hidden shadow-xl bg-gradient-to-r from-purple-900 to-pink-800 text-white"
      style={{
        backgroundImage: ticketInfo.backgroundImage
          ? `url(${ticketInfo.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

      <div className="relative z-10 p-6 h-full flex">
        {/* Left Side - Event Info */}
        <div className="w-2/3 pr-4 flex flex-col">
          <div className="mb-2">
            <div className="text-xs uppercase tracking-widest mb-1 text-pink-300">
              Live Performance
            </div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">
              {ticketInfo.eventName || "Concert Event"}
            </h1>
            <div className="mt-1 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-pink-300 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-lg opacity-90">
                {ticketInfo.eventLocation || "Concert Hall"}
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-full">
              <div className="text-xl font-semibold mb-2">EVENT DETAILS</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm opacity-80">DATE</div>
                  <div className="text-lg font-medium">
                    {ticketInfo.date
                      ? format(new Date(ticketInfo.date), "MMMM d, yyyy")
                      : "December 15, 2023"}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-80">TIME</div>
                  <div className="text-lg font-medium">
                    {ticketInfo.time
                      ? format(new Date(ticketInfo.time), "h:mm a")
                      : "8:00 PM"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-pink-300">
            No refunds or exchanges • Event subject to change
          </div>
        </div>

        {/* Right Side - Seat Info */}
        <div className="w-1/3 border-l border-pink-500/30 pl-4 flex flex-col">
          <div className="text-center mb-2">
            <div className="text-sm uppercase tracking-wider text-pink-300">
              VIP Access
            </div>
            <div className="text-2xl font-bold">ONE</div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center">
                <div className="text-sm opacity-80">SECTION</div>
                <div className="text-xl font-bold">
                  {ticketInfo.section || "FRONT"}
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center">
                <div className="text-sm opacity-80">ROW</div>
                <div className="text-xl font-bold">{ticketInfo.row || "A"}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center">
                <div className="text-sm opacity-80">SEAT</div>
                <div className="text-xl font-bold">
                  {ticketInfo.seat || "12"}
                </div>
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
