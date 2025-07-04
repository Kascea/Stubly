import React from "react";
import { Users, Music, Clapperboard } from "lucide-react";
import SportsTicketFields from "@/Components/TicketTypes/SportsTicketFields";
import ConcertTicketFields from "@/Components/TicketTypes/ConcertTicketFields";
import BroadwayTicketFields from "@/Components/TicketTypes/BroadwayTicketFields";

export default function CategoryTabContent({
  selectedCategory,
  ticketInfo,
  setTicketInfo,
  getHomeTeamLogoRootProps,
  getHomeTeamLogoInputProps,
  getAwayTeamLogoRootProps,
  getAwayTeamLogoInputProps,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        {selectedCategory === "sports" ? (
          <Users className="h-6 w-6 text-orange-500" />
        ) : selectedCategory === "concerts" ? (
          <Music className="h-6 w-6 text-orange-500" />
        ) : (
          <Clapperboard className="h-6 w-6 text-orange-500" />
        )}
        <h3 className="font-medium text-lg text-sky-900">
          {selectedCategory === "sports"
            ? "Team Information"
            : selectedCategory === "concerts"
            ? "Artist Information"
            : "Show Information"}
        </h3>
      </div>

      <div className="bg-sky-50/50 rounded-lg p-3 text-sm text-sky-800 border-l-4 border-sky-500">
        <p>
          {selectedCategory === "sports"
            ? "Add details about the teams playing in this event."
            : selectedCategory === "concerts"
            ? "Add information about the artist or performers."
            : "Add details about the Broadway show and theater."}
        </p>
        <p className="mt-2 font-medium">
          {selectedCategory === "sports"
            ? "Team names are required, logos are optional."
            : selectedCategory === "concerts"
            ? "Artist name is required."
            : "Play name and theater name are required."}
        </p>
      </div>

      <div className="space-y-4">
        {selectedCategory === "sports" ? (
          <SportsTicketFields
            ticketInfo={ticketInfo}
            setTicketInfo={setTicketInfo}
            getHomeTeamLogoRootProps={getHomeTeamLogoRootProps}
            getHomeTeamLogoInputProps={getHomeTeamLogoInputProps}
            getAwayTeamLogoRootProps={getAwayTeamLogoRootProps}
            getAwayTeamLogoInputProps={getAwayTeamLogoInputProps}
            showRequiredLabels={true}
          />
        ) : selectedCategory === "concerts" ? (
          <ConcertTicketFields
            ticketInfo={ticketInfo}
            setTicketInfo={setTicketInfo}
            showRequiredLabels={true}
          />
        ) : selectedCategory === "broadway" ? (
          <BroadwayTicketFields
            ticketInfo={ticketInfo}
            setTicketInfo={setTicketInfo}
            showRequiredLabels={true}
          />
        ) : null}
      </div>
    </div>
  );
}
