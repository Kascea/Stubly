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

const SportsVerticalTemplate = forwardRef(({ ticketInfo }, ref) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div
        ref={ref}
        className="relative w-96 overflow-hidden bg-white shadow-lg"
        style={{ aspectRatio: "2/3" }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-gradient-to-br from-sky-300 to-orange-300"
          style={{
            backgroundImage: ticketInfo?.backgroundImage
              ? `url(${ticketInfo.backgroundImage})`
              : ticketInfo?.background_url
              ? `url(${ticketInfo.background_url})`
              : undefined,
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content Container */}
        <div className="relative text-white h-full flex flex-col">
          {/* Main Content */}
          <div className="flex-grow p-6 flex flex-col justify-between">
            {/* Header Info */}
            <div className="space-y-2">
              <p className="text-sm">
                {ticketInfo?.eventLocation || "Event Location"}
              </p>
              <p className="text-sm">
                {ticketInfo?.date
                  ? new Date(ticketInfo.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "TBD"}
              </p>
              <p className="text-sm">
                {ticketInfo?.time
                  ? new Date(`${ticketInfo.time}`).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "TBD"}
              </p>
            </div>

            {/* Event Title */}
            <div className="text-center my-8">
              <h1 className="text-5xl font-bold mb-2 leading-tight">
                {ticketInfo?.eventName || "Event Name"}
              </h1>
              <p className="text-xl tracking-wider">
                {ticketInfo?.eventLocation || "Event Location"}
              </p>
            </div>

            {/* Ticket Details Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400">SEC</p>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded">
                  {ticketInfo?.section || "Section"}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">ROW</p>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded">
                  {ticketInfo?.row || "Row"}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">SEAT</p>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded">
                  {ticketInfo?.seat || "Seat"}
                </div>
              </div>
            </div>
          </div>

          {/* Tear-off Section */}
          <div className="relative">
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

            {/* Stub Content */}
            <div className="bg-white/10 backdrop-blur-sm p-4">
              <div className="grid grid-cols-3 gap-4 justify-items-center mb-4">
                <div>
                  <p className="text-xs text-gray-400 text-center">SEC</p>
                  <p className="text-center">
                    {ticketInfo?.section || "Section"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 text-center">ROW</p>
                  <p className="text-center">{ticketInfo?.row || "Row"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 text-center">SEAT</p>
                  <p className="text-center">{ticketInfo?.seat || "Seat"}</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={generateBarcodePattern()}
                  alt="Barcode"
                  className="w-48"
                />
                <p className="text-xs mt-1">
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

SportsVerticalTemplate.displayName = "SportsVerticalTemplate";

export default SportsVerticalTemplate;
