import React, { forwardRef } from "react";
import { format } from "date-fns";

const RockTemplate = forwardRef(({ ticketInfo }, ref) => {
  return (
    <div
      ref={ref}
      className="relative w-full max-w-md mx-auto aspect-[2/3] rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-purple-800 to-black text-white"
      style={{
        backgroundImage: ticketInfo.backgroundImage
          ? `url(${ticketInfo.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>

      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold tracking-tight uppercase">
            {ticketInfo.eventName || "Rock Concert"}
          </h1>
          <p className="text-lg opacity-90">
            {ticketInfo.eventLocation || "Venue Name"}
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 w-full text-center border border-purple-500/30">
            <div className="text-xl font-semibold mb-2">VIP ACCESS</div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm opacity-80">SECTION</div>
                <div className="text-xl font-bold">
                  {ticketInfo.section || "PIT"}
                </div>
              </div>
              <div>
                <div className="text-sm opacity-80">ROW</div>
                <div className="text-xl font-bold">{ticketInfo.row || "1"}</div>
              </div>
              <div>
                <div className="text-sm opacity-80">SEAT</div>
                <div className="text-xl font-bold">
                  {ticketInfo.seat || "5"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-lg font-semibold">
            {ticketInfo.date
              ? format(new Date(ticketInfo.date), "EEEE, MMMM d, yyyy")
              : "Saturday, December 2, 2023"}
          </div>
          <div className="text-lg">
            {ticketInfo.time
              ? format(new Date(ticketInfo.time), "h:mm a")
              : "8:00 PM"}
          </div>
        </div>
      </div>
    </div>
  );
});

RockTemplate.displayName = "RockTemplate";

export default RockTemplate;
