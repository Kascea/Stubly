import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { DateTimePicker } from "@/Components/ui/datetimepicker";
import {
  ArrowDown,
  Check,
  Loader2,
  CreditCard,
  TicketPlus,
} from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { domToPng } from "modern-screenshot";
import axios from "axios";
import { router } from "@inertiajs/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

export default function CanvasForm({ ticketInfo, setTicketInfo, ticketRef }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTicketInfo((prev) => ({
          ...prev,
          backgroundImage: reader.result,
          filename: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateTimeChange = (name, value) => {
    setTicketInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePurchase = () => {
    window.location.href = route("payment.checkout", {
      ticket: ticketInfo.ticketId,
    });
  };

  // In your CanvasForm.jsx
  const generateTicket = async () => {
    if (ticketRef.current) {
      setIsGenerating(true);
      setStatus(null);
      setErrorMessage("");
      try {
        const dataUrl = await domToPng(ticketRef.current, {
          quality: 4.0,
          scale: 2,
          backgroundColor: null,
          skipFonts: false,
          filter: (node) => {
            // Ensure text nodes are included
            if (node.nodeType === 3 || node.nodeType === 1) {
              // Text node
              return true;
            }
            return false;
          },
        });

        const ticketData = {
          ticketId: ticketInfo.ticketId,
          eventName: ticketInfo.eventName,
          eventLocation: ticketInfo.eventLocation,
          date: ticketInfo.date,
          time: ticketInfo.time,
          section: ticketInfo.section,
          row: ticketInfo.row,
          seat: ticketInfo.seat,
          backgroundImage: ticketInfo.backgroundImage,
          generatedTicket: dataUrl,
          filename: ticketInfo.filename,
          template: ticketInfo.template || "modern",
        };

        const response = await axios.post(route("tickets.store"), ticketData);
        const ticket = response.data.ticket;

        if (!ticketInfo.ticketId && ticket) {
          router.visit(route("canvas", { ticket: ticket.ticket_id }), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
          });
          setTicketInfo((prev) => ({
            ...prev,
            ticketId: ticket.ticket_id,
          }));
        }

        setStatus("success");
      } catch (error) {
        console.error("Failed to save ticket:", error);
        setStatus("error");
        setErrorMessage(
          error.response?.data?.message || "Failed to save ticket"
        );
      } finally {
        setIsGenerating(false);
        setTimeout(() => {
          setStatus(null);
          setErrorMessage("");
        }, 3000);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
      <div className="space-y-6">
        {/* Template Selection */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-sky-900">
            Choose Your Style
          </h3>
          <p className="text-sm text-sky-900/70 mb-4">
            Select a template that matches your event's vibe
          </p>
          <Select
            value={ticketInfo.template || "modern"}
            onValueChange={(value) =>
              setTicketInfo((prev) => ({ ...prev, template: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern & Clean</SelectItem>
              <SelectItem value="classic">Classic & Elegant</SelectItem>
              <SelectItem value="creative">Creative & Unique</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Background Image Upload */}
        <div className="space-y-2">
          <p className="text-sm text-sky-900/70 mb-4">
            Add a background image to make your ticket pop
          </p>
          <Label htmlFor="image" className="sr-only">
            Background Image
          </Label>
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Label htmlFor="image" className="cursor-pointer block">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                ticketInfo.backgroundImage
                  ? "bg-sky-50/50 border-sky-300 hover:border-sky-400"
                  : "bg-sky-50 border-sky-200 hover:border-sky-300"
              }`}
            >
              {ticketInfo.backgroundImage ? (
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center mb-2">
                    <Check className="h-5 w-5 text-sky-900/70" />
                  </div>
                  <span className="text-sm text-sky-700">Image uploaded</span>
                  {ticketInfo.filename && (
                    <span className="text-xs text-sky-900/70 mt-1 truncate max-w-[200px]">
                      {ticketInfo.filename}
                    </span>
                  )}
                  <span className="text-xs text-sky-500 mt-1">
                    Click to change
                  </span>
                </div>
              ) : (
                <>
                  <ArrowDown className="mx-auto h-8 w-8 text-sky-500 mb-2" />
                  <span className="text-sm text-sky-700">
                    Upload Background Image
                  </span>
                </>
              )}
            </div>
          </Label>
        </div>

        {/* Event Details */}
        <div className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventName" className="text-sky-900">
                Event Name
              </Label>
              <Input
                id="eventName"
                name="eventName"
                value={ticketInfo.eventName || ""}
                onChange={handleChange}
                placeholder="What's the occasion?"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="eventLocation" className="text-sky-900">
                Location
              </Label>
              <Input
                id="eventLocation"
                name="eventLocation"
                value={ticketInfo.eventLocation || ""}
                onChange={handleChange}
                placeholder="Where's it happening?"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sky-900">Date & Time</Label>
              <DateTimePicker
                initialDate={ticketInfo.date}
                initialTime={ticketInfo.time}
                onDateChange={(value) => handleDateTimeChange("date", value)}
                onTimeChange={(value) => handleDateTimeChange("time", value)}
              />
            </div>
          </div>
        </div>

        {/* Seating Details */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-sky-900">
              Seating Details
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="section" className="text-sky-900">
                Section
              </Label>
              <Input
                id="section"
                name="section"
                value={ticketInfo.section || ""}
                onChange={handleChange}
                placeholder="Section"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="row" className="text-sky-900">
                Row
              </Label>
              <Input
                id="row"
                name="row"
                value={ticketInfo.row || ""}
                onChange={handleChange}
                placeholder="Row"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="seat" className="text-sky-900">
                Seat
              </Label>
              <Input
                id="seat"
                name="seat"
                value={ticketInfo.seat || ""}
                onChange={handleChange}
                placeholder="Seat"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {status && (
          <Alert variant={status}>
            <AlertDescription variant={status}>
              {status === "success"
                ? `Ticket ${
                    ticketInfo.ticketId ? "updated" : "created"
                  } successfully!`
                : errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={generateTicket}
            disabled={isGenerating}
            className="w-full bg-sky-900 hover:bg-sky-800 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {ticketInfo.ticketId
                  ? "Saving Changes..."
                  : "Creating Your Ticket..."}
              </>
            ) : (
              <>
                {ticketInfo.ticketId ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <TicketPlus className="mr-2 h-4 w-4" />
                    Create Your Ticket
                  </>
                )}
              </>
            )}
          </Button>

          {ticketInfo.ticketId && !ticketInfo.isPaid && (
            <Button
              onClick={handlePurchase}
              className="w-full bg-orange-400 hover:bg-orange-500 text-white"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Purchase This Design
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
