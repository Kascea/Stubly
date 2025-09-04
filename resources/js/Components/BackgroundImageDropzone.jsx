import React, { useEffect, useRef } from "react";
import { Button } from "@/Components/ui/button";
import {
  CloudUpload,
  X,
  RotateCcw,
  Clipboard,
  RotateCw,
  RefreshCw,
} from "lucide-react";
import DraggableZoomableImage from "@/Components/DraggableZoomableImage";

export default function BackgroundImageDropzone({
  backgroundImage,
  backgroundImagePosition = { x: 0, y: 0 },
  backgroundImageScale = 1,
  backgroundImageRotation = 0,
  onImageChange,
  onPositionChange,
  onScaleChange,
  onRotationChange,
  onRemoveImage,
  onResetTransform,
  getRootProps,
  getInputProps,
}) {
  const dropzoneRef = useRef(null);

  // Handle clipboard paste
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file && onImageChange) {
            const reader = new FileReader();
            reader.onloadend = () => {
              onImageChange(reader.result, file.name);
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    }
  };

  // Add global paste event listener when dropzone is focused
  useEffect(() => {
    const handleGlobalPaste = (e) => {
      // Only handle paste if the dropzone is in view and no input is focused
      if (
        !document.activeElement ||
        document.activeElement.tagName === "BODY"
      ) {
        handlePaste(e);
      }
    };

    document.addEventListener("paste", handleGlobalPaste);
    return () => {
      document.removeEventListener("paste", handleGlobalPaste);
    };
  }, [onImageChange]);
  if (backgroundImage) {
    return (
      <div className="space-y-4">
        {/* Interactive Preview */}
        <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-medium text-sky-900">
              Background Image Preview
            </h5>
            <button
              type="button"
              onClick={onRemoveImage}
              className="text-xs bg-red-50 border border-red-200 rounded-full px-3 py-1 text-red-500 hover:text-red-600 hover:bg-red-100 flex items-center transition-colors"
            >
              <X className="h-3 w-3 mr-1" />
              Remove
            </button>
          </div>

          <div className="flex justify-center">
            <div
              className="relative border-2 border-dashed border-orange-200 rounded-lg bg-orange-50/30 overflow-hidden"
              style={{ width: "280px", height: "180px" }}
            >
              <img
                src={backgroundImage}
                alt="Background preview"
                className="absolute inset-0 w-full h-full object-contain"
                style={{
                  transform: `translate(${backgroundImagePosition.x}px, ${backgroundImagePosition.y}px) scale(${backgroundImageScale}) rotate(${backgroundImageRotation}deg)`,
                  transformOrigin: "center center",
                }}
                crossOrigin="anonymous"
              />
              <DraggableZoomableImage
                src={backgroundImage}
                alt="Background preview"
                position={{
                  x: backgroundImagePosition.x,
                  y: backgroundImagePosition.y,
                }}
                scale={backgroundImageScale}
                rotation={backgroundImageRotation}
                onPositionChange={onPositionChange}
                onScaleChange={onScaleChange}
                onRotationChange={onRotationChange}
                enabled={true}
                style={{ opacity: 0 }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-sky-700">Drag • Scroll • Right-click</p>
            <div className="flex space-x-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onRotationChange?.((backgroundImageRotation - 90 + 360) % 360)
                }
                className="text-xs border-orange-200 text-orange-600 hover:bg-orange-50 px-2 py-1"
                title="Rotate image 90° left"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onRotationChange?.((backgroundImageRotation + 90) % 360)
                }
                className="text-xs border-orange-200 text-orange-600 hover:bg-orange-50 px-2 py-1"
                title="Rotate image 90° right"
              >
                <RotateCw className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onResetTransform}
                className="text-xs border-gray-200 text-gray-600 hover:bg-gray-50 px-2 py-1"
                title="Reset position, scale, and rotation"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-1">
            Drag, scale, and rotate your background image
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={dropzoneRef}
      className="border-2 border-dashed border-orange-200 rounded-lg p-6 hover:bg-orange-50 transition-colors cursor-pointer flex flex-col items-center justify-center"
      {...getRootProps()}
      style={{ minHeight: "180px" }}
      onPaste={handlePaste}
      tabIndex={0}
    >
      <input {...getInputProps()} />
      <div className="bg-orange-100 rounded-full p-4 mb-3">
        <CloudUpload className="h-8 w-8 text-orange-500" />
      </div>
      <p className="text-sm font-medium text-sky-900 mb-1">
        Upload Background Image
      </p>
      <p className="text-xs text-sky-900/70 text-center max-w-xs">
        Drag and drop an image here, click to select from your device, or paste
        from clipboard
      </p>
      <div className="flex items-center justify-center mt-3 space-x-4">
        <p className="text-xs text-gray-500">Supports: JPG, PNG (Max 20MB)</p>
        <div className="flex items-center text-xs text-gray-500">
          <Clipboard className="h-3 w-3 mr-1" />
          Ctrl+V to paste
        </div>
      </div>
    </div>
  );
}
