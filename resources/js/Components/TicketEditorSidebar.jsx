import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { DateTimePicker } from "@/Components/ui/datetimepicker";
import {
  Loader2,
  TicketPlus,
  X,
  CloudUpload,
  Palette,
  MapPin,
  Calendar,
  LayoutGrid,
  Image,
  Users,
  Music,
  Settings,
  Type,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { domToPng } from "modern-screenshot";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

// Import ticket type components
import SportsTicketFields from "@/Components/TicketTypes/SportsTicketFields";
import ConcertTicketFields from "@/Components/TicketTypes/ConcertTicketFields";

export default function TicketEditorSidebar({
  ticketInfo,
  setTicketInfo,
  ticketRef,
  categories = [],
  isAuthenticated = false,
}) {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("templates");
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);

  // Initialize with provided categories
  React.useEffect(() => {
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

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Add this function to handle date and time changes separately
  const handleDateTimeChange = (name, value) => {
    setTicketInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Main dropzone for background image
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
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
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: false,
  });

  // Home team logo dropzone
  const {
    getRootProps: getHomeTeamLogoRootProps,
    getInputProps: getHomeTeamLogoInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
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
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: false,
  });

  // Away team logo dropzone
  const {
    getRootProps: getAwayTeamLogoRootProps,
    getInputProps: getAwayTeamLogoInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
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
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: false,
  });

  // Get the current template object
  const currentTemplate = templates.find((t) => t.id === ticketInfo.template);
  const supportsBackgroundImage =
    currentTemplate?.supports_background_image || false;

  // Format template name for display
  const formatTemplateName = (templateId) => {
    return templateId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Define the tabs - reordered with templates first
  const tabs = [
    {
      id: "templates",
      label: "Templates",
      icon: <LayoutGrid className="h-5 w-5" />,
    },
    {
      id: "details",
      label: "Details",
      icon: <Type className="h-5 w-5" />,
    },
    {
      id: "category",
      label:
        selectedCategory === "sports"
          ? "Teams"
          : selectedCategory === "concerts"
          ? "Artist"
          : "Info",
      icon:
        selectedCategory === "sports" ? (
          <Users className="h-5 w-5" />
        ) : (
          <Music className="h-5 w-5" />
        ),
    },
    ...(supportsBackgroundImage
      ? [
          {
            id: "background",
            label: "Background",
            icon: <Image className="h-5 w-5" />,
          },
        ]
      : []),
    ...(selectedCategory === "sports"
      ? [
          {
            id: "style",
            label: "Style",
            icon: <Palette className="h-5 w-5" />,
          },
        ]
      : []),
  ];

  // Handle tab click - now also expands the panel if collapsed
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (!isPanelExpanded) {
      setIsPanelExpanded(true);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full transition-all duration-300 ease-in-out",
        isPanelExpanded ? "w-128" : "w-20"
      )}
    >
      {/* Main content area with tabs and panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Vertical tabs */}
        <div className="flex flex-col bg-gray-50 border-r border-gray-200 w-20 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "flex flex-col items-center justify-center py-4 px-2 transition-colors relative",
                activeTab === tab.id
                  ? "bg-orange-50 text-orange-600 border-r-2 border-orange-500"
                  : "text-gray-500 hover:bg-gray-100"
              )}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content panel when expanded */}
        {isPanelExpanded ? (
          <div className="bg-white transition-all duration-300 ease-in-out overflow-y-auto flex-1 relative w-96">
            {/* Collapse button - moved to top right */}
            <button
              className="w-8 h-8 bg-white hover:bg-orange-50 flex items-center justify-center rounded-bl-md absolute right-0 top-0 transition-colors border-l border-b border-gray-200 shadow-sm z-10"
              onClick={() => setIsPanelExpanded(false)}
              title="Collapse panel"
            >
              <ChevronLeft className="h-5 w-5 text-orange-500" />
            </button>

            <div className="p-4">
              {/* Templates Tab */}
              {activeTab === "templates" && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <LayoutGrid className="h-6 w-6 text-orange-500" />
                    <h3 className="font-medium text-lg text-sky-900">
                      Choose a Template
                    </h3>
                  </div>

                  <div className="bg-sky-50/50 rounded-lg p-3 text-sm text-sky-800 border-l-4 border-sky-500">
                    <p>
                      Select a template that best fits your event. Each template
                      offers unique features and layouts.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <Label className="text-sky-900 mb-2 block font-medium flex items-center">
                        <span className="bg-sky-100 text-sky-800 p-1 rounded-md mr-2 text-xs">
                          STEP 1
                        </span>
                        Select Category
                      </Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger className="w-full border-gray-300 focus:ring-orange-500 focus:border-orange-500">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center">
                                {category.id === "sports" ? (
                                  <Users className="h-4 w-4 mr-2 text-orange-500" />
                                ) : (
                                  <Music className="h-4 w-4 mr-2 text-orange-500" />
                                )}
                                {category.id.charAt(0).toUpperCase() +
                                  category.id.slice(1)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sky-900 mb-2 block font-medium flex items-center">
                        <span className="bg-sky-100 text-sky-800 p-1 rounded-md mr-2 text-xs">
                          STEP 2
                        </span>
                        Choose Template
                      </Label>
                      <div className="grid grid-cols-1 gap-3">
                        {templates.map((template) => (
                          <button
                            key={template.id}
                            className={`flex items-center p-4 rounded-lg transition-all ${
                              ticketInfo.template === template.id
                                ? "bg-orange-50 border border-orange-500 text-sky-900 shadow-sm"
                                : "bg-white border border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50/50"
                            }`}
                            onClick={() =>
                              setTicketInfo((prev) => ({
                                ...prev,
                                template: template.id,
                                template_id: template.id,
                                backgroundImage:
                                  !template.supports_background_image
                                    ? null
                                    : prev.backgroundImage,
                              }))
                            }
                          >
                            <div className="flex-1 text-left">
                              <div className="font-medium text-base">
                                {formatTemplateName(template.id)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 flex items-center">
                                {template.supports_background_image ? (
                                  <>
                                    <Image className="h-3 w-3 mr-1 text-orange-400" />
                                    Supports custom background
                                  </>
                                ) : (
                                  <>
                                    <Image className="h-3 w-3 mr-1 text-gray-400" />
                                    Fixed background
                                  </>
                                )}
                              </div>
                            </div>
                            {ticketInfo.template === template.id && (
                              <div className="bg-orange-500 rounded-full p-1">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Type className="h-6 w-6 text-orange-500" />
                    <h3 className="font-medium text-lg text-sky-900">
                      Event Details
                    </h3>
                  </div>

                  <div className="bg-sky-50/50 rounded-lg p-3 text-sm text-sky-800 border-l-4 border-sky-500">
                    <p>
                      Add information about your event. These details will
                      appear on your ticket.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <Label
                        htmlFor="eventName"
                        className="text-sky-900 font-medium flex items-center"
                      >
                        <span className="bg-sky-100 text-sky-800 p-1 rounded-md mr-2 text-xs">
                          EVENT
                        </span>
                        Event Name
                      </Label>
                      <Input
                        id="eventName"
                        name="eventName"
                        value={ticketInfo.eventName || ""}
                        onChange={handleChange}
                        placeholder="Enter event name"
                        className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="eventLocation"
                        className="text-sky-900 font-medium flex items-center"
                      >
                        <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                        Event Location
                      </Label>
                      <Input
                        id="eventLocation"
                        name="eventLocation"
                        value={ticketInfo.eventLocation || ""}
                        onChange={handleChange}
                        placeholder="Enter event location"
                        className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <Label className="text-sky-900 font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-orange-500" />
                        Date & Time
                      </Label>
                      <div className="mt-1 border border-gray-300 rounded-md overflow-hidden">
                        <DateTimePicker
                          initialDate={ticketInfo.date}
                          initialTime={ticketInfo.time}
                          onDateChange={(value) =>
                            handleDateTimeChange("date", value)
                          }
                          onTimeChange={(value) =>
                            handleDateTimeChange("time", value)
                          }
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-sky-900 mb-3">
                        Seating Information
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label
                            htmlFor="section"
                            className="text-sky-900 text-xs"
                          >
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
                          <Label
                            htmlFor="seat"
                            className="text-sky-900 text-xs"
                          >
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
              )}

              {/* Category-specific Content */}
              {activeTab === "category" && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    {selectedCategory === "sports" ? (
                      <Users className="h-6 w-6 text-orange-500" />
                    ) : (
                      <Music className="h-6 w-6 text-orange-500" />
                    )}
                    <h3 className="font-medium text-lg text-sky-900">
                      {selectedCategory === "sports"
                        ? "Team Information"
                        : "Artist Information"}
                    </h3>
                  </div>

                  <div className="bg-sky-50/50 rounded-lg p-3 text-sm text-sky-800 border-l-4 border-sky-500">
                    <p>
                      {selectedCategory === "sports"
                        ? "Add details about the teams playing in this event."
                        : "Add information about the artist or performers."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {selectedCategory === "sports" ? (
                      <SportsTicketFields
                        ticketInfo={ticketInfo}
                        setTicketInfo={setTicketInfo}
                        getHomeTeamLogoRootProps={getHomeTeamLogoRootProps}
                        getHomeTeamLogoInputProps={getHomeTeamLogoInputProps}
                        getAwayTeamLogoRootProps={getAwayTeamLogoRootProps}
                        getAwayTeamLogoInputProps={getAwayTeamLogoInputProps}
                      />
                    ) : selectedCategory === "concerts" ? (
                      <ConcertTicketFields
                        ticketInfo={ticketInfo}
                        setTicketInfo={setTicketInfo}
                      />
                    ) : null}
                  </div>
                </div>
              )}

              {/* Background Image */}
              {activeTab === "background" && supportsBackgroundImage && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Image className="h-6 w-6 text-orange-500" />
                    <h3 className="font-medium text-lg text-sky-900">
                      Background Image
                    </h3>
                  </div>

                  <div className="bg-sky-50/50 rounded-lg p-3 text-sm text-sky-800 border-l-4 border-sky-500">
                    <p>
                      Add a custom background image to personalize your ticket.
                      For best results, use a high-resolution image.
                    </p>
                  </div>

                  <div
                    className="border-2 border-dashed border-orange-200 rounded-lg p-6 hover:bg-orange-50 transition-colors cursor-pointer flex flex-col items-center justify-center"
                    {...getRootProps()}
                    style={{ minHeight: "180px" }}
                  >
                    <input {...getInputProps()} />
                    {ticketInfo.backgroundImage ? (
                      <div className="text-center">
                        <div className="bg-white p-2 rounded-lg shadow-sm mb-3 inline-block">
                          <img
                            src={ticketInfo.backgroundImage}
                            alt="Background preview"
                            className="max-h-32 mx-auto rounded"
                          />
                        </div>
                        <p className="text-xs text-sky-900/70 mb-2">
                          Click or drag to replace
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTicketInfo((prev) => ({
                              ...prev,
                              backgroundImage: null,
                            }));
                          }}
                          className="mt-1 text-xs bg-white border border-orange-200 rounded-full px-3 py-1 text-orange-500 hover:text-orange-600 hover:bg-orange-50 flex items-center mx-auto transition-colors"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="bg-orange-100 rounded-full p-4 mb-3">
                          <CloudUpload className="h-8 w-8 text-orange-500" />
                        </div>
                        <p className="text-sm font-medium text-sky-900 mb-1">
                          Upload Background Image
                        </p>
                        <p className="text-xs text-sky-900/70 text-center max-w-xs">
                          Drag and drop an image here, or click to select from
                          your device
                        </p>
                        <p className="text-xs text-gray-500 mt-3">
                          Supports: JPG, PNG, GIF (Max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Style Tab */}
              {activeTab === "style" && selectedCategory === "sports" && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Palette className="h-6 w-6 text-orange-500" />
                    <h3 className="font-medium text-lg text-sky-900">
                      Style Options
                    </h3>
                  </div>

                  <div className="bg-sky-50/50 rounded-lg p-3 text-sm text-sky-800 border-l-4 border-sky-500">
                    <p>
                      Customize the appearance of your ticket with these style
                      options.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <Label
                        htmlFor="dividerColor"
                        className="text-sky-900 font-medium"
                      >
                        Divider Color
                      </Label>
                      <div className="flex items-center mt-2 space-x-3">
                        <div className="relative">
                          <Input
                            id="dividerColor"
                            name="dividerColor"
                            type="color"
                            value={ticketInfo.dividerColor || "#0c4a6e"}
                            onChange={handleChange}
                            className="w-12 h-12 p-1 rounded-md cursor-pointer border-gray-300"
                          />
                          <div className="absolute inset-0 pointer-events-none rounded-md border border-gray-300"></div>
                        </div>
                        <Input
                          name="dividerColor"
                          value={ticketInfo.dividerColor || "#0c4a6e"}
                          onChange={handleChange}
                          className="flex-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        This color will be used for dividers and accents on your
                        ticket.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Expand button - moved to top left */
          <button
            className="w-8 h-8 bg-white hover:bg-orange-50 flex items-center justify-center rounded-br-md absolute left-20 top-0 transition-colors border-r border-b border-gray-200 shadow-sm"
            onClick={() => setIsPanelExpanded(true)}
            title="Expand panel"
          >
            <ChevronRight className="h-5 w-5 text-orange-500" />
          </button>
        )}
      </div>
    </div>
  );
}
