import React, { useRef } from 'react';
import { Button } from "@/Components/ui/button";
import html2canvas from 'html2canvas';

export default function ImageVisualizer({ backgroundImage, ticketInfo }) {
    const ticketRef = useRef(null);

    const downloadTicket = async () => {
        if (ticketRef.current) {
            const canvas = await html2canvas(ticketRef.current, {
                scale: 2,
                backgroundColor: null
            });
            
            const link = document.createElement('a');
            link.download = 'custom-ticket.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    return (
        <div className="space-y-6">
            {/* Ticket Preview Container */}
            <div 
                ref={ticketRef}
                className="relative w-full aspect-[2/1] rounded-xl overflow-hidden shadow-lg"
                style={{
                    background: backgroundImage 
                        ? `url(${backgroundImage}) center/cover no-repeat`
                        : 'linear-gradient(to right, #3b82f6, #8b5cf6)'
                }}
            >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Ticket Content */}
                <div className="relative z-10 h-full p-6 text-white">
                    <div className="h-full flex flex-col justify-between">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-wider">
                                {ticketInfo?.eventName || 'EVENT NAME'}
                            </h1>
                            
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm opacity-75">Date</p>
                                    <p className="font-semibold">
                                        {ticketInfo?.date 
                                            ? new Date(ticketInfo.date).toLocaleDateString()
                                            : 'TBD'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm opacity-75">Time</p>
                                    <p className="font-semibold">
                                        {ticketInfo?.time || 'TBD'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm opacity-75">Price</p>
                                    <p className="font-semibold">
                                        {ticketInfo?.price || '$0.00'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-sm opacity-75">
                                    Section {ticketInfo?.section || 'A'}
                                </p>
                                <p className="text-sm opacity-75">
                                    Row {ticketInfo?.row || '1'}
                                </p>
                                <p className="text-sm opacity-75">
                                    Seat {ticketInfo?.seat || '1'}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="w-32 h-32 bg-white/10 rounded-lg flex items-center justify-center">
                                    <div className="w-24 h-24 border-2 border-white/30 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Button 
                onClick={downloadTicket}
                className="w-full"
            >
                Download Ticket
            </Button>
        </div>
    );
}