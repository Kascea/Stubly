import React, { forwardRef } from "react";
import { format } from "date-fns";

const FestivalTemplate = forwardRef(({ ticketInfo }, ref) => {
  return (
    <div
      ref={ref}
      className="relative w-full max-w-md mx-auto aspect-[2/3] rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-yellow-400 to-orange-600 text-white"
      style={{
        backgroundImage: ticketInfo.backgroundImage
          ? `url(${ticketInfo.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>

      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold tracking-tight uppercase">
            {ticketInfo.eventName || "Music Festival"}
          </h1>
          <p className="text-lg opacity-90">
            {ticketInfo.eventLocation || "Festival Grounds"}
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 w-full text-center">
            <div className="text-xl font-semibold mb-2">WEEKEND PASS</div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm opacity-80">AREA</div>
                <div className="text-xl font-bold">
                  {ticketInfo.section || "VIP"}
                </div>
              </div>
              <div>
                <div className="text-sm opacity-80">ZONE</div>
                <div className="text-xl font-bold">{ticketInfo.row || "A"}</div>
              </div>
              <div>
                <div className="text-sm opacity-80">PASS #</div>
                <div className="text-xl font-bold">
                  {ticketInfo.seat || "42"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-lg font-semibold">
            {ticketInfo.date
              ? format(new Date(ticketInfo.date), "EEEE, MMMM d, yyyy")
              : "Friday-Sunday, July 14-16, 2023"}
          </div>
          <div className="text-lg">
            {ticketInfo.time
              ? format(new Date(ticketInfo.time), "h:mm a")
              : "All Day"}
          </div>
        </div>
      </div>
    </div>
  );
});

FestivalTemplate.displayName = "FestivalTemplate";

export default FestivalTemplate;
