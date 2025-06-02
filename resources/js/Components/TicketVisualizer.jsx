import React, { forwardRef } from "react";

import SportsVerticalTemplate from "@/Components/Templates/Sports/SportsVerticalTemplate";
import SportsHorizontalTemplate from "@/Components/Templates/Sports/SportsHorizontalTemplate";
import ConcertsVerticalTemplate from "@/Components/Templates/Concerts/ConcertsVerticalTemplate";
import ConcertsHorizontalTemplate from "@/Components/Templates/Concerts/ConcertsHorizontalTemplate";

const TicketTemplate = forwardRef(
  ({ ticketInfo, containerWidth, containerHeight }, ref) => {
    // Organized by category with vertical and horizontal options
    const templates = {
      // Sports templates
      "sports-vertical": SportsVerticalTemplate,
      "sports-horizontal": SportsHorizontalTemplate,

      // Concerts templates
      "concerts-vertical": ConcertsVerticalTemplate,
      "concerts-horizontal": ConcertsHorizontalTemplate,
    };

    const Template =
      templates[ticketInfo.template] || templates["sports-vertical"];

    // Determine if this is a horizontal template
    const isHorizontal = ticketInfo.template?.includes("horizontal");

    return (
      <div className="flex items-center justify-center w-full h-full">
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            maxWidth: isHorizontal ? "100%" : containerWidth || "auto",
            maxHeight: containerHeight || "auto",
          }}
        >
          <Template
            ref={ref}
            ticketInfo={ticketInfo}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            isHorizontal={isHorizontal}
          />
        </div>
      </div>
    );
  },
);

TicketTemplate.displayName = "TicketTemplate";

export default TicketTemplate;
