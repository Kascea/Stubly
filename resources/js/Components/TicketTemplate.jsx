import React, { forwardRef } from "react";
import ModernTemplate from "@/Components/Templates/ModernTemplate";
import ClassicTemplate from "@/Components/Templates/ClassicTemplate";

const TicketTemplate = forwardRef(
  ({ template = "modern", ticketInfo }, ref) => {
    const templates = {
      modern: ModernTemplate,
      classic: ClassicTemplate,
    };

    const Template = templates[template] || templates.modern;

    return <Template ref={ref} ticketInfo={ticketInfo} />;
  }
);

TicketTemplate.displayName = "TicketTemplate";

export default TicketTemplate;
