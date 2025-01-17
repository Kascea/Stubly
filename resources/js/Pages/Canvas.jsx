import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CanvasForm from '@/Components/CanvasForm';
import ImageVisualizer from '@/Components/ImageVisualizer';

export default function Canvas() {
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [ticketInfo, setTicketInfo] = useState(null);

    return (
        <AuthenticatedLayout>
            <Head title="Canvas" />

            <div className="flex h-screen">
                <div className="w-1/3 border-r border-sky-200 p-8 bg-white overflow-y-auto">
                    <CanvasForm 
                        onImageUpload={setBackgroundImage}
                        onTicketInfoChange={setTicketInfo}
                    />
                </div>
                <div className="w-2/3 p-8 bg-gradient-to-b from-sky-100 to-orange-100 overflow-y-auto">
                    <ImageVisualizer 
                        backgroundImage={backgroundImage}
                        ticketInfo={ticketInfo}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}