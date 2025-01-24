import React, { forwardRef } from "react";

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

const CreativeTemplate = forwardRef(({ ticketInfo }, ref) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div
        ref={ref}
        className="relative w-[800px] bg-white overflow-hidden shadow-2xl"
        style={{ aspectRatio: "2.5/1" }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          {/* Abstract Shapes */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full translate-x-32 -translate-y-32 opacity-50" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-100 to-violet-200 rounded-full -translate-x-32 translate-y-32 opacity-50" />
            <div className="absolute inset-0 mix-blend-overlay">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.03) 0%, transparent 50%)`,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative h-full flex">
          {/* Main Content */}
          <div className="flex-grow p-8 border-r border-dashed border-black/20">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-light tracking-tight text-black mb-2">
                  {ticketInfo?.eventName || "Event Name"}
                </h1>
                <p className="text-sm tracking-widest text-black/60 uppercase">
                  {ticketInfo?.eventLocation || "Event Location"}
                </p>
              </div>
              <div className="text-right">
                <div className="space-y-1">
                  <p className="text-xs tracking-widest text-black/40 uppercase">
                    Date
                  </p>
                  <p className="font-mono text-lg">
                    {ticketInfo?.date
                      ? new Date(ticketInfo.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBD"}
                  </p>
                </div>
                <div className="space-y-1 mt-4">
                  <p className="text-xs tracking-widest text-black/40 uppercase">
                    Time
                  </p>
                  <p className="font-mono text-lg">
                    {ticketInfo?.time
                      ? new Date(`${ticketInfo.time}`).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )
                      : "TBD"}
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Line */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent my-8" />

            {/* Ticket Details */}
            <div className="flex justify-center gap-12">
              <div className="text-center">
                <p className="text-xs tracking-widest text-black/40 uppercase mb-2">
                  Section
                </p>
                <p className="font-mono text-2xl">
                  {ticketInfo?.section || "---"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs tracking-widest text-black/40 uppercase mb-2">
                  Row
                </p>
                <p className="font-mono text-2xl">{ticketInfo?.row || "---"}</p>
              </div>
              <div className="text-center">
                <p className="text-xs tracking-widest text-black/40 uppercase mb-2">
                  Seat
                </p>
                <p className="font-mono text-2xl">
                  {ticketInfo?.seat || "---"}
                </p>
              </div>
            </div>
          </div>

          {/* Stub */}
          <div className="w-48 p-6 flex flex-col justify-between relative">
            {/* Perforation Line */}
            <div className="absolute -left-px top-0 bottom-0 flex flex-col">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="w-px h-2 border-l border-dashed border-black/20"
                  style={{ marginBottom: "4px" }}
                />
              ))}
            </div>

            <div className="text-center mb-auto pt-4">
              <p
                className="text-xs tracking-widest text-black/40 uppercase rotate-180"
                style={{ writingMode: "vertical-rl" }}
              >
                Admit One
              </p>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <p className="font-mono text-sm">
                  {ticketInfo?.section || "---"} • {ticketInfo?.row || "---"} •{" "}
                  {ticketInfo?.seat || "---"}
                </p>
              </div>

              <div>
                <img
                  src={generateBarcodePattern()}
                  alt="Barcode"
                  className="w-full opacity-80"
                />
                <p className="text-[8px] text-center mt-1 font-mono">
                  {Math.random().toString(36).substr(2, 12).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Border Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-200 via-rose-200 to-violet-200 opacity-50" />
      </div>
    </div>
  );
});

CreativeTemplate.displayName = "CreativeTemplate";

export default CreativeTemplate;
