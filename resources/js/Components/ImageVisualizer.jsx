import React, { useState } from 'react';
import { forwardRef } from 'react';

const ImageVisualizer = forwardRef(({ backgroundImage, ticketInfo }, ref) => {
    const [isZoomed, setIsZoomed] = useState(false);

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-8">
            <div className="space-y-6 relative">
                <div className="lg:hidden absolute top-0 left-0 right-0 text-center bg-sky-900/90 text-white py-2 rounded-lg backdrop-blur-sm text-sm">
                    Scroll down to customize your ticket
                </div>
                <div 
                    ref={ref}
                    onClick={() => setIsZoomed(!isZoomed)}
                    className={`relative mx-auto rounded-xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer w-96
                        ${isZoomed ? 'scale-150 translate-y-20' : 'hover:shadow-sky-200/50'}`}
                    style={{ aspectRatio: '9/16' }}
                >
                    <div 
                        className="h-1/2 relative"
                        style={{
                            background: backgroundImage 
                                ? `url(${backgroundImage}) center/cover no-repeat`
                                : 'linear-gradient(to br, #0c4a6e, #0369a1)'
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/20 to-sky-900/60" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-sky-900/90">
                            <h1 className="text-white text-xl font-bold tracking-wide text-center">
                                {ticketInfo?.eventName || 'EVENT NAME'}
                            </h1>
                        </div>
                    </div>

                    <div className="h-1/2 bg-white p-4 flex flex-col justify-between">
                        <div className="space-y-3 border-b border-sky-100 pb-3">
                            <div className="flex justify-between text-sm">
                                <div>
                                    <p className="text-sky-800 font-medium">DATE</p>
                                    <p className="font-semibold text-sky-950">
                                        {ticketInfo?.date 
                                            ? new Date(ticketInfo.date).toLocaleDateString()
                                            : 'TBD'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sky-800 font-medium">TIME</p>
                                    <p className="font-semibold text-sky-950">
                                        {ticketInfo?.time || 'TBD'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-sky-800 font-medium">SECTION</span>
                                <span className="font-semibold text-sky-950">{ticketInfo?.section || 'A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sky-800 font-medium">ROW</span>
                                <span className="font-semibold text-sky-950">{ticketInfo?.row || '1'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sky-800 font-medium">SEAT</span>
                                <span className="font-semibold text-sky-950">{ticketInfo?.seat || '1'}</span>
                            </div>
                        </div>

                        <div className="mt-3 border-t border-sky-100 pt-3">
                            <div className="w-full h-10 border border-sky-200 rounded-lg bg-sky-50 flex items-center justify-center">
                                <div className="text-[10px] font-mono text-sky-400 tracking-widest">
                                    ||||| |||| ||||| ||||
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-1/2 left-0 right-0 h-[2px] flex">
                        {[...Array(32)].map((_, i) => (
                            <div 
                                key={i} 
                                className="w-2 h-[2px]" 
                                style={{
                                    backgroundColor: i % 2 === 0 ? '#e0f2fe' : '#fff'
                                }}
                            />
                        ))}
                    </div>
                </div>

                <p className="text-center text-sm text-sky-600 font-medium">
                    Click ticket to {isZoomed ? 'shrink' : 'zoom'}
                </p>
            </div>
        </div>
    );
});

ImageVisualizer.displayName = 'ImageVisualizer';

export default ImageVisualizer;