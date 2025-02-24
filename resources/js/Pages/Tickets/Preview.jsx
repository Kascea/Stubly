import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
  Download,
  Share2,
  Share,
  LogIn,
  Copy,
  UserPlus,
  Link as LinkIcon,
  CreditCard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ShareDropdown from "@/Components/ShareDropdown";

export default function Preview({ ticket, isPaid, isOwner, auth }) {
  const { toast } = useToast();
  const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

  // We still need the download handler because it requires special handling
  const handleDownload = () => {
    window.location.href = route("tickets.download", {
      ticket: ticket.ticket_id,
    });
  };

  // Create the query param object for login/register redirect
  const redirectParams = { redirect: window.location.pathname };

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
                {isOwner ? (
                  isPaid ? (
                    <Button
                      onClick={handleDownload}
                      className="bg-sky-900 hover:bg-sky-800 text-white"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Ticket
                    </Button>
                  ) : (
                    <Link
                      href={route("payment.checkout", {
                        ticket: ticket.ticket_id,
                      })}
                      className="inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-400 hover:bg-orange-500 text-white h-11 px-6 py-2.5 text-base shadow-md"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Purchase This Ticket
                    </Link>
                  )
                ) : auth.user ? (
                  <Link
                    href={route("tickets.duplicate", {
                      ticket: ticket.ticket_id,
                    })}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-sky-900 hover:bg-sky-800 text-white h-10 px-4 py-2"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Make It Yours
                  </Link>
                ) : (
                  <>
                    <Link
                      href={route("login", redirectParams)}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Log in
                    </Link>
                    <Link
                      href={route("register", redirectParams)}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-sky-900 hover:bg-sky-800 text-white h-10 px-4 py-2"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Join Now
                    </Link>
                  </>
                )}
                <ShareDropdown
                  title={`Ticket for ${ticket.event_name}`}
                  text={`Check out my ticket for ${ticket.event_name} at ${ticket.event_location}`}
                  url={window.location.href}
                />
              </div>
            </div>

            {/* Ticket Preview - Now displaying the generated image */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="max-w-3xl mx-auto">
                {ticket.generated_ticket_url ? (
                  <img
                    src={ticket.generated_ticket_url}
                    alt={`Ticket for ${ticket.event_name}`}
                    className="mx-auto w-full max-w-lg rounded-sm shadow-lg"
                  />
                ) : (
                  <div className="bg-gray-100 p-10 text-center rounded-sm text-gray-500">
                    Ticket image not available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
