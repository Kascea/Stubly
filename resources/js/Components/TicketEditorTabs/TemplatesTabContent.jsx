import React from "react";
import { Label } from "@/Components/ui/label";
import { LayoutGrid, Image, Check } from "lucide-react";

export default function TemplatesTabContent({
  templates,
  ticketInfo,
  setTicketInfo,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <LayoutGrid className="h-6 w-6 text-orange-500" />
        <h3 className="font-medium text-lg text-sky-900">Choose a Template</h3>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="text-sky-900 mb-2 block font-medium">
            Select Template Style
          </Label>
          <div className="mb-3 text-xs text-sky-700 bg-sky-50 p-2 rounded border-l-2 border-sky-200">
            Template controls the visual design - colors, fonts, layout, and
            overall appearance of your ticket
          </div>
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
                  <div className="font-medium text-base">{template.name}</div>
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
