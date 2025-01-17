import React, { useRef, forwardRef } from 'react';

const ImageVisualizer = forwardRef(({ backgroundImage, ticketInfo }, ref) => {
    return (
        <div className="space-y-6">
            {/* Ticket Preview Container */}
            <div 
                ref={ref}
                className="relative mx-auto w-64 aspect-[9/16] rounded-lg overflow-hidden shadow-lg border border-gray-700"
            >
                {/* Image Section (Upper Half) */}
                <div 
                    className="h-1/2 relative"
                    style={{
                        background: backgroundImage 
                            ? `url(${backgroundImage}) center/cover no-repeat`
                            : 'linear-gradient(to bottom, #3b82f6, #8b5cf6)'
                    }}
                >
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Event name overlay on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70">
                        <h1 className="text-white text-lg font-bold tracking-wide text-center">
                            {ticketInfo?.eventName || 'EVENT NAME'}
                        </h1>
                    </div>
                </div>

                {/* Ticket Info Section (Lower Half) */}
                <div className="h-1/2 bg-white p-3 flex flex-col justify-between">
                    {/* Date and Time */}
                    <div className="space-y-2 border-b border-gray-200 pb-2">
                        <div className="flex justify-between text-xs">
                            <div>
                                <p className="text-gray-500">DATE</p>
                                <p className="font-semibold">
                                    {ticketInfo?.date 
                                        ? new Date(ticketInfo.date).toLocaleDateString()
                                        : 'TBD'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500">TIME</p>
                                <p className="font-semibold">
                                    {ticketInfo?.time || 'TBD'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Seat Info */}
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span className="text-gray-500">SECTION</span>
                            <span className="font-semibold">{ticketInfo?.section || 'A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">ROW</span>
                            <span className="font-semibold">{ticketInfo?.row || '1'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">SEAT</span>
                            <span className="font-semibold">{ticketInfo?.seat || '1'}</span>
                        </div>
                    </div>

                    {/* Barcode Section */}
                    <div className="mt-2 border-t border-gray-200 pt-2">
                        <div className="w-full h-8 border border-gray-300 rounded flex items-center justify-center">
                            <div className="text-[8px] font-mono text-gray-400">
                                ||||| |||| ||||| ||||
                            </div>
                        </div>
                    </div>
                </div>

                {/* Perforation Line */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-300 flex">
                    {[...Array(32)].map((_, i) => (
                        <div 
                            key={i} 
                            className="w-2 h-[1px]" 
                            style={{
                                backgroundColor: i % 2 === 0 ? '#e5e7eb' : 'white'
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
});

ImageVisualizer.displayName = 'ImageVisualizer';

export default ImageVisualizer;