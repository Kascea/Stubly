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

      <div className="py-12">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Event Ticket</h2>
              <div className="space-x-4">
                {isPaid && isOwner ? (
                  <Button
                    onClick={handleDownload}
                    className="bg-sky-900 hover:bg-sky-800"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                ) : auth.user && !isOwner ? (
                  <Button
                    onClick={handleCustomize}
                    className="bg-sky-900 hover:bg-sky-800"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Customize
                  </Button>
                ) : !auth.user ? (
                  <div className="space-x-4">
                    <Button onClick={handleLogin} variant="outline">
                      <LogIn className="mr-2 h-4 w-4" />
                      Log in
                    </Button>
                    <Button
                      onClick={handleRegister}
                      className="bg-sky-900 hover:bg-sky-800"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign up
                    </Button>
                  </div>
                ) : null}
                <ShareDropdown
                  title={`Ticket for ${ticket.event_name}`}
                  text={`Check out my ticket for ${ticket.event_name} at ${ticket.event_location}`}
                  url={window.location.href}
                />
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
              <TicketTemplate ticketInfo={ticketInfo} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
