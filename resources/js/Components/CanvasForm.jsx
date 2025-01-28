import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { DateTimePicker } from "@/Components/ui/datetimepicker";
import {
  ArrowDown,
  Check,
  Loader2,
  Printer,
  Download,
  CreditCard,
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

  const handleDownload = () => {
    window.location.href = route("tickets.download", {
      ticket: ticketInfo.ticketId,
    });
  };

  const handlePurchase = () => {
    window.location.href = route("payment.checkout", {
      ticket: ticketInfo.ticketId,
    });
  };

  const generateTicket = async () => {
    if (ticketRef.current) {
      setIsGenerating(true);
      setStatus(null);
      setErrorMessage("");
      try {
        const dataUrl = await domToPng(ticketRef.current, {
          quality: 1.0,
          scale: 2,
          backgroundColor: null,
          skipFonts: false,
          filter: (node) => {
            return node.nodeType === 1;
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
        <div>
          <Label>Template Style</Label>
          <Select
            value={ticketInfo.template || "modern"}
            onValueChange={(value) =>
              handleChange({ target: { name: "template", value } })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {ticketInfo.template === "modern" && (
          <div className="relative group">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                ticketInfo.backgroundImage
                  ? "bg-sky-50/50 border-sky-300"
                  : "bg-sky-50 border-sky-200 hover:border-sky-300"
              }`}
            >
              {ticketInfo.backgroundImage ? (
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center mb-2">
                    <Check className="h-5 w-5 text-sky-600" />
                  </div>
                  <span className="text-sm text-sky-700">Image uploaded</span>
                  {ticketInfo.filename && (
                    <span className="text-xs text-sky-600 mt-1 truncate max-w-[200px]">
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
          </div>
        )}

        <div>
          <Label htmlFor="eventName">Event Name</Label>
          <Input
            id="eventName"
            name="eventName"
            value={ticketInfo.eventName || ""}
            onChange={handleChange}
            placeholder="Enter event name"
          />
        </div>

        <div>
          <Label>Event Location</Label>
          <Input
            id="eventLocation"
            name="eventLocation"
            value={ticketInfo.eventLocation || ""}
            onChange={handleChange}
            placeholder="Enter event location"
          />
        </div>

        <div>
          <Label>Date and Time</Label>
          <DateTimePicker
            initialDate={ticketInfo.date}
            initialTime={ticketInfo.time}
            onDateChange={(value) => handleDateTimeChange("date", value)}
            onTimeChange={(value) => handleDateTimeChange("time", value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="section">Section</Label>
            <Input
              id="section"
              name="section"
              value={ticketInfo.section || ""}
              onChange={handleChange}
              placeholder="Section"
            />
          </div>
          <div>
            <Label htmlFor="row">Row</Label>
            <Input
              id="row"
              name="row"
              value={ticketInfo.row || ""}
              onChange={handleChange}
              placeholder="Row"
            />
          </div>
          <div>
            <Label htmlFor="seat">Seat</Label>
            <Input
              id="seat"
              name="seat"
              value={ticketInfo.seat || ""}
              onChange={handleChange}
              placeholder="Seat"
            />
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

        <div className="space-y-3">
          <Button
            onClick={generateTicket}
            disabled={isGenerating}
            className="w-full bg-sky-900 hover:bg-sky-800 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {ticketInfo.ticketId ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{ticketInfo.ticketId ? "Update Ticket" : "Create Ticket"}</>
            )}
          </Button>

          {ticketInfo.ticketId && (
            <Button
              onClick={ticketInfo.isPaid ? handleDownload : handlePurchase}
              className="w-full border-sky-900 text-sky-900 hover:bg-sky-50"
              variant="outline"
            >
              {ticketInfo.isPaid ? (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Ticket
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Purchase Ticket
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
