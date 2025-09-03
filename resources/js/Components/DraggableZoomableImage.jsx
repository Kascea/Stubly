import React, { useState, useRef, useEffect, useCallback } from "react";

const DraggableZoomableImage = ({
  src,
  alt = "Background",
  className = "",
  style = {},
  position = { x: 0, y: 0 },
  scale = 1,
  rotation = 0,
  onPositionChange,
  onScaleChange,
  onRotationChange,
  enabled = true,
  crossOrigin = "anonymous",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Handle mouse down for dragging
  const handleMouseDown = useCallback(
    (e) => {
      if (!enabled) return;

      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setInitialPosition(position);
    },
    [enabled, position]
  );

  // Handle mouse move during drag
  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !enabled) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const newPosition = {
        x: initialPosition.x + deltaX,
        y: initialPosition.y + deltaY,
      };

      onPositionChange?.(newPosition);
    },
    [isDragging, enabled, dragStart, initialPosition, onPositionChange]
  );

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle wheel for zooming
  const handleWheel = useCallback(
    (e) => {
      if (!enabled) return;

      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newScale = Math.max(0.5, Math.min(3, scale + delta));
      onScaleChange?.(newScale);
    },
    [enabled, scale, onScaleChange]
  );

  // Handle right-click for rotation
  const handleContextMenu = useCallback(
    (e) => {
      if (!enabled) return;

      e.preventDefault();
      const newRotation = (rotation + 90) % 360;
      onRotationChange?.(newRotation);
    },
    [enabled, rotation, onRotationChange]
  );

  // Touch event handlers for mobile support
  const handleTouchStart = useCallback(
    (e) => {
      if (!enabled) return;

      e.preventDefault();
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX, y: touch.clientY });
      setInitialPosition(position);
    },
    [enabled, position]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging || !enabled) return;

      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;

      const newPosition = {
        x: initialPosition.x + deltaX,
        y: initialPosition.y + deltaY,
      };

      onPositionChange?.(newPosition);
    },
    [isDragging, enabled, dragStart, initialPosition, onPositionChange]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global event listeners for mouse events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  // Add wheel event listener to container
  useEffect(() => {
    const container = containerRef.current;
    if (container && enabled) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }
  }, [handleWheel, enabled]);

  const transform = `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${
        enabled ? "cursor-move" : ""
      }`}
      style={style}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-contain transition-transform ${
          enabled ? "select-none" : ""
        } ${className}`}
        style={{
          transform,
          transformOrigin: "center center",
        }}
        crossOrigin={crossOrigin}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onContextMenu={handleContextMenu}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default DraggableZoomableImage;
