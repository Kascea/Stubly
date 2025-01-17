import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CanvasForm from '@/Components/CanvasForm';
import ImageVisualizer from '@/Components/ImageVisualizer';

export default function Canvas() {
    const [ticketInfo, setTicketInfo] = useState({
        eventName: 'Event Name',
        date: '2025-07-15',
        time: '20:00',
        section: 'A',
        row: '12',
        seat: '45'
    });
    const [image, setImage] = useState(null);
    const ticketRef = useRef(null);

    return (
        <AuthenticatedLayout>
            <Head title="Canvas" />

            <div className="flex h-screen">
                <div className="w-1/3 border-r border-sky-200 p-8 bg-white">
                    <CanvasForm 
                        onImageUpload={setImage}
                        ticketInfo={ticketInfo}
                        setTicketInfo={setTicketInfo}
                        ticketRef={ticketRef}
                    />
                </div>
                <div className="w-2/3 p-8 bg-gradient-to-b from-sky-100 to-orange-100">
                    <ImageVisualizer 
                        ref={ticketRef}
                        backgroundImage={image}
                        ticketInfo={ticketInfo}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}