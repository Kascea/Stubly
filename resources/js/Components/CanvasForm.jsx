import React, { useState, useCallback, useEffect } from "react";
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
  X,
  CloudUpload,
  Palette,
  MapPin,
  Calendar,
  LayoutGrid,
  Image,
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
import { useDropzone } from "react-dropzone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

export default function CanvasForm({
  ticketInfo,
  setTicketInfo,
  ticketRef,
  categories = [],
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Initialize with provided categories
  useEffect(() => {
    if (categories && categories.length > 0) {
      // Set default category
      const defaultCategory = categories[0];
      setSelectedCategory(defaultCategory.id);
      setTemplates(defaultCategory.templates);

      // Set default template if none selected
      if (defaultCategory.templates.length > 0 && !ticketInfo.template) {
        setTicketInfo((prev) => ({
          ...prev,
          template: defaultCategory.templates[0].id,
          template_id: defaultCategory.templates[0].id,
        }));
      }
    }
  }, [categories]);

  // Update templates when category changes
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setTemplates(category.templates);

      // Set default template for this category
      if (category.templates.length > 0) {
        setTicketInfo((prev) => ({
          ...prev,
          template: category.templates[0].id,
          template_id: category.templates[0].id,
          // Clear background image if new template doesn't support it
          backgroundImage: category.templates[0].supports_background_image
            ? prev.backgroundImage
            : null,
        }));
      }
    }
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
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
    },
    [setTicketInfo]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateTimeChange = (name, value) => {
    setTicketInfo((prev) => ({ ...prev, [name]: value }));
  };

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
            if (node.nodeType === 3 || node.nodeType === 1) {
              return true;
            }
            return false;
          },
        });

        const ticketData = {
          eventName: ticketInfo.eventName,
          eventLocation: ticketInfo.eventLocation,
          date: ticketInfo.date,
          time: ticketInfo.time,
          section: ticketInfo.section,
          row: ticketInfo.row,
          seat: ticketInfo.seat,
          generatedTicket: dataUrl,
          template: ticketInfo.template || "modern",
          template_id: ticketInfo.template_id,
        };

        const response = await axios.post(route("tickets.store"), ticketData);
        const ticket = response.data.ticket;

        if (ticket) {
          window.location.href = route("tickets.preview", {
            ticket: ticket.ticket_id,
          });
        }

        setStatus("success");
        setSuccessMessage("Ticket created successfully!");
      } catch (error) {
        console.error("Failed to create ticket:", error);
        setStatus("error");
        setErrorMessage(
          error.response?.data?.message || "Failed to create ticket"
        );
      } finally {
        setIsGenerating(false);
        setTimeout(() => {
          setStatus(null);
          setErrorMessage("");
          setSuccessMessage("");
        }, 3000);
      }
    }
  };

  // Get the current template object
  const currentTemplate = templates.find((t) => t.id === ticketInfo.template);
  const supportsBackgroundImage =
    currentTemplate?.supports_background_image || false;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
      <div className="space-y-2">
        {/* SECTION: Category Selection */}
        <div className="pb-4 border-b border-gray-100">
          <div className="flex items-center mb-2 text-sky-900">
            <Palette className="h-4 w-4 mr-2 text-orange-500" />
            <h3 className="text-base font-semibold">Choose a Category</h3>
          </div>

          <Tabs
            defaultValue={selectedCategory}
            onValueChange={handleCategoryChange}
            className="w-full"
          >
            <TabsList className="w-full">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex-1"
                >
                  {category.id}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {category.templates.map((template) => (
                    <div
                      key={template.id}
                      className={`border rounded-md p-2 cursor-pointer transition-all ${
                        ticketInfo.template === template.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                      onClick={() =>
                        setTicketInfo((prev) => ({
                          ...prev,
                          template: template.id,
                          template_id: template.id,
                          backgroundImage: !template.supports_background_image
                            ? null
                            : prev.backgroundImage,
                        }))
                      }
                    >
                      <div className="aspect-[16/9] bg-gray-100 rounded mb-2">
                        {/* No thumbnail available in the data */}
                      </div>
                      <div className="text-sm font-medium text-center">
                        {template.id}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* SECTION: Event Details */}
        <div className="py-4 border-b border-gray-100">
          <div className="flex items-center mb-2 text-sky-900">
            <Calendar className="h-4 w-4 mr-2 text-orange-500" />
            <h3 className="text-base font-semibold">Event Details</h3>
          </div>

          <div className="space-y-3">
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

        {/* SECTION: Seating Details */}
        <div className="py-4 border-b border-gray-100">
          <div className="flex items-center mb-2 text-sky-900">
            <LayoutGrid className="h-4 w-4 mr-2 text-orange-500" />
            <h3 className="text-base font-semibold">Seating Details</h3>
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

        {/* SECTION: Background Image - Only for templates that support it */}
        {supportsBackgroundImage && (
          <div className="py-4 border-b border-gray-100">
            <div className="flex items-center mb-2 text-sky-900">
              <Image className="h-4 w-4 mr-2 text-orange-500" />
              <h3 className="text-base font-semibold">Background Image</h3>
            </div>

            <div
              className="border-2 border-dashed border-orange-200 rounded-lg p-4 text-center hover:bg-orange-50 transition-colors cursor-pointer"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <CloudUpload className="h-8 w-8 text-orange-300" />
                <p className="mt-1 text-sm text-sky-900/70">
                  {ticketInfo.backgroundImage
                    ? "Image uploaded! Click to change"
                    : "Drag and drop an image, or click to select"}
                </p>

                {ticketInfo.backgroundImage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTicketInfo((prev) => ({
                        ...prev,
                        backgroundImage: null,
                      }));
                    }}
                    className="mt-1 text-xs text-orange-500 hover:text-orange-600 flex items-center"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove image
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: Action Buttons */}
        <div className="pt-2">
          <Button
            onClick={generateTicket}
            disabled={isGenerating}
            className="w-full bg-sky-900 hover:bg-sky-800 text-white py-6 text-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Your Ticket...
              </>
            ) : (
              <>
                <TicketPlus className="mr-2 h-5 w-5" />
                Create Your Ticket
              </>
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {status === "success" && (
          <Alert className="mt-4 bg-green-50 border-green-200 text-green-800">
            <Check className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert className="mt-4 bg-red-50 border-red-200 text-red-800">
            <X className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
