import React, { forwardRef } from "react";

import SportsVerticalTemplate from "@/Components/Templates/Sports/SportsVerticalTemplate";
import SportsHorizontalTemplate from "@/Components/Templates/Sports/SportsHorizontalTemplate";
import ConcertsVerticalTemplate from "@/Components/Templates/Concerts/ConcertsVerticalTemplate";
import ConcertsHorizontalTemplate from "@/Components/Templates/Concerts/ConcertsHorizontalTemplate";

const TicketTemplate = forwardRef(({ ticketInfo }, ref) => {
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

  return (
    <div className="flex items-center justify-center w-full">
      <div className="max-w-full" style={{ minHeight: "auto" }}>
        <Template ref={ref} ticketInfo={ticketInfo} />
      </div>
    </div>
  );
});

TicketTemplate.displayName = "TicketTemplate";

export default TicketTemplate;
