import { forwardRef } from "react";

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        ref={ref}
        className="relative overflow-hidden bg-white shadow-lg shadow-sky-900/25"
        style={{
          width: "100%",
          maxWidth: "40rem",
          aspectRatio: "7/3",
        }}
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
        <div className="relative text-white h-full flex">
          {/* Main Content - Left side (75%) */}
          <div className="w-[75%] p-6 flex flex-col">
            {/* Admit One Banner */}
            <div className="mb-3">
              <div className="bg-white/10 backdrop-blur-sm py-1 px-6 rounded inline-block">
                <p className="font-bold tracking-widest text-sm">ADMIT ONE</p>
              </div>
            </div>

            {/* Event Title */}
            <h1 className="text-4xl font-bold mb-4 leading-tight drop-shadow-md">
              {ticketInfo?.eventName || "Event Name"}
            </h1>

            {/* Team Logos and Names */}
            <div className="flex items-center justify-center space-x-10 mb-6">
              {/* Home Team */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-black/30 backdrop-blur-sm shadow-lg">
                  {ticketInfo?.homeTeamLogo ? (
                    <img
                      src={ticketInfo.homeTeamLogo || "/placeholder.svg"}
                      alt="Home Team"
                      className="w-full h-full object-contain"
                    />
                  ) : null}
                </div>
                <p className="text-sm font-medium mt-2 drop-shadow-md">
                  {ticketInfo?.homeTeam || "HOME"}
                </p>
              </div>

              {/* VS */}
              <div className="text-2xl font-bold drop-shadow-md">VS</div>

              {/* Away Team */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-black/30 backdrop-blur-sm shadow-lg">
                  {ticketInfo?.awayTeamLogo ? (
                    <img
                      src={ticketInfo.awayTeamLogo || "/placeholder.svg"}
                      alt="Away Team"
                      className="w-full h-full object-contain"
                    />
                  ) : null}
                </div>
                <p className="text-sm font-medium mt-2 drop-shadow-md">
                  {ticketInfo?.awayTeam || "AWAY"}
                </p>
              </div>
            </div>

            {/* Event Information */}
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded mt-auto">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-300">DATE</p>
                  <p className="font-medium">
                    {ticketInfo?.date
                      ? new Date(ticketInfo.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })
                      : "TBD"}
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
                          }
                        )
                      : "TBD"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-300">LOCATION</p>
                  <p className="font-medium">
                    {ticketInfo?.eventLocation || "Event Location"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Perforation Line */}
          <div className="relative">
            {/* Colored Divider Line */}
            <div
              className="h-full w-3"
              style={{
                backgroundColor: ticketInfo?.dividerColor || "#0c4a6e",
              }}
            />

            {/* Perforation Line */}
            <div className="absolute top-0 bottom-0 -left-1.5 flex flex-col">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 border-t border-dashed border-gray-400"
                  style={{ height: "2.5%" }}
                />
              ))}
            </div>
          </div>

          {/* Stub Content - Right side (25%) with vertical text */}
          <div className="w-[25%] bg-white p-4 text-gray-800 flex flex-col justify-between relative">
            {/* Vertical Text */}
            <div className="absolute top-0 bottom-0 left-0 w-8 flex items-center justify-center">
              <div
                className="transform -rotate-90 whitespace-nowrap text-gray-500 font-medium tracking-widest text-sm"
                style={{
                  transformOrigin: "center",
                  width: "100%",
                  position: "absolute",
                  textAlign: "center",
                }}
              >
                {ticketInfo?.eventName
                  ? `${ticketInfo.eventName} • `
                  : "TBD • "}
                {ticketInfo?.date
                  ? new Date(ticketInfo.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    }) + " • "
                  : "TBD • "}
                {ticketInfo?.time
                  ? new Date(`${ticketInfo.time}`).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "TBD"}
              </div>
            </div>

            {/* Main Stub Content - shifted right to make room for vertical text */}
            <div className="ml-8 flex flex-col h-full justify-between">
              <div className="text-center mb-2">
                <p className="text-sm text-gray-600 uppercase tracking-wider font-medium">
                  {ticketInfo?.eventName || "Team vs Team"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 mb-4">
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-500 uppercase">SECTION</p>
                  <p className="text-3xl font-bold">
                    {ticketInfo?.section || "TBD"}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-500 uppercase">ROW</p>
                  <p className="text-3xl font-bold">
                    {ticketInfo?.row || "TBD"}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-500 uppercase">SEAT</p>
                  <p className="text-3xl font-bold">
                    {ticketInfo?.seat || "TBD"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center mt-auto">
                <div className="border-t border-dashed border-gray-300 w-full mb-2 pt-2">
                  <p className="text-xs text-center text-gray-500 mb-1">
                    VOID IF DETACHED
                  </p>
                </div>
                <img
                  src={generateBarcodePattern() || "/placeholder.svg"}
                  alt="Barcode"
                  className="w-full"
                />
                <p className="text-xs mt-1 text-gray-600">
                  {Math.random().toString(36).substr(2, 8).toUpperCase()}
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
