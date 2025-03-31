import React, { forwardRef } from "react";

const generateBarcodePattern = () => {
  const bars = [];
  for (let i = 0; i < 30; i++) {
    const width = Math.random() > 0.7 ? 3 : 1;
    bars.push(
      `<rect x="${i * 3}" y="0" width="${width}" height="30" fill="black" />`,
    );
  }
  return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="30" viewBox="0 0 100 30">${bars.join(
    "",
  )}</svg>`;
};

const SportsVerticalTemplate = forwardRef(({ ticketInfo }, ref) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div
        ref={ref}
        className="relative w-80 overflow-hidden bg-white shadow-lg shadow-sky-900/25"
        style={{ aspectRatio: "3/7", maxHeight: "40rem" }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-gradient-to-br from-sky-300 to-orange-300"
          style={{
            backgroundImage: ticketInfo?.backgroundImage
              ? `url(${ticketInfo.backgroundImage})`
              : undefined,
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

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
            {/* Event Title and Team Logos - Moved lower */}
            <div className="text-center mb-4 mt-auto">
              <h1 className="text-4xl font-bold mb-4 leading-tight drop-shadow-md">
                {ticketInfo?.eventName || "Event Name"}
              </h1>

              {/* Team Logos and Names */}
              <div className="flex items-center justify-center mt-4 space-x-6">
                {/* Home Team */}
                <div className="flex flex-col items-center">
                  {ticketInfo?.homeTeamLogo ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-black/30 backdrop-blur-sm shadow-lg">
                      <img
                        src={ticketInfo.homeTeamLogo}
                        alt="Home Team"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : null}
                  <p className="text-sm font-medium mt-2 drop-shadow-md">
                    {ticketInfo?.homeTeam || "HOME"}
                  </p>
                </div>

                {/* VS */}
                <div className="text-xl font-bold drop-shadow-md">VS</div>

                {/* Away Team */}
                <div className="flex flex-col items-center">
                  {ticketInfo?.awayTeamLogo ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-black/30 backdrop-blur-sm shadow-lg">
                      <img
                        src={ticketInfo.awayTeamLogo}
                        alt="Away Team"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : null}
                  <p className="text-sm font-medium mt-2 drop-shadow-md">
                    {ticketInfo?.awayTeam || "AWAY"}
                  </p>
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
                            },
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
                            },
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
                backgroundColor: ticketInfo?.dividerColor || "#0c4a6e",
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
            <div className="bg-white p-4 text-gray-800 h-full flex flex-col justify-between">
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

              {/* Additional match details */}
              <div className="text-xs text-center mb-3 text-gray-600 uppercase tracking-wider">
                <p>{ticketInfo?.eventName || "N/A"}</p>
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
                  Start Time:{" "}
                  {ticketInfo?.time
                    ? new Date(`${ticketInfo.time}`).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        },
                      )
                    : "N/A"}
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="border-t border-dashed border-gray-300 w-full mb-2 pt-2">
                  <p className="text-xs text-center text-gray-500 mb-1">
                    VOID IF DETACHED
                  </p>
                </div>
                <img
                  src={generateBarcodePattern()}
                  alt="Barcode"
                  className="w-48"
                />
                <p className="text-xs mt-1 text-gray-600">
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
