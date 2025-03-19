import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { CloudUpload, X, Home, ExternalLink, Shield } from "lucide-react";

export default function SportsTicketFields({
  ticketInfo,
  setTicketInfo,
  getHomeTeamLogoRootProps,
  getHomeTeamLogoInputProps,
  getAwayTeamLogoRootProps,
  getAwayTeamLogoInputProps,
  showRequiredLabels = false,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Home Team Section */}
      <div className="bg-sky-50/30 rounded-lg p-4 border border-sky-100">
        <div className="flex items-center mb-3">
          <Home className="h-4 w-4 text-sky-700 mr-2" />
          <h4 className="text-sm font-medium text-sky-900">Home Team</h4>
          {showRequiredLabels && (
            <span className="text-orange-500 text-xs font-medium ml-2">
              Required
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="homeTeam" className="text-sky-900 text-sm">
              Team Name
            </Label>
            <Input
              id="homeTeam"
              name="homeTeam"
              value={ticketInfo.homeTeam || ""}
              onChange={handleChange}
              placeholder="Enter home team name"
              className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              required={showRequiredLabels}
            />
          </div>

          <div>
            <Label className="text-sky-900 text-sm block mb-1">Team Logo</Label>
            <div
              className="border border-dashed border-orange-200 rounded-lg p-3 hover:bg-orange-50 transition-colors cursor-pointer"
              {...getHomeTeamLogoRootProps()}
            >
              <input {...getHomeTeamLogoInputProps()} />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {ticketInfo.homeTeamLogo ? (
                    <div className="h-8 w-8 mr-3 bg-white rounded-md p-1 border border-gray-200">
                      <img
                        src={ticketInfo.homeTeamLogo}
                        alt="Home team logo"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <CloudUpload className="h-5 w-5 text-orange-300 mr-2" />
                  )}
                  <p className="text-sm text-sky-900/70">
                    {ticketInfo.homeTeamLogo
                      ? "Logo uploaded! Click to change"
                      : "Upload home team logo (optional)"}
                  </p>
                </div>

                {ticketInfo.homeTeamLogo && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTicketInfo((prev) => ({
                        ...prev,
                        homeTeamLogo: null,
                      }));
                    }}
                    className="text-sm text-orange-500 hover:text-orange-600 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Away Team Section */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <div className="flex items-center mb-3">
          <ExternalLink className="h-4 w-4 text-gray-700 mr-2" />
          <h4 className="text-sm font-medium text-sky-900">Away Team</h4>
          {showRequiredLabels && (
            <span className="text-orange-500 text-xs font-medium ml-2">
              Required
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="awayTeam" className="text-sky-900 text-sm">
              Team Name
            </Label>
            <Input
              id="awayTeam"
              name="awayTeam"
              value={ticketInfo.awayTeam || ""}
              onChange={handleChange}
              placeholder="Enter away team name"
              className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              required={showRequiredLabels}
            />
          </div>

          <div>
            <Label className="text-sky-900 text-sm block mb-1">Team Logo</Label>
            <div
              className="border border-dashed border-orange-200 rounded-lg p-3 hover:bg-orange-50 transition-colors cursor-pointer"
              {...getAwayTeamLogoRootProps()}
            >
              <input {...getAwayTeamLogoInputProps()} />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {ticketInfo.awayTeamLogo ? (
                    <div className="h-8 w-8 mr-3 bg-white rounded-md p-1 border border-gray-200">
                      <img
                        src={ticketInfo.awayTeamLogo}
                        alt="Away team logo"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <CloudUpload className="h-5 w-5 text-orange-300 mr-2" />
                  )}
                  <p className="text-sm text-sky-900/70">
                    {ticketInfo.awayTeamLogo
                      ? "Logo uploaded! Click to change"
                      : "Upload away team logo (optional)"}
                  </p>
                </div>

                {ticketInfo.awayTeamLogo && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTicketInfo((prev) => ({
                        ...prev,
                        awayTeamLogo: null,
                      }));
                    }}
                    className="text-sm text-orange-500 hover:text-orange-600 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
