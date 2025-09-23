import React, { forwardRef } from "react";

import ModernTemplate from "@/Components/Templates/ModernTemplate";
import ClassicTemplate from "@/Components/Templates/ClassicTemplate";
import CreativeTemplate from "@/Components/Templates/CreativeTemplate";

const TicketTemplate = forwardRef(({ ticketInfo }, ref) => {
  // Generic templates that work for any event type
  const templates = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    creative: CreativeTemplate,
  };

  const Template = templates[ticketInfo.template] || templates["modern"];

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
