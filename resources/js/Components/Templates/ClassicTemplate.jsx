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

const ClassicTemplate = forwardRef(({ ticketInfo }, ref) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div
        ref={ref}
        className="relative w-96 bg-white shadow-xl overflow-hidden"
        style={{ aspectRatio: "2/1" }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)",
              backgroundSize: "10px 10px",
            }}
          />
        </div>

        {/* Content Container */}
        <div className="relative h-full flex">
          {/* Main Ticket Content */}
          <div className="flex-grow p-6 border-r-2 border-dashed border-gray-300">
            <div className="flex flex-col h-full justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {ticketInfo?.eventName || "Event Name"}
                </h1>
                <p className="text-sm text-gray-600">
                  {ticketInfo?.eventLocation || "Event Location"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500">DATE</p>
                    <p className="font-mono text-lg">
                      {ticketInfo?.date
                        ? new Date(ticketInfo.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "TBD"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">TIME</p>
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

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">SECTION</p>
                    <p className="font-mono">{ticketInfo?.section || "---"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ROW</p>
                    <p className="font-mono">{ticketInfo?.row || "---"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">SEAT</p>
                    <p className="font-mono">{ticketInfo?.seat || "---"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stub */}
          <div className="w-32 p-4 flex flex-col justify-between">
            <div className="text-center">
              <p className="text-xs text-gray-500">ADMIT ONE</p>
            </div>

            <div className="space-y-2 text-center">
              <div>
                <p className="text-xs text-gray-500">SEC</p>
                <p className="font-mono">{ticketInfo?.section || "---"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ROW</p>
                <p className="font-mono">{ticketInfo?.row || "---"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">SEAT</p>
                <p className="font-mono">{ticketInfo?.seat || "---"}</p>
              </div>
            </div>

            <div>
              <img
                src={generateBarcodePattern()}
                alt="Barcode"
                className="w-full"
              />
              <p className="text-[8px] text-center mt-1">
                {Math.random().toString(36).substr(2, 12).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ClassicTemplate.displayName = "ClassicTemplate";

export default ClassicTemplate;
