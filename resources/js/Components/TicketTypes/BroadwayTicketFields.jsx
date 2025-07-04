import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Clapperboard } from "lucide-react";

export default function BroadwayTicketFields({ ticketInfo, setTicketInfo }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="py-3 border-b border-gray-100">
      <div className="flex items-center mb-2 text-sky-900">
        <Clapperboard className="h-4 w-4 mr-2 text-orange-500" />
        <h3 className="text-base font-semibold">Broadway Information</h3>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="playName" className="text-sky-900">
            Play Name
          </Label>
          <Input
            id="playName"
            name="playName"
            value={ticketInfo.playName || ""}
            onChange={handleChange}
            placeholder="Name of the play or musical"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="theaterName" className="text-sky-900">
            Theater Name
          </Label>
          <Input
            id="theaterName"
            name="theaterName"
            value={ticketInfo.theaterName || ""}
            onChange={handleChange}
            placeholder="Name of the theater"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
