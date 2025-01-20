import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CanvasForm from '@/Components/CanvasForm';
import ImageVisualizer from '@/Components/ImageVisualizer';

export default function Canvas() {
    const [ticketInfo, setTicketInfo] = useState({
        eventName: '',
        eventLocation: '',
        date: '',
        time: '',
        section: '',
        row: '',
        seat: '',
        backgroundImage: null
    });
    const [image, setImage] = useState(null);
    const ticketRef = useRef(null);

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