import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from "@/Components/ui/card";
import { CalendarIcon, MapPinIcon, TicketIcon } from 'lucide-react';

export default function Index({ tickets }) {
    return (
        <AuthenticatedLayout>
            <Head title="Ticket History" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Ticket History</h2>
                    
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {tickets.map((ticket) => (
                            <Link 
                                key={ticket.id} 
                                href={route('canvas', { ticket: ticket.ticket_id })}
                                className="transition-transform hover:scale-[1.02]"
                            >
                                <Card>
                                    <CardContent className="p-6">
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
                                                {format(new Date(ticket.event_datetime), 'PPp')}
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
                                                        ticket.seat && `Seat ${ticket.seat}`
                                                    ].filter(Boolean).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 