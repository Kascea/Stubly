import React, { useState } from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import { ScrollArea, ScrollBar } from "@/Components/ui/scroll-area";

export function DateTimePicker({ onDateChange, onTimeChange, initialDate = null, initialTime = null }) {
  // We'll manage both date and time in the component's state
  const [selectedDateTime, setSelectedDateTime] = useState(initialDate || initialTime || null);
  const [isOpen, setIsOpen] = useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      // Preserve the existing time when setting a new date
      const newDateTime = new Date(selectedDate);
      if (selectedDateTime) {
        newDateTime.setHours(selectedDateTime.getHours());
        newDateTime.setMinutes(selectedDateTime.getMinutes());
      }
      setSelectedDateTime(newDateTime);
      onDateChange(newDateTime);
      onTimeChange(newDateTime);
    }
  };

  const handleTimeChange = (type, value) => {
    if (selectedDateTime) {
      const newDateTime = new Date(selectedDateTime);
      
      switch (type) {
        case "hour":
          // Preserve AM/PM when setting hours
          const currentPeriod = newDateTime.getHours() >= 12 ? 12 : 0;
          newDateTime.setHours((parseInt(value) % 12) + currentPeriod);
          break;
        case "minute":
          newDateTime.setMinutes(parseInt(value));
          break;
        case "ampm":
          const currentHours = newDateTime.getHours();
          const shouldBePM = value === "PM";
          const isPM = currentHours >= 12;
          
          if (shouldBePM !== isPM) {
            newDateTime.setHours((currentHours + 12) % 24);
          }
          break;
      }
      
      setSelectedDateTime(newDateTime);
      onTimeChange(newDateTime);
    }
  };

  // Helper functions to check selected states
  const isHourSelected = (hour) => {
    if (!selectedDateTime) return false;
    return selectedDateTime.getHours() % 12 === hour % 12;
  };

  const isMinuteSelected = (minute) => {
    if (!selectedDateTime) return false;
    return selectedDateTime.getMinutes() === minute;
  };

  const isPeriodSelected = (period) => {
    if (!selectedDateTime) return false;
    return period === "AM" ? selectedDateTime.getHours() < 12 : selectedDateTime.getHours() >= 12;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal border border-slate-200 bg-white hover:bg-slate-50",
            "focus-visible:ring-1 focus-visible:ring-orange-400 focus-visible:border-orange-400",
            !selectedDateTime && "text-slate-500"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDateTime ? format(selectedDateTime, "MM/dd/yyyy hh:mm aa") : <span>Select date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={selectedDateTime}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x border-l border-slate-200">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={isHourSelected(hour) ? "default" : "ghost"}
                    className={cn(
                      "sm:w-full shrink-0 aspect-square",
                      isHourSelected(hour) && "bg-sky-900 text-white hover:bg-sky-800"
                    )}
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={isMinuteSelected(minute) ? "default" : "ghost"}
                    className={cn(
                      "sm:w-full shrink-0 aspect-square",
                      isMinuteSelected(minute) && "bg-sky-900 text-white hover:bg-sky-800"
                    )}
                    onClick={() => handleTimeChange("minute", minute.toString())}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea>
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((period) => (
                  <Button
                    key={period}
                    size="icon"
                    variant={isPeriodSelected(period) ? "default" : "ghost"}
                    className={cn(
                      "sm:w-full shrink-0 aspect-square",
                      isPeriodSelected(period) && "bg-sky-900 text-white hover:bg-sky-800"
                    )}
                    onClick={() => handleTimeChange("ampm", period)}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}