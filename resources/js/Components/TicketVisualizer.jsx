import React, { forwardRef } from "react";

import SportsVerticalTemplate from "@/Components/Templates/Sports/SportsVerticalTemplate";
import ConcertsVerticalTemplate from "@/Components/Templates/Concerts/ConcertsVerticalTemplate";

const TicketTemplate = forwardRef(({ ticketInfo }, ref) => {
  // Organized by category with vertical options only
  const templates = {
    // Sports templates
    "sports-vertical": SportsVerticalTemplate,

    // Concerts templates
    "concerts-vertical": ConcertsVerticalTemplate,
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
