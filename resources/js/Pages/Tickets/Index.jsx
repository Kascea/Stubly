import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { format } from "date-fns";
import { Card, CardContent } from "@/Components/ui/card";
import {
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  PlusCircle,
  MoreVertical,
  Trash2,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/Components/ui/toaster";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";

export default function Index({ tickets }) {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const { flash } = usePage().props;
  const { toast } = useToast();

  const handleDeleteClick = (ticketId) => {
    setTicketToDelete(ticketId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (ticketToDelete) {
      router.delete(route("tickets.destroy", { ticket: ticketToDelete }), {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setTicketToDelete(null);
          toast({
            title: "Success!",
            description: "Ticket has been successfully deleted",
            className: "bg-green-500 border-green-600 text-white",
          });
        },
        onError: (errors) => {
          console.error("Failed to delete ticket:", errors);
          setDeleteModalOpen(false);
          setTicketToDelete(null);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete ticket. Please try again.",
          });
        },
      });
    }
  };

  const handleDownload = (ticketId) => {
    window.location.href = route("tickets.download", { ticket: ticketId });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Ticket History" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Ticket History
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="relative">
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

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {ticket.event_name}
                      </h3>

                      <div className="space-y-2 text-sm text-gray-600">
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
                    </Link>

                    <div className="absolute bottom-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
                          <MoreVertical className="h-5 w-5 text-gray-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-gray-700 focus:bg-sky-50 cursor-pointer"
                            onClick={() => handleDownload(ticket.ticket_id)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={() => handleDeleteClick(ticket.ticket_id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            <Card className="group hover:border-orange-400 border-2 border-dashed border-sky-200 bg-transparent">
              <Link href={route("canvas")} className="block h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <PlusCircle className="h-12 w-12 mb-2 text-sky-600 group-hover:text-orange-500" />
                    <span className="text-lg font-semibold text-sky-600 group-hover:text-orange-500">
                      Create New Ticket
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      <Toaster />
    </AuthenticatedLayout>
  );
}
