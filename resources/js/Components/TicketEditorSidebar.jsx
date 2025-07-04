import { useState, useEffect } from "react";
import {
  Palette,
  MapPin,
  Calendar,
  LayoutGrid,
  Image,
  Users,
  Music,
  Clapperboard,
  Type,
  ChevronRight,
  ChevronLeft,
  Check,
  Eye,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

// Import tab content components
import TemplatesTabContent from "@/Components/TicketEditorTabs/TemplatesTabContent";
import DetailsTabContent from "@/Components/TicketEditorTabs/DetailsTabContent";
import CategoryTabContent from "@/Components/TicketEditorTabs/CategoryTabContent";
import AppearanceTabContent from "@/Components/TicketEditorTabs/AppearanceTabContent";

export default function TicketEditorSidebar({
  ticketInfo,
  setTicketInfo,
  categories = [],
  onToggleExpand,
  isMobile = false,
}) {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("templates");
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);

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
      "image/*": [".jpeg", ".jpg", ".png"],
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
          : selectedCategory === "broadway"
          ? "Show"
          : "Info",
      icon:
        selectedCategory === "sports" ? (
          <Users className="h-5 w-5" />
        ) : selectedCategory === "concerts" ? (
          <Music className="h-5 w-5" />
        ) : selectedCategory === "broadway" ? (
          <Clapperboard className="h-5 w-5" />
        ) : (
          <Users className="h-5 w-5" />
        ),
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: <Palette className="h-5 w-5" />,
    },
  ];

  // Handle tab click - now also expands the panel if collapsed
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (!isPanelExpanded) {
      setIsPanelExpanded(true);
    }
  };

  // Update parent component when sidebar expansion changes
  const handlePanelExpansion = (expanded) => {
    setIsPanelExpanded(expanded);
    if (onToggleExpand) {
      onToggleExpand(expanded);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col transition-all duration-300 ease-in-out",
        isMobile && isPanelExpanded
          ? "fixed inset-0 z-30 bg-white" // Full screen on mobile when expanded
          : "h-full",
        !isMobile && isPanelExpanded ? "w-128" : "w-20"
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
                  ? "text-sky-900 border-r-2 border-orange-400"
                  : "text-gray-500 hover:text-orange-400 hover:border-r-2 hover:border-gray-300"
              )}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.icon}
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content panel when expanded */}
        {isPanelExpanded ? (
          <div className="bg-white transition-all duration-300 ease-in-out overflow-y-auto flex-1 relative w-96 border-r border-gray-100 shadow-sm">
            {/* Mobile header with close button */}
            {isMobile && (
              <div className="sticky top-0 bg-white border-b border-gray-100 p-3 flex items-center justify-between z-10">
                <h2 className="text-lg font-medium text-sky-900">
                  Edit Ticket
                </h2>
                <button
                  className="p-2 text-gray-500 hover:text-orange-500 rounded-full hover:bg-gray-50"
                  onClick={() => handlePanelExpansion(false)}
                >
                  <Eye className="h-5 w-5" />
                  <span className="sr-only">Preview Ticket</span>
                </button>
              </div>
            )}

            {/* Collapse button - only show on desktop */}
            {!isMobile && (
              <button
                className="w-8 h-8 bg-white hover:bg-orange-50 flex items-center justify-center rounded-bl-md absolute right-0 top-0 transition-colors border-l border-b border-gray-200 shadow-sm z-50"
                onClick={() => handlePanelExpansion(false)}
                title="Collapse panel"
              >
                <ChevronLeft className="h-5 w-5 text-orange-500" />
              </button>
            )}

            <div className={isMobile ? "p-4 pb-24" : "p-4"}>
              {/* Templates Tab */}
              {activeTab === "templates" && (
                <TemplatesTabContent
                  selectedCategory={selectedCategory}
                  handleCategoryChange={handleCategoryChange}
                  categories={categories}
                  templates={templates}
                  ticketInfo={ticketInfo}
                  setTicketInfo={setTicketInfo}
                  formatTemplateName={formatTemplateName}
                />
              )}

              {/* Details Tab */}
              {activeTab === "details" && (
                <DetailsTabContent
                  ticketInfo={ticketInfo}
                  handleChange={handleChange}
                  handleDateTimeChange={handleDateTimeChange}
                />
              )}

              {/* Category-specific Content */}
              {activeTab === "category" && (
                <CategoryTabContent
                  selectedCategory={selectedCategory}
                  ticketInfo={ticketInfo}
                  setTicketInfo={setTicketInfo}
                  getHomeTeamLogoRootProps={getHomeTeamLogoRootProps}
                  getHomeTeamLogoInputProps={getHomeTeamLogoInputProps}
                  getAwayTeamLogoRootProps={getAwayTeamLogoRootProps}
                  getAwayTeamLogoInputProps={getAwayTeamLogoInputProps}
                />
              )}

              {/* Background Image and Style combined into Appearance Tab */}
              {activeTab === "appearance" && (
                <AppearanceTabContent
                  supportsBackgroundImage={supportsBackgroundImage}
                  ticketInfo={ticketInfo}
                  setTicketInfo={setTicketInfo}
                  getRootProps={getRootProps}
                  getInputProps={getInputProps}
                  selectedCategory={selectedCategory}
                  handleChange={handleChange}
                />
              )}
            </div>
          </div>
        ) : (
          /* Expand button - only show on desktop */
          !isMobile && (
            <button
              className="w-8 h-8 bg-white hover:bg-orange-50 flex items-center justify-center rounded-br-md fixed left-20 top-16 transition-colors border-r border-b border-gray-200 shadow-sm z-50"
              onClick={() => handlePanelExpansion(true)}
              title="Expand panel"
            >
              <ChevronRight className="h-5 w-5 text-orange-500" />
            </button>
          )
        )}
      </div>

      {/* Mobile bottom bar with expand button - only show when collapsed */}
      {isMobile && !isPanelExpanded && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-center z-20">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            onClick={() => handlePanelExpansion(true)}
          >
            <span>Edit Ticket</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
