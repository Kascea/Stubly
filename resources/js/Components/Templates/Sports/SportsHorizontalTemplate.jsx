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

const SportsHorizontalTemplate = forwardRef(({ ticketInfo }, ref) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div
        ref={ref}
        className="relative h-80 overflow-hidden bg-white shadow-lg"
        style={{ aspectRatio: "7/3" }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-gradient-to-r from-sky-300 to-orange-300"
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
        <div className="relative text-white h-full flex">
          {/* Main Content - Left Side */}
          <div className="flex-grow p-6 flex flex-col justify-between">
            {/* Event Title */}
            <div>
              <h1 className="text-4xl font-bold mb-2 leading-tight">
                {ticketInfo?.eventName || "Event Name"}
              </h1>
              <p className="text-xl tracking-wider">
                {ticketInfo?.eventLocation || "Event Location"}
              </p>
            </div>

            {/* Date and Time */}
            <div className="my-4">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-xs text-gray-400">DATE</p>
                  <p className="text-lg">
                    {ticketInfo?.date
                      ? new Date(ticketInfo.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBD"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">TIME</p>
                  <p className="text-lg">
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

            {/* Ticket Details Grid */}
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <div>
                <p className="text-xs text-gray-400">SECTION</p>
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

          {/* Tear-off Section - Right Side */}
          <div className="relative w-1/3 flex flex-col">
            {/* Perforation Line */}
            <div className="absolute top-0 bottom-0 -left-3 flex flex-col">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 border-t border-dashed border-gray-400"
                  style={{ height: "2.5%" }}
                />
              ))}
            </div>

            {/* Stub Content */}
            <div className="bg-white/10 backdrop-blur-sm p-4 h-full flex flex-col justify-between">
              <div className="text-center mb-4">
                <p className="text-xs text-gray-400">ADMIT ONE</p>
                <h2 className="text-xl font-semibold">
                  {ticketInfo?.eventName || "Event Name"}
                </h2>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-gray-400">SECTION</p>
                  <p>{ticketInfo?.section || "Section"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">ROW</p>
                  <p>{ticketInfo?.row || "Row"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">SEAT</p>
                  <p>{ticketInfo?.seat || "Seat"}</p>
                </div>
              </div>

              <div className="flex flex-col items-center mt-auto">
                <img
                  src={generateBarcodePattern()}
                  alt="Barcode"
                  className="w-full"
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

SportsHorizontalTemplate.displayName = "SportsHorizontalTemplate";

export default SportsHorizontalTemplate;
