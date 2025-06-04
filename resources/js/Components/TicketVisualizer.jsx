import React, { forwardRef } from "react";

import SportsVerticalTemplate from "@/Components/Templates/Sports/SportsVerticalTemplate";

const TicketTemplate = forwardRef(
  ({ ticketInfo, containerWidth, containerHeight }, ref) => {
    // Organized by category with vertical and horizontal options
    const templates = {
      // Sports templates
      "sports-vertical": SportsVerticalTemplate,
    };

    const Template =
      templates[ticketInfo.template] || templates["sports-vertical"];

    return (
      <div className="flex items-center justify-center w-full h-full">
        <Template
          ref={ref}
          ticketInfo={ticketInfo}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
        />
      </div>
    );
  },
);

TicketTemplate.displayName = "TicketTemplate";

export default TicketTemplate;
