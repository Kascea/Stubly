import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Music } from "lucide-react";

export default function ConcertTicketFields({ ticketInfo, setTicketInfo }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="py-3 border-b border-gray-100">
      <div className="flex items-center mb-2 text-sky-900">
        <Music className="h-4 w-4 mr-2 text-orange-500" />
        <h3 className="text-base font-semibold">Concert Information</h3>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="artist" className="text-sky-900">
            Artist/Band
          </Label>
          <Input
            id="artist"
            name="artist"
            value={ticketInfo.artist || ""}
            onChange={handleChange}
            placeholder="Artist or Band Name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="tourName" className="text-sky-900">
            Tour Name
          </Label>
          <Input
            id="tourName"
            name="tourName"
            value={ticketInfo.tourName || ""}
            onChange={handleChange}
            placeholder="Tour Name"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
