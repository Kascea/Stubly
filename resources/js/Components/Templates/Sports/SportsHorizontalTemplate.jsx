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
  // Format date and time
  const formattedDate = ticketInfo?.date
    ? new Date(ticketInfo.date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "TBD";

  const formattedTime = ticketInfo?.time
    ? new Date(`${ticketInfo.time}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "TBD";

  // Get accent color (previously dividerColor)
  const accentColor =
    ticketInfo?.accentColor || ticketInfo?.dividerColor || "#0c4a6e";

  return (
    <div className="flex items-center justify-center">
      <div
        ref={ref}
        className="relative overflow-hidden bg-white shadow-lg rounded-lg"
        style={{
          aspectRatio: "7/3",
          width: "100%",
          maxWidth: "700px",
          height: "auto",
        }}
      >
        {/* Background Image or Gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: ticketInfo?.backgroundImage
              ? `url(${ticketInfo.backgroundImage})`
              : ticketInfo?.background_url
              ? `url(${ticketInfo.background_url})`
              : undefined,
            backgroundColor:
              !ticketInfo?.backgroundImage && !ticketInfo?.background_url
                ? "#f8fafc"
                : undefined,
          }}
        >
          {/* Overlay for better text readability */}
          {(ticketInfo?.backgroundImage || ticketInfo?.background_url) && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          )}
        </div>

        {/* Main Content Container */}
        <div className="relative h-full flex">
          {/* Left Section (2/3) */}
          <div className="w-2/3 p-6 flex flex-col justify-between relative">
            {/* Top Section with Event Details */}
            <div className="flex justify-between items-start">
              {/* Event Info */}
              <div className="max-w-[70%]">
                <h1
                  className={`text-3xl font-bold mb-1 leading-tight ${
                    ticketInfo?.backgroundImage || ticketInfo?.background_url
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {ticketInfo?.eventName || "Event Name"}
                </h1>
                <p
                  className={`text-lg ${
                    ticketInfo?.backgroundImage || ticketInfo?.background_url
                      ? "text-gray-300"
                      : "text-gray-600"
                  }`}
                >
                  {ticketInfo?.eventLocation || "Event Location"}
                </p>
                <div
                  className={`mt-2 ${
                    ticketInfo?.backgroundImage || ticketInfo?.background_url
                      ? "text-gray-300"
                      : "text-gray-600"
                  }`}
                >
                  <p className="text-sm">
                    {formattedDate} • {formattedTime}
                  </p>
                </div>
              </div>

              {/* Team Logos */}
              <div className="flex items-center space-x-2">
                {ticketInfo?.homeTeamLogo && (
                  <div className="h-14 w-14 bg-white rounded-full p-1 shadow-md flex items-center justify-center">
                    <img
                      src={ticketInfo.homeTeamLogo}
                      alt="Home Team"
                      className="max-h-10 max-w-10 object-contain"
                    />
                  </div>
                )}
                {ticketInfo?.homeTeam && ticketInfo?.awayTeam && (
                  <div
                    className={`text-lg font-bold ${
                      ticketInfo?.backgroundImage || ticketInfo?.background_url
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    VS
                  </div>
                )}
                {ticketInfo?.awayTeamLogo && (
                  <div className="h-14 w-14 bg-white rounded-full p-1 shadow-md flex items-center justify-center">
                    <img
                      src={ticketInfo.awayTeamLogo}
                      alt="Away Team"
                      className="max-h-10 max-w-10 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Middle Section - Teams */}
            <div className="my-4">
              <div
                className={`flex items-center justify-center space-x-4 ${
                  ticketInfo?.backgroundImage || ticketInfo?.background_url
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                {ticketInfo?.homeTeam && (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">
                      {ticketInfo.homeTeam}
                    </h2>
                    <p
                      className={`text-sm ${
                        ticketInfo?.backgroundImage ||
                        ticketInfo?.background_url
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      HOME
                    </p>
                  </div>
                )}

                {ticketInfo?.homeTeam && ticketInfo?.awayTeam && (
                  <div className="text-3xl font-light px-4">vs</div>
                )}

                {ticketInfo?.awayTeam && (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">
                      {ticketInfo.awayTeam}
                    </h2>
                    <p
                      className={`text-sm ${
                        ticketInfo?.backgroundImage ||
                        ticketInfo?.background_url
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      AWAY
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section - Seating Info */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p
                  className={`text-xs ${
                    ticketInfo?.backgroundImage || ticketInfo?.background_url
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  SECTION
                </p>
                <div
                  className={`${
                    ticketInfo?.backgroundImage || ticketInfo?.background_url
                      ? "bg-white/10 backdrop-blur-sm text-white"
                      : "bg-gray-100 text-gray-800"
                  } px-4 py-2 rounded font-medium`}
                  style={{ borderLeft: `3px solid ${accentColor}` }}
                >
                  {ticketInfo?.section || "Section"}
                </div>
              </div>
              <div>
                <p
                  className={`text-xs ${
                    ticketInfo?.backgroundImage || ticketInfo?.background_url
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  ROW
                </p>
                <div
                  className={`${
                    ticketInfo?.backgroundImage || ticketInfo?.background_url
                      ? "bg-white/10 backdrop-blur-sm text-white"
                      : "bg-gray-100 text-gray-800"
                  } px-4 py-2 rounded font-medium`}
                  style={{ borderLeft: `3px solid ${accentColor}` }}
                >
                  {ticketInfo?.row || "Row"}
                </div>
              </div>
              <div>
                <p
                  className={`text-xs ${
                    ticketInfo?.backgroundImage || ticketInfo?.background_url
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  SEAT
                </p>
                <div
                  className={`${
                    ticketInfo?.backgroundImage || ticketInfo?.background_url
                      ? "bg-white/10 backdrop-blur-sm text-white"
                      : "bg-gray-100 text-gray-800"
                  } px-4 py-2 rounded font-medium`}
                  style={{ borderLeft: `3px solid ${accentColor}` }}
                >
                  {ticketInfo?.seat || "Seat"}
                </div>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="relative">
            <div
              className="absolute top-0 bottom-0 left-0 w-0.5"
              style={{ backgroundColor: accentColor }}
            ></div>

            {/* Perforation Line */}
            <div className="absolute top-0 bottom-0 left-1 flex flex-col justify-between py-2">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/80" />
              ))}
            </div>
          </div>

          {/* Right Section (1/3) - Ticket Stub */}
          <div className="w-1/3 p-5 flex flex-col justify-between relative">
            <div
              className={`absolute top-0 left-0 right-0 h-2`}
              style={{ backgroundColor: accentColor }}
            ></div>

            {/* Stub Content */}
            <div className="text-center mb-2">
              <p
                className={`text-xs ${
                  ticketInfo?.backgroundImage || ticketInfo?.background_url
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                ADMIT ONE
              </p>
              <h2
                className={`text-lg font-bold ${
                  ticketInfo?.backgroundImage || ticketInfo?.background_url
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                {ticketInfo?.eventName || "Event Name"}
              </h2>
            </div>

            {/* Teams in Stub */}
            {(ticketInfo?.homeTeam || ticketInfo?.awayTeam) && (
              <div
                className={`text-center text-sm ${
                  ticketInfo?.backgroundImage || ticketInfo?.background_url
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                {ticketInfo?.homeTeam && ticketInfo?.awayTeam ? (
                  <p>
                    {ticketInfo.homeTeam} vs {ticketInfo.awayTeam}
                  </p>
                ) : (
                  <p>{ticketInfo?.homeTeam || ticketInfo?.awayTeam}</p>
                )}
              </div>
            )}

            {/* Seating in Stub */}
            <div className="space-y-1 mb-2">
              <div className="flex justify-between">
                <p
                  className={`text-xs ${
                    ticketInfo?.backgroundImage || ticketInfo?.background_url
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  SECTION
                </p>
                <p
                  className={`${
                    ticketInfo?.backgroundImage || ticketInfo?.background_url
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {ticketInfo?.section || "Section"}
                </p>
              </div>
              <div className="flex justify-between">
                <p
                  className={`text-xs ${
                    ticketInfo?.backgroundImage || ticketInfo?.background_url
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  ROW
                </p>
                <p
                  className={`${
                    ticketInfo?.backgroundImage || ticketInfo?.background_url
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {ticketInfo?.row || "Row"}
                </p>
              </div>
              <div className="flex justify-between">
                <p
                  className={`text-xs ${
                    ticketInfo?.backgroundImage || ticketInfo?.background_url
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  SEAT
                </p>
                <p
                  className={`${
                    ticketInfo?.backgroundImage || ticketInfo?.background_url
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {ticketInfo?.seat || "Seat"}
                </p>
              </div>
            </div>

            {/* Barcode */}
            <div className="flex flex-col items-center mt-auto">
              <img
                src={generateBarcodePattern()}
                alt="Barcode"
                className="w-full max-w-[120px] mx-auto"
              />
              <p
                className={`text-xs mt-1 ${
                  ticketInfo?.backgroundImage || ticketInfo?.background_url
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
              >
                {Math.random().toString(36).substr(2, 10).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SportsHorizontalTemplate.displayName = "SportsHorizontalTemplate";

export default SportsHorizontalTemplate;
