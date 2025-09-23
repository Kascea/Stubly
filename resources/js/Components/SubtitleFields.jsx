import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Type } from "lucide-react";

export default function SubtitleFields({
  ticketInfo,
  setTicketInfo,
  showRequiredLabels = false,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-sky-50/30 rounded-lg p-4 border border-sky-100">
        <div className="flex items-center mb-3">
          <Type className="h-4 w-4 text-sky-700 mr-2" />
          <h4 className="text-sm font-medium text-sky-900">
            Subtitle Information
          </h4>
          {showRequiredLabels && (
            <span className="text-orange-500 text-xs font-medium ml-2">
              Optional
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="subtitle" className="text-sky-900 text-sm">
              Subtitle
            </Label>
            <Input
              id="subtitle"
              name="subtitle"
              value={ticketInfo.subtitle || ""}
              onChange={handleChange}
              placeholder="Enter a subtitle for your ticket (e.g., artist name, team names, show title)"
              className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add any additional information like artist names, team matchups,
              or show details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
