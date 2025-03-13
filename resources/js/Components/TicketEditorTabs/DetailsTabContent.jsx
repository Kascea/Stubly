import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { DateTimePicker } from "@/Components/ui/datetimepicker";
import { Type, MapPin, Calendar } from "lucide-react";

export default function DetailsTabContent({
  ticketInfo,
  handleChange,
  handleDateTimeChange,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Type className="h-6 w-6 text-orange-500" />
        <h3 className="font-medium text-lg text-sky-900">Event Details</h3>
      </div>

      <div className="bg-sky-50/50 rounded-lg p-3 text-sm text-sky-800 border-l-4 border-sky-500">
        <p>
          Add information about your event. These details will appear on your
          ticket.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <Label
            htmlFor="eventName"
            className="text-sky-900 font-medium flex items-center justify-between"
          >
            <div className="flex items-center">
              <span className="bg-sky-100 text-sky-800 p-1 rounded-md mr-2 text-xs">
                EVENT
              </span>
              Event Name
            </div>
            <span className="text-orange-500 text-xs font-medium">
              Required
            </span>
          </Label>
          <Input
            id="eventName"
            name="eventName"
            value={ticketInfo.eventName || ""}
            onChange={handleChange}
            placeholder="Enter event name"
            className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <Label
            htmlFor="eventLocation"
            className="text-sky-900 font-medium flex items-center justify-between"
          >
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-orange-500" />
              Event Location
            </div>
            <span className="text-orange-500 text-xs font-medium">
              Required
            </span>
          </Label>
          <Input
            id="eventLocation"
            name="eventLocation"
            value={ticketInfo.eventLocation || ""}
            onChange={handleChange}
            placeholder="Enter event location"
            className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <Label className="text-sky-900 font-medium flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-orange-500" />
              Date & Time
            </div>
            <span className="text-orange-500 text-xs font-medium">
              Required
            </span>
          </Label>
          <div className="mt-1 border border-gray-300 rounded-md overflow-hidden">
            <DateTimePicker
              initialDate={ticketInfo.date}
              initialTime={ticketInfo.time}
              onDateChange={(value) => handleDateTimeChange("date", value)}
              onTimeChange={(value) => handleDateTimeChange("time", value)}
              required
            />
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <h4 className="text-sm font-medium text-sky-900 mb-3 flex items-center justify-between">
            <span>Seating Information</span>
            <span className="text-gray-500 text-xs font-medium">Optional</span>
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="section" className="text-sky-900 text-xs">
                Section
              </Label>
              <Input
                id="section"
                name="section"
                value={ticketInfo.section || ""}
                onChange={handleChange}
                placeholder="Section"
                className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <Label htmlFor="row" className="text-sky-900 text-xs">
                Row
              </Label>
              <Input
                id="row"
                name="row"
                value={ticketInfo.row || ""}
                onChange={handleChange}
                placeholder="Row"
                className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <Label htmlFor="seat" className="text-sky-900 text-xs">
                Seat
              </Label>
              <Input
                id="seat"
                name="seat"
                value={ticketInfo.seat || ""}
                onChange={handleChange}
                placeholder="Seat"
                className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
