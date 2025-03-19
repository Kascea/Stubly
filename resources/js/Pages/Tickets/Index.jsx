import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, usePage, router, Deferred } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/Components/ui/toaster";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import TicketCard from "@/Components/TicketCard";

dayjs.extend(relativeTime);

// Create a loading spinner component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center w-full py-12">
    <Loader2 className="h-12 w-12 animate-spin text-sky-600 mb-4" />
    <p className="text-sky-900/70 text-lg">Loading your tickets...</p>
  </div>
);

// Create a component to display the tickets
const TicketsList = ({ tickets }) => {
  console.log(tickets);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const { toast } = useToast();

  // Sort tickets - paid tickets first, then by creation date (newest first)
  const sortedTickets = [...tickets].sort((a, b) => {
    // First sort by paid status
    if (a.isPaid && !b.isPaid) return -1;
    if (!a.isPaid && b.isPaid) return 1;

    // Then sort by creation date (newest first)
    return new Date(b.created) - new Date(a.created);
  });

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

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedTickets.length > 0 ? (
          sortedTickets.map((ticket) => (
            <TicketCard
              key={ticket.ticket_id}
              ticket={ticket}
              onDeleteClick={handleDeleteClick}
              showDelete={!ticket.isPaid}
              showStatusIndicator={true}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500 mb-4">No tickets found</p>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default function Index({ tickets }) {
  const { flash } = usePage().props;

  return (
    <AppLayout>
      <Head title="Ticket History" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-sky-900">
                Your Ticket Collection
              </h1>
              <p className="text-sky-900/70 text-lg">
                Design, customize, and share your event tickets
              </p>
            </div>
          </div>

          {/* All Tickets Section */}
          <div className="rounded-lg p-6">
            <Deferred data="tickets" fallback={<LoadingSpinner />}>
              <TicketsList tickets={tickets} />
            </Deferred>
          </div>
        </div>
      </div>
      <Toaster />
    </AppLayout>
  );
}
