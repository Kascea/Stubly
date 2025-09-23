import React from "react";
import { Type } from "lucide-react";
import SubtitleFields from "@/Components/SubtitleFields";

export default function CategoryTabContent({ ticketInfo, setTicketInfo }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Type className="h-6 w-6 text-orange-500" />
        <h3 className="font-medium text-lg text-sky-900">
          Additional Information
        </h3>
      </div>

      <div className="bg-sky-50/50 rounded-lg p-3 text-sm text-sky-800 border-l-4 border-sky-500">
        <p>
          Add any additional information that you'd like to appear on your
          ticket.
        </p>
        <p className="mt-2 font-medium">
          This could include artist names, team matchups, show titles, or any
          other relevant details.
        </p>
      </div>

      <div className="space-y-4">
        <SubtitleFields
          ticketInfo={ticketInfo}
          setTicketInfo={setTicketInfo}
          showRequiredLabels={true}
        />
      </div>
    </div>
  );
}
