import { format } from "date-fns";
import { Card, CardContent } from "@/Components/ui/card";
import { Link } from "@inertiajs/react";
import {
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  MoreVertical,
  Trash2,
  Download,
  CreditCard,
  Share2,
  LinkIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";

export default function TicketCard({ ticket, onDeleteClick, showDelete }) {
  const { toast } = useToast();

  return (
    <div className="relative">
      <Card>
        <CardContent className="p-6">
          <Link
            href={route("canvas", { ticket: ticket.ticket_id })}
            className="block transition-transform hover:scale-[1.02]"
          >
            <div className="aspect-[16/9] relative mb-4 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={ticket.generated_ticket_path}
                alt={ticket.event_name}
                className="object-cover w-full h-full"
              />
            </div>

            <h3 className="text-lg font-semibold text-sky-900 mb-2">
              {ticket.event_name}
            </h3>

            <div className="space-y-2 text-sm text-sky-900/70 mb-12">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(new Date(ticket.event_datetime), "PPp")}
              </div>

              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                {ticket.event_location}
              </div>

              {(ticket.section || ticket.row || ticket.seat) && (
                <div className="flex items-center gap-2">
                  <TicketIcon className="h-4 w-4" />
                  {[
                    ticket.section && `Section ${ticket.section}`,
                    ticket.row && `Row ${ticket.row}`,
                    ticket.seat && `Seat ${ticket.seat}`,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500 mt-auto">
              {ticket.updated_at !== ticket.created_at ? (
                <>Updated {dayjs(ticket.lastUpdated).fromNow()}</>
              ) : (
                <>Created {dayjs(ticket.created).fromNow()}</>
              )}
            </div>
          </Link>

          <div className="absolute bottom-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    ticket.isPaid
                      ? (window.location.href = route("tickets.download", {
                          ticket: ticket.ticket_id,
                        }))
                      : (window.location.href = route("payment.checkout", {
                          ticket: ticket.ticket_id,
                        }));
                  }}
                >
                  {ticket.isPaid ? (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Purchase
                    </>
                  )}
                </DropdownMenuItem>

                {ticket.isPaid && (
                  <>
                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          await navigator.share({
                            title: `Ticket for ${ticket.event_name}`,
                            text: `Check out my ticket for ${ticket.event_name} at ${ticket.event_location}`,
                            url: route("tickets.preview", {
                              ticket: ticket.ticket_id,
                            }),
                          });
                        } catch (error) {
                          // Only copy link if Web Share API is not supported
                          if (error.name === "NotSupportedError") {
                            navigator.clipboard.writeText(
                              route("tickets.preview", {
                                ticket: ticket.ticket_id,
                              })
                            );
                            toast({
                              title: "Link copied!",
                              description:
                                "The ticket link has been copied to your clipboard.",
                              className:
                                "bg-green-500 border-green-600 text-white",
                            });
                          }
                          // Do nothing if user cancelled the share
                        }
                      }}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share ticket
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(
                          route("tickets.preview", {
                            ticket: ticket.ticket_id,
                          })
                        );
                        toast({
                          title: "Link copied!",
                          description:
                            "The ticket link has been copied to your clipboard.",
                          className: "bg-green-500 border-green-600 text-white",
                        });
                      }}
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Copy link
                    </DropdownMenuItem>
                  </>
                )}

                {showDelete && (
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={() => onDeleteClick(ticket.ticket_id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
