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

              {/* Active indicator dot for collapsed state */}
              {!isPanelExpanded && activeTab === tab.id && (
                <div className="absolute right-2 top-2 w-2 h-2 rounded-full bg-orange-500"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content panel when expanded */}
        {isPanelExpanded ? (
          <div className="bg-white transition-all duration-300 ease-in-out overflow-y-auto flex-1 relative w-96">
            {/* Collapse button */}
            <button
              className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors z-10"
              onClick={() => setIsPanelExpanded(false)}
              title="Collapse panel"
            >
              <ChevronLeft className="h-4 w-4 transition-transform duration-200" />
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
                      <div className="grid grid-cols-2 gap-3">
                        {templates.map((template) => (
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
                                backgroundImage:
                                  !template.supports_background_image
                                    ? null
                                    : prev.backgroundImage,
                              }))
                            }
                          >
                            <div className="aspect-w-16 aspect-h-9 mb-2 bg-gray-100 rounded overflow-hidden">
                              <img
                                src={`/images/thumbnails/${template.id}.jpg`}
                                alt={formatTemplateName(template.id)}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Crect width='100' height='60' fill='%23f3f4f6'/%3E%3Ctext x='50' y='30' font-family='Arial' font-size='10' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'%3ENo Preview%3C/text%3E%3C/svg%3E";
                                }}
                              />
                            </div>
                            <div className="text-sm text-center text-sky-900">
                              {formatTemplateName(template.id)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Details Tab - Now Second */}
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="date" className="text-sky-900">
                        Date
                      </Label>
                      <DateTimePicker
                        date={ticketInfo.date}
                        setDate={(date) =>
                          setTicketInfo((prev) => ({ ...prev, date }))
                        }
                        className="mt-1"
                        showTimePicker={false}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-sky-900">
                        Time
                      </Label>
                      <DateTimePicker
                        date={ticketInfo.time}
                        setDate={(time) =>
                          setTicketInfo((prev) => ({ ...prev, time }))
                        }
                        className="mt-1"
                        showDatePicker={false}
                      />
                    </div>
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
          /* Minimal expand button when collapsed */
          <button
            className="w-6 h-12 bg-gray-100 hover:bg-gray-200 flex items-center justify-center rounded-r-md absolute left-20 top-1/2 transform -translate-y-1/2 transition-colors border border-l-0 border-gray-200"
            onClick={() => setIsPanelExpanded(true)}
            title="Expand panel"
          >
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}
