import React, { forwardRef } from "react";

import SportsModern from "@/Components/Templates/Sports/SportsModern";
import SportsClassic from "@/Components/Templates/Sports/SportsClassic";
import SportsCreative from "@/Components/Templates/Sports/SportsCreative";
import ConcertsModern from "@/Components/Templates/Concerts/ConcertsModern";
import ConcertsClassic from "@/Components/Templates/Concerts/ConcertsClassic";
import ConcertsCreative from "@/Components/Templates/Concerts/ConcertsCreative";
import BroadwayModern from "@/Components/Templates/Broadway/BroadwayModern";
import BroadwayClassic from "@/Components/Templates/Broadway/BroadwayClassic";
import BroadwayCreative from "@/Components/Templates/Broadway/BroadwayCreative";

const TicketTemplate = forwardRef(({ ticketInfo }, ref) => {
  // Organized by category with modern and classic template options
  const templates = {
    // Sports templates
    "sports-modern": SportsModern,
    "sports-classic": SportsClassic,
    "sports-creative": SportsCreative,

    // Concerts templates
    "concerts-modern": ConcertsModern,
    "concerts-classic": ConcertsClassic,
    "concerts-creative": ConcertsCreative,

    // Broadway templates
    "broadway-modern": BroadwayModern,
    "broadway-classic": BroadwayClassic,
    "broadway-creative": BroadwayCreative,
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
