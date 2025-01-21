import React, { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CanvasForm from '@/Components/CanvasForm';
import ImageVisualizer from '@/Components/ImageVisualizer';
import { format } from 'date-fns';

export default function Canvas({ ticket = null }) {
    const [ticketInfo, setTicketInfo] = useState(
        ticket ? {
            ticketId: ticket.ticket_id,
            eventName: ticket.event_name,
            eventLocation: ticket.event_location,
            date: new Date(ticket.event_datetime),
            time: new Date(ticket.event_datetime),
            section: ticket.section,
            row: ticket.row,
            seat: ticket.seat,
            backgroundImage: ticket.background_image,
            filename: ticket.background_filename
        } : {
            ticketId: null,
            eventName: '',
            eventLocation: '',
            date: null,
            time: null,
            section: '',
            row: '',
            seat: '',
            backgroundImage: null,
            filename: null
        }
    );
    const [image, setImage] = useState(null);
    const ticketRef = useRef(null);

    useEffect(() => {
        if (ticket?.background_image) {
            setImage(ticket.background_image);
        }
    }, [ticket]);

    const handleImageUpload = (imageData) => {
        setImage(imageData);
        setTicketInfo(prev => ({
            ...prev,
            backgroundImage: imageData
        }));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Design Your Ticket" />

            <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-sky-50 to-orange-50">
                <div className="lg:w-2/3 p-4 lg:p-8 order-1 lg:order-2">
                    <ImageVisualizer 
                        ref={ticketRef}
                        backgroundImage={image}
                        ticketInfo={ticketInfo}
                    />
                </div>
                <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-sky-200 p-4 lg:p-8 bg-white/80 backdrop-blur-sm shadow-lg order-2 lg:order-1">
                    <h2 className="text-2xl font-bold text-sky-900 mb-6">Customize Your Ticket</h2>
                    <CanvasForm 
                        onImageUpload={handleImageUpload}
                        ticketInfo={ticketInfo}
                        setTicketInfo={setTicketInfo}
                        ticketRef={ticketRef}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}