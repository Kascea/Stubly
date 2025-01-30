import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TicketTemplate from "@/Components/TicketTemplate";
import { Button } from "@/Components/ui/button";
import {
  Download,
  Share2,
  Share,
  LogIn,
  Copy,
  UserPlus,
  Link as LinkIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ShareDropdown from "@/Components/ShareDropdown";

export default function Preview({ ticket, isPaid, isOwner, auth }) {
  const { toast } = useToast();
  const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

  const handleDownload = () => {
    window.location.href = route("tickets.download", {
      ticket: ticket.ticket_id,
    });
  };

  const handleCustomize = () => {
    window.location.href = route("tickets.duplicate", {
      ticket: ticket.ticket_id,
    });
  };

  const handleLogin = () => {
    window.location.href = route("login", {
      redirect: window.location.pathname,
    });
  };

  const handleRegister = () => {
    window.location.href = route("register", {
      redirect: window.location.pathname,
    });
  };

  const ticketInfo = {
    ticketId: ticket.ticket_id,
    eventName: ticket.event_name,
    eventLocation: ticket.event_location,
    date: new Date(ticket.event_datetime),
    time: new Date(ticket.event_datetime),
    section: ticket.section,
    row: ticket.row,
    seat: ticket.seat,
    backgroundImage: ticket.background_image,
    template: ticket.template,
    isPaid: isPaid,
  };

  return (
    <Layout>
      <Head title="View Ticket" />

      <div className="py-6">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header Section - Redesigned to be more compact */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-sky-900">
                  {ticket.event_name}
                </h1>
                <p className="text-sky-900/70">{ticket.event_location}</p>
              </div>

              <div className="flex items-center gap-3">
                {isPaid && isOwner ? (
                  <Button
                    onClick={handleDownload}
                    className="bg-sky-900 hover:bg-sky-800 text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Ticket
                  </Button>
                ) : auth.user && !isOwner ? (
                  <Button
                    onClick={handleCustomize}
                    className="bg-sky-900 hover:bg-sky-800 text-white"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Make It Yours
                  </Button>
                ) : !auth.user ? (
                  <>
                    <Button onClick={handleLogin} variant="outline">
                      <LogIn className="mr-2 h-4 w-4" />
                      Log in
                    </Button>
                    <Button
                      onClick={handleRegister}
                      className="bg-sky-900 hover:bg-sky-800 text-white"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Join Now
                    </Button>
                  </>
                ) : null}
                <ShareDropdown
                  title={`Ticket for ${ticket.event_name}`}
                  text={`Check out my ticket for ${ticket.event_name} at ${ticket.event_location}`}
                  url={window.location.href}
                />
              </div>
            </div>

            {/* Ticket Preview */}
            <div className="bg-gradient-to-b from-sky-50 to-orange-50 rounded-lg p-6">
              <div className="max-w-3xl mx-auto">
                <TicketTemplate ticketInfo={ticketInfo} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
