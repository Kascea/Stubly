import React, { forwardRef } from "react";

import SportsModern from "@/Components/Templates/Sports/SportsModern";
import ConcertsModern from "@/Components/Templates/Concerts/ConcertsModern";
import ConcertsClassic from "@/Components/Templates/Concerts/ConcertsClassic";
import BroadwayModern from "@/Components/Templates/Broadway/BroadwayModern";

const TicketTemplate = forwardRef(({ ticketInfo }, ref) => {
  // Organized by category with modern template options
  const templates = {
    // Sports templates
    "sports-modern": SportsModern,

    // Concerts templates
    "concerts-modern": ConcertsModern,
    "concerts-classic": ConcertsClassic,

    // Broadway templates
    "broadway-modern": BroadwayModern,
  };

  const Template = templates[ticketInfo.template] || templates["sports-modern"];

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
