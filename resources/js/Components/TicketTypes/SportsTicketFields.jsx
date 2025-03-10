import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { CloudUpload, X } from "lucide-react";

export default function SportsTicketFields({
  ticketInfo,
  setTicketInfo,
  getHomeTeamLogoRootProps,
  getHomeTeamLogoInputProps,
  getAwayTeamLogoRootProps,
  getAwayTeamLogoInputProps,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="homeTeam" className="text-sky-900">
          Home Team
        </Label>
        <Input
          id="homeTeam"
          name="homeTeam"
          value={ticketInfo.homeTeam || ""}
          onChange={handleChange}
          placeholder="Home Team Name"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="awayTeam" className="text-sky-900">
          Away Team
        </Label>
        <Input
          id="awayTeam"
          name="awayTeam"
          value={ticketInfo.awayTeam || ""}
          onChange={handleChange}
          placeholder="Away Team Name"
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-sky-900 block mb-1">Home Team Logo</Label>
        <div
          className="border border-dashed border-orange-200 rounded-lg p-3 hover:bg-orange-50 transition-colors cursor-pointer"
          {...getHomeTeamLogoRootProps()}
        >
          <input {...getHomeTeamLogoInputProps()} />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CloudUpload className="h-5 w-5 text-orange-300 mr-2" />
              <p className="text-sm text-sky-900/70">
                {ticketInfo.homeTeamLogo
                  ? "Logo uploaded! Click to change"
                  : "Upload home team logo"}
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

      <div>
        <Label className="text-sky-900 block mb-1">Away Team Logo</Label>
        <div
          className="border border-dashed border-orange-200 rounded-lg p-3 hover:bg-orange-50 transition-colors cursor-pointer"
          {...getAwayTeamLogoRootProps()}
        >
          <input {...getAwayTeamLogoInputProps()} />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CloudUpload className="h-5 w-5 text-orange-300 mr-2" />
              <p className="text-sm text-sky-900/70">
                {ticketInfo.awayTeamLogo
                  ? "Logo uploaded! Click to change"
                  : "Upload away team logo"}
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
  );
}
