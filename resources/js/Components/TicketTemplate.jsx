import React, { forwardRef } from "react";
import ModernTemplate from "@/Components/Templates/ModernTemplate";
import ClassicTemplate from "@/Components/Templates/ClassicTemplate";
import CreativeTemplate from "@/Components/Templates/CreativeTemplate";

const TicketTemplate = forwardRef(({ ticketInfo }, ref) => {
  const templates = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    creative: CreativeTemplate,
  };

  const Template = templates[ticketInfo.template] || templates.modern;

  return <Template ref={ref} ticketInfo={ticketInfo} />;
});

TicketTemplate.displayName = "TicketTemplate";

export default TicketTemplate;
