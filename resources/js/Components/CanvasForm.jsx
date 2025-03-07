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
  Users,
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
  isAuthenticated = false,
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
        console.log(
          "Setting default template:",
          defaultCategory.templates[0].id
        );
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

  // Main dropzone for background image
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

  // Home team logo dropzone
  const onHomeTeamLogoDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setTicketInfo((prev) => ({
            ...prev,
            homeTeamLogo: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    },
    [setTicketInfo]
  );

  // Away team logo dropzone
  const onAwayTeamLogoDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setTicketInfo((prev) => ({
            ...prev,
            awayTeamLogo: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    },
    [setTicketInfo]
  );

  // Main dropzone for background image
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
  });

  // Home team logo dropzone
  const {
    getRootProps: getHomeTeamLogoRootProps,
    getInputProps: getHomeTeamLogoInputProps,
  } = useDropzone({
    onDrop: onHomeTeamLogoDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
  });

  // Away team logo dropzone
  const {
    getRootProps: getAwayTeamLogoRootProps,
    getInputProps: getAwayTeamLogoInputProps,
  } = useDropzone({
    onDrop: onAwayTeamLogoDrop,
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
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      window.location.href = route("login");
      return;
    }

    if (ticketRef.current) {
      setIsGenerating(true);
      setStatus(null);
      setErrorMessage("");
      try {
        const dataUrl = await domToPng(ticketRef.current, {
          quality: 4.0,
          scale: 4,
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

  // Get template thumbnail based on template ID
  const getTemplateThumbnail = (templateId) => {
    try {
      // First check if the template has a specific thumbnail path
      const template = templates.find((t) => t.id === templateId);
      if (template && template.thumbnail_path) {
        return template.thumbnail_path;
      }

      // Use a consistent path structure for all thumbnails
      return `/images/thumbnails/${templateId}.jpg`;
    } catch (e) {
      console.error("Error loading thumbnail:", e);
      return null; // Return null instead of a default path that might not exist
    }
  };

  // Handle thumbnail loading errors
  const handleThumbnailError = (e) => {
    e.target.onerror = null; // Prevent infinite error loop

    // Use inline SVG as fallback instead of trying to load another image
    e.target.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Crect width='100' height='60' fill='%23f3f4f6'/%3E%3Ctext x='50' y='30' font-family='Arial' font-size='10' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'%3ENo Preview%3C/text%3E%3C/svg%3E";
  };

  // Format template name for display
  const formatTemplateName = (templateId) => {
    return templateId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
      <div className="space-y-2">
        {/* SECTION: Category Selection */}
        <div className="pb-3 border-b border-gray-100">
          <div className="flex items-center mb-2 text-sky-900">
            <Palette className="h-4 w-4 mr-2 text-orange-500" />
            <h3 className="text-base font-semibold">Choose a Template</h3>
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
                      <div className="aspect-video bg-gray-100 rounded mb-1 overflow-hidden">
                        {getTemplateThumbnail(template.id) ? (
                          <img
                            src={getTemplateThumbnail(template.id)}
                            alt={formatTemplateName(template.id)}
                            className="w-full h-full object-cover"
                            onError={handleThumbnailError}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-xs">
                            {formatTemplateName(template.id)}
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-medium text-center">
                        {formatTemplateName(template.id)}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* SECTION: Event Details - 2 column layout */}
        <div className="py-3 border-b border-gray-100">
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
        <div className="py-3 border-b border-gray-100">
          <div className="flex items-center mb-2 text-sky-900">
            <LayoutGrid className="h-4 w-4 mr-2 text-orange-500" />
            <h3 className="text-base font-semibold">Seating Details</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
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

        {/* NEW SECTION: Team Information */}
        <div className="py-3 border-b border-gray-100">
          <div className="flex items-center mb-2 text-sky-900">
            <Users className="h-4 w-4 mr-2 text-orange-500" />
            <h3 className="text-base font-semibold">Team Information</h3>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="homeTeam" className="text-sky-900">
                  Home Team
                </Label>
                <Input
                  id="homeTeam"
                  name="homeTeam"
                  value={ticketInfo.homeTeam || ""}
                  onChange={handleChange}
                  placeholder="Home Team Name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="awayTeam" className="text-sky-900">
                  Away Team
                </Label>
                <Input
                  id="awayTeam"
                  name="awayTeam"
                  value={ticketInfo.awayTeam || ""}
                  onChange={handleChange}
                  placeholder="Away Team Name"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sky-900 block mb-1">
                  Home Team Logo
                </Label>
                <div
                  className="border border-dashed border-orange-200 rounded-lg p-3 hover:bg-orange-50 transition-colors cursor-pointer"
                  {...getHomeTeamLogoRootProps()}
                >
                  <input {...getHomeTeamLogoInputProps()} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CloudUpload className="h-5 w-5 text-orange-300 mr-2" />
                      <p className="text-sm text-sky-900/70">
                        {ticketInfo.homeTeamLogo
                          ? "Logo uploaded! Click to change"
                          : "Upload home team logo"}
                      </p>
                    </div>

                    {ticketInfo.homeTeamLogo && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTicketInfo((prev) => ({
                            ...prev,
                            homeTeamLogo: null,
                          }));
                        }}
                        className="text-sm text-orange-500 hover:text-orange-600 flex items-center"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sky-900 block mb-1">
                  Away Team Logo
                </Label>
                <div
                  className="border border-dashed border-orange-200 rounded-lg p-3 hover:bg-orange-50 transition-colors cursor-pointer"
                  {...getAwayTeamLogoRootProps()}
                >
                  <input {...getAwayTeamLogoInputProps()} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CloudUpload className="h-5 w-5 text-orange-300 mr-2" />
                      <p className="text-sm text-sky-900/70">
                        {ticketInfo.awayTeamLogo
                          ? "Logo uploaded! Click to change"
                          : "Upload away team logo"}
                      </p>
                    </div>

                    {ticketInfo.awayTeamLogo && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTicketInfo((prev) => ({
                            ...prev,
                            awayTeamLogo: null,
                          }));
                        }}
                        className="text-sm text-orange-500 hover:text-orange-600 flex items-center"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NEW SECTION: Divider Color */}
        <div className="py-3 border-b border-gray-100">
          <div className="flex items-center mb-2 text-sky-900">
            <Palette className="h-4 w-4 mr-2 text-orange-500" />
            <h3 className="text-base font-semibold">Ticket Style</h3>
          </div>

          <div>
            <Label htmlFor="dividerColor" className="text-sky-900">
              Divider Color
            </Label>
            <div className="flex items-center mt-1">
              <Input
                id="dividerColor"
                name="dividerColor"
                type="color"
                value={ticketInfo.dividerColor || "#f97316"}
                onChange={handleChange}
                className="w-12 h-8 p-0 mr-2"
              />
              <Input
                name="dividerColor"
                value={ticketInfo.dividerColor || "#f97316"}
                onChange={handleChange}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* SECTION: Background Image - Only for templates that support it */}
        {supportsBackgroundImage && (
          <div className="py-3 border-b border-gray-100">
            <div className="flex items-center mb-2 text-sky-900">
              <Image className="h-4 w-4 mr-2 text-orange-500" />
              <h3 className="text-base font-semibold">Background Image</h3>
            </div>

            <div
              className="border border-dashed border-orange-200 rounded-lg p-3 hover:bg-orange-50 transition-colors cursor-pointer"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CloudUpload className="h-5 w-5 text-orange-300 mr-2" />
                  <p className="text-sm text-sky-900/70">
                    {ticketInfo.backgroundImage
                      ? "Image uploaded! Click to change"
                      : "Drag and drop an image, or click to select"}
                  </p>
                </div>

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
                    className="text-sm text-orange-500 hover:text-orange-600 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
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
            className="w-full bg-sky-900 hover:bg-sky-800 text-white py-4 text-base"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Your Ticket...
              </>
            ) : (
              <>
                <TicketPlus className="mr-2 h-5 w-5" />
                {isAuthenticated
                  ? "Create Your Ticket"
                  : "Sign In to Create Ticket"}
              </>
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {status === "success" && (
          <Alert className="mt-2 bg-green-50 border-green-200 text-green-800">
            <Check className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert className="mt-2 bg-red-50 border-red-200 text-red-800">
            <X className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
