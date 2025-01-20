import React from 'react';
import { forwardRef } from 'react';

const generateBarcodePattern = () => {
    // Generate random barcode-like pattern
    const bars = [];
    for (let i = 0; i < 30; i++) {
        const width = Math.random() > 0.7 ? 3 : 1; // Occasionally make wider bars
        bars.push(`<rect x="${i * 3}" y="0" width="${width}" height="30" fill="black" />`);
    }
    return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="30" viewBox="0 0 100 30">${bars.join('')}</svg>`;
};

const ImageVisualizer = forwardRef(({ backgroundImage, ticketInfo }, ref) => {
    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-8">
            <div className="relative">
                <div 
                    ref={ref}
                    className="relative mx-auto rounded-lg overflow-hidden bg-white shadow-lg w-96 border border-gray-200"
                    style={{ aspectRatio: '2/3' }}
                >
                    {/* Event Image Section */}
                    <div 
                        className="h-2/5 relative"
                        style={{
                            background: backgroundImage 
                                ? `url(${backgroundImage}) center/cover no-repeat`
                                : 'linear-gradient(45deg, #0ea5e9, #0284c7)'
                        }}
                    >
                        <div className="absolute inset-0 bg-black/30" />
                    </div>

                    {/* Event Info Section */}
                    <div className="p-6 space-y-6">
                        {/* Event Name */}
                        <h1 className="text-2xl font-bold text-center text-gray-900">
                            {ticketInfo?.eventName || 'EVENT NAME'}
                        </h1>

                        {/* Date & Time */}
                        <div className="flex justify-center space-x-8 text-center">
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Date</p>
                                <p className="font-mono text-lg">
                                    {ticketInfo?.date 
                                        ? new Date(ticketInfo.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })
                                        : 'TBD'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Time</p>
                                <p className="font-mono text-lg">
                                    {ticketInfo?.time 
                                        ? new Date(`2000-01-01T${ticketInfo.time}`).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })
                                        : 'TBD'}
                                </p>
                            </div>
                        </div>

                        {/* Seat Info */}
                        <div className="flex justify-center space-x-8 text-center">
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Section</p>
                                <p className="font-mono text-lg">{ticketInfo?.section || 'A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Row</p>
                                <p className="font-mono text-lg">{ticketInfo?.row || '1'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Seat</p>
                                <p className="font-mono text-lg">{ticketInfo?.seat || '1'}</p>
                            </div>
                        </div>

                        {/* Barcode */}
                        <div className="flex flex-col items-center space-y-2">
                            <img 
                                src={generateBarcodePattern()} 
                                alt="Barcode"
                                className="h-8 w-48"
                            />
                            <p className="font-mono text-xs text-gray-500">
                                {Math.random().toString(36).substr(2, 12).toUpperCase()}
                            </p>
                        </div>
                    </div>

                    {/* Perforation */}
                    <div className="absolute top-2/5 left-0 right-0 flex">
                        {[...Array(40)].map((_, i) => (
                            <div 
                                key={i} 
                                className="h-3 border-l border-dashed border-gray-300"
                                style={{ width: '2.5%' }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

ImageVisualizer.displayName = 'ImageVisualizer';

export default ImageVisualizer;