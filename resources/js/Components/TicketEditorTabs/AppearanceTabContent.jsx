import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Palette, Image, CloudUpload, X } from "lucide-react";

export default function AppearanceTabContent({
  supportsBackgroundImage,
  ticketInfo,
  setTicketInfo,
  getRootProps,
  getInputProps,
  selectedCategory,
  handleChange,
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Palette className="h-6 w-6 text-orange-500" />
        <h3 className="font-medium text-lg text-sky-900">Appearance Options</h3>
      </div>

      <div className="bg-sky-50/50 rounded-lg p-3 text-sm text-sky-800 border-l-4 border-sky-500">
        <p>
          Customize the appearance of your ticket with these style options. All
          appearance settings are optional.
        </p>
      </div>

      {/* Background Image Section */}
      {supportsBackgroundImage && (
        <div className="space-y-4 border-b border-gray-100 pb-6">
          <h4 className="text-sm font-medium text-sky-900 flex items-center">
            <Image className="h-4 w-4 mr-2 text-orange-500" />
            Background Image
            <span className="text-gray-500 text-xs font-medium ml-2">
              Optional
            </span>
          </h4>

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
                  Drag and drop an image here, or click to select from your
                  device
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  Supports: JPG, PNG, GIF (Max 5MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Style Options Section - only for sports */}
      {selectedCategory === "sports" && (
        <div className="space-y-4 pt-2">
          <h4 className="text-sm font-medium text-sky-900 flex items-center">
            <Palette className="h-4 w-4 mr-2 text-orange-500" />
            Color Options
            <span className="text-gray-500 text-xs font-medium ml-2">
              Optional
            </span>
          </h4>

          <div>
            <Label htmlFor="accentColor" className="text-sky-900 font-medium">
              Accent Color
            </Label>
            <div className="flex items-center mt-2 space-x-3">
              <div className="relative">
                <Input
                  id="accentColor"
                  name="accentColor"
                  type="color"
                  value={ticketInfo.accentColor || "#0c4a6e"}
                  onChange={handleChange}
                  className="w-12 h-12 p-1 rounded-md cursor-pointer border-gray-300"
                />
                <div className="absolute inset-0 pointer-events-none rounded-md border border-gray-300"></div>
              </div>
              <Input
                name="accentColor"
                value={ticketInfo.accentColor || "#0c4a6e"}
                onChange={handleChange}
                className="flex-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This color will be used for accents and highlights on your ticket.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
