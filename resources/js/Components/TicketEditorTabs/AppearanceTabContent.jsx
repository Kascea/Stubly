import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Palette, Image } from "lucide-react";
import BackgroundImageDropzone from "@/Components/BackgroundImageDropzone";

export default function AppearanceTabContent({
  supportsBackgroundImage,
  ticketInfo,
  setTicketInfo,
  getRootProps,
  getInputProps,
  selectedCategory,
  handleChange,
  onImageChange,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Palette className="h-6 w-6 text-orange-500" />
        <h3 className="font-medium text-lg text-sky-900">Appearance Options</h3>
      </div>

      {/* Background Image Section */}
      {supportsBackgroundImage && (
        <div className="space-y-3 border-b border-gray-100 pb-4">
          <h4 className="text-sm font-medium text-sky-900 flex items-center">
            <Image className="h-4 w-4 mr-2 text-orange-500" />
            Background Image
            <span className="text-gray-500 text-xs font-medium ml-2">
              Optional
            </span>
          </h4>

          <BackgroundImageDropzone
            backgroundImage={ticketInfo.backgroundImage}
            backgroundImagePosition={ticketInfo.backgroundImagePosition}
            backgroundImageScale={ticketInfo.backgroundImageScale}
            backgroundImageRotation={ticketInfo.backgroundImageRotation}
            onImageChange={onImageChange}
            onPositionChange={(newPosition) => {
              setTicketInfo((prev) => ({
                ...prev,
                backgroundImagePosition: newPosition,
              }));
            }}
            onScaleChange={(newScale) => {
              setTicketInfo((prev) => ({
                ...prev,
                backgroundImageScale: newScale,
              }));
            }}
            onRotationChange={(newRotation) => {
              setTicketInfo((prev) => ({
                ...prev,
                backgroundImageRotation: newRotation,
              }));
            }}
            onRemoveImage={() => {
              setTicketInfo((prev) => ({
                ...prev,
                backgroundImage: null,
                backgroundImagePosition: { x: 0, y: 0 },
                backgroundImageScale: 1,
                backgroundImageRotation: 0,
              }));
            }}
            onResetTransform={() => {
              setTicketInfo((prev) => ({
                ...prev,
                backgroundImagePosition: { x: 0, y: 0 },
                backgroundImageScale: 1,
                backgroundImageRotation: 0,
              }));
            }}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />
        </div>
      )}

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
                value={ticketInfo.accentColor || "#000000"}
                onChange={handleChange}
                className="w-12 h-12 p-1 rounded-md cursor-pointer border-gray-300"
              />
              <div className="absolute inset-0 pointer-events-none rounded-md border border-gray-300"></div>
            </div>
            <Input
              name="accentColor"
              value={ticketInfo.accentColor || "#000000"}
              onChange={handleChange}
              className="flex-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This color will be used for accents and highlights on your ticket.
          </p>
        </div>
      </div>
    </div>
  );
}
