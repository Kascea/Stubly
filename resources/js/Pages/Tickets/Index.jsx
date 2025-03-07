import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { format } from "date-fns";
import { Card, CardContent } from "@/Components/ui/card";
import {
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Trash2,
  Download,
  CreditCard,
  Share2,
  LinkIcon,
  Sparkles,
  Ticket,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/Components/ui/toaster";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import TicketCard from "@/Components/TicketCard";
import { Button } from "@/Components/ui/button";

dayjs.extend(relativeTime);

export default function Index({ tickets }) {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const { flash } = usePage().props;
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
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      <Toaster />
    </AppLayout>
  );
}
