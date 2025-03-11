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
              {/* Templates Tab - Now First */}
              {activeTab === "templates" && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg text-sky-900">
                    Choose a Template
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sky-900 mb-2 block">
                        Category
                      </Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.id.charAt(0).toUpperCase() +
                                category.id.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sky-900 mb-2 block">
                        Template
                      </Label>
                      <div className="grid grid-cols-1 gap-2">
                        {templates.map((template) => (
                          <button
                            key={template.id}
                            className={`flex items-center p-3 rounded-md transition-all ${
                              ticketInfo.template === template.id
                                ? "bg-orange-50 border border-orange-500 text-sky-900"
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
                              <div className="font-medium">
                                {formatTemplateName(template.id)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {template.supports_background_image
                                  ? "Supports custom background"
                                  : "Fixed background"}
                              </div>
                            </div>
                            {ticketInfo.template === template.id && (
                              <Check className="h-5 w-5 text-orange-500" />
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
                <div className="space-y-4">
                  <h3 className="font-medium text-lg text-sky-900">
                    Event Details
                  </h3>
                  <div>
                    <Label htmlFor="eventName" className="text-sky-900">
                      Event Name
                    </Label>
                    <Input
                      id="eventName"
                      name="eventName"
                      value={ticketInfo.eventName || ""}
                      onChange={handleChange}
                      placeholder="Enter event name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="eventLocation" className="text-sky-900">
                      Event Location
                    </Label>
                    <Input
                      id="eventLocation"
                      name="eventLocation"
                      value={ticketInfo.eventLocation || ""}
                      onChange={handleChange}
                      placeholder="Enter event location"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sky-900">Date & Time</Label>
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
              )}

              {/* Category-specific Content */}
              {activeTab === "category" && (
                <div>
                  <h3 className="font-medium text-lg text-sky-900 mb-4">
                    {selectedCategory === "sports"
                      ? "Team Information"
                      : "Artist Information"}
                  </h3>
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
              )}

              {/* Background Image */}
              {activeTab === "background" && supportsBackgroundImage && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg text-sky-900">
                    Background Image
                  </h3>
                  <div
                    className="border-2 border-dashed border-orange-200 rounded-lg p-4 hover:bg-orange-50 transition-colors cursor-pointer flex flex-col items-center justify-center"
                    {...getRootProps()}
                    style={{ minHeight: "150px" }}
                  >
                    <input {...getInputProps()} />
                    {ticketInfo.backgroundImage ? (
                      <div className="text-center">
                        <img
                          src={ticketInfo.backgroundImage}
                          alt="Background preview"
                          className="max-h-24 mx-auto mb-2 rounded"
                        />
                        <p className="text-xs text-sky-900/70">
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
                          className="mt-1 text-xs text-orange-500 hover:text-orange-600 flex items-center mx-auto"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <CloudUpload className="h-8 w-8 text-orange-300 mb-2" />
                        <p className="text-xs text-sky-900/70 text-center">
                          Drag and drop an image here, or click to select
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Style Tab */}
              {activeTab === "style" && selectedCategory === "sports" && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg text-sky-900">
                    Style Options
                  </h3>
                  <div>
                    <Label htmlFor="dividerColor" className="text-sky-900">
                      Divider Color
                    </Label>
                    <div className="flex items-center mt-1">
                      <Input
                        id="dividerColor"
                        name="dividerColor"
                        type="color"
                        value={ticketInfo.dividerColor || "#0c4a6e"}
                        onChange={handleChange}
                        className="w-10 h-8 p-0 mr-2"
                      />
                      <Input
                        name="dividerColor"
                        value={ticketInfo.dividerColor || "#0c4a6e"}
                        onChange={handleChange}
                        className="flex-1"
                      />
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
