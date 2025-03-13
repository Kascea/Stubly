import React from "react";
import { Label } from "@/Components/ui/label";
import { LayoutGrid, Image, Check, Users, Music } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

export default function TemplatesTabContent({
  selectedCategory,
  handleCategoryChange,
  categories,
  templates,
  ticketInfo,
  setTicketInfo,
  formatTemplateName,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <LayoutGrid className="h-6 w-6 text-orange-500" />
        <h3 className="font-medium text-lg text-sky-900">Choose a Template</h3>
      </div>

      <div className="bg-sky-50/50 rounded-lg p-3 text-sm text-sky-800 border-l-4 border-sky-500">
        <p>
          Select a template that best fits your event. Each template offers
          unique features and layouts.
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
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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
                    {category.id.charAt(0).toUpperCase() + category.id.slice(1)}
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
                    backgroundImage: !template.supports_background_image
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
  );
}
