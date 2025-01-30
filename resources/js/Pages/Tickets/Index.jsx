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
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Trash2,
  Download,
  CreditCard,
  Share2,
  LinkIcon,
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
  const [showUnpaid, setShowUnpaid] = useState(true);
  const [showPaid, setShowPaid] = useState(true);
  const { flash } = usePage().props;
  const { toast } = useToast();

  // Separate tickets into paid and unpaid
  const paidTickets = tickets.filter((ticket) => ticket.isPaid);
  const unpaidTickets = tickets.filter((ticket) => !ticket.isPaid);

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
    <AuthenticatedLayout>
      <Head title="Ticket History" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-sky-900">
                  Your Ticket Collection
                </h1>
                <p className="text-sky-900/70 text-lg">
                  Design, customize, and share your event tickets
                </p>
              </div>
              <Link href={route("canvas")}>
                <Button className="bg-gradient-to-r from-orange-300 to-sky-400 hover:from-orange-400 hover:to-sky-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      Create Something Amazing
                    </span>
                    <PlusCircle className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Unpaid Tickets Section */}
          <div className="rounded-lg shadow">
            <button
              onClick={() => setShowUnpaid(!showUnpaid)}
              className="w-full flex justify-between items-center p-6 hover:bg-sky-50 transition-colors rounded-t-lg"
            >
              <div>
                <h2 className="text-2xl font-bold text-sky-900">
                  Design in Progress
                </h2>
                <p className="text-sm text-sky-900/70">
                  Tickets you're currently working on
                </p>
              </div>
              <div
                className={`transform transition-transform duration-200 ${
                  showUnpaid ? "rotate-180" : ""
                }`}
              >
                <ChevronDown className="h-6 w-6 text-gray-500" />
              </div>
            </button>
            <div
              className={`transition-all duration-200 ease-in-out ${
                showUnpaid ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="p-6 pt-0">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {unpaidTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.ticket_id}
                      ticket={ticket}
                      onDeleteClick={handleDeleteClick}
                      showDelete={true}
                    />
                  ))}
                  {unpaidTickets.length === 0 && (
                    <p className="text-gray-500 col-span-3 text-center py-4">
                      No unpaid tickets
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Paid Tickets Section */}
          <div className="rounded-lg shadow">
            <button
              onClick={() => setShowPaid(!showPaid)}
              className="w-full flex justify-between items-center p-6 hover:bg-sky-50 transition-colors rounded-t-lg"
            >
              <div>
                <h2 className="text-2xl font-bold text-sky-900">
                  Ready for the Event
                </h2>
                <p className="text-sm text-sky-900/70">
                  Your purchased and completed tickets
                </p>
              </div>
              <div
                className={`transform transition-transform duration-200 ${
                  showPaid ? "rotate-180" : ""
                }`}
              >
                <ChevronDown className="h-6 w-6 text-gray-500" />
              </div>
            </button>
            <div
              className={`transition-all duration-200 ease-in-out ${
                showPaid ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="p-6 pt-0">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {paidTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.ticket_id}
                      ticket={ticket}
                      showDelete={false}
                    />
                  ))}
                  {paidTickets.length === 0 && (
                    <p className="text-gray-500 col-span-3 text-center py-4">
                      No purchased tickets
                    </p>
                  )}
                </div>
              </div>
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
    </AuthenticatedLayout>
  );
}
