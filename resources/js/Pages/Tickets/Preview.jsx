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
  AlertTriangle,
  Ticket,
  Wallet,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ShareDropdown from "@/Components/ShareDropdown";
import dayjs from "dayjs";
import { calculateDaysRemaining } from "@/utils/ticketUtils";

export default function Preview({ ticket, isPaid, isOwner, auth }) {
  const { toast } = useToast();
  const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

  // Use the utility function instead of local calculation
  const daysRemaining = calculateDaysRemaining(ticket, isPaid);

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
            {/* Header Section */}
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
                      className="bg-orange-400 hover:bg-orange-500 text-white"
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
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-400 hover:bg-orange-500 text-white h-10 px-4 py-2"
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
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-400 hover:bg-orange-500 text-white h-10 px-4 py-2"
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

            {/* Ticket Preview */}
            <div className="rounded-lg p-6">
              <div className="max-w-3xl mx-auto">
                {ticket.generated_ticket_url ? (
                  <div className="relative mx-auto w-full max-w-lg">
                    <img
                      src={ticket.generated_ticket_url}
                      alt={`Ticket for ${ticket.event_name}`}
                      className="w-full rounded-sm shadow-lg"
                    />

                    {/* Watermark overlay for unpaid tickets - improved for all ticket orientations */}
                    {!isPaid && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -inset-[50%] w-[300%] h-[300%] flex flex-col justify-around -rotate-45 -translate-y-1/4">
                          {/* Increase rows for better coverage */}
                          {Array.from({ length: 10 }).map((_, rowIndex) => (
                            <div
                              key={rowIndex}
                              className="flex justify-around w-full"
                            >
                              {/* Increase columns for better horizontal coverage */}
                              {Array.from({ length: 8 }).map((_, colIndex) => (
                                <span
                                  key={colIndex}
                                  className="text-red-500 opacity-10 text-2xl font-bold uppercase whitespace-nowrap px-4"
                                >
                                  Preview Only
                                </span>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-100 p-10 text-center rounded-sm text-gray-500">
                    Ticket image not available
                  </div>
                )}

                {/* Warning message for expiring tickets */}
                {isOwner && !isPaid && daysRemaining <= 7 && (
                  <div className="mt-4 text-xs bg-amber-100 border border-amber-300 rounded-md p-3 flex items-start shadow-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-amber-800">
                        This ticket will expire in {daysRemaining}{" "}
                        {daysRemaining === 1 ? "day" : "days"}
                      </p>
                      <p className="text-amber-700 mt-0.5">
                        <Link
                          href={route("payment.checkout", {
                            ticket: ticket.ticket_id,
                          })}
                          className="font-medium underline hover:text-amber-900"
                        >
                          Purchase now
                        </Link>
                      </p>
                    </div>
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
