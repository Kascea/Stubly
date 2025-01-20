import React from 'react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { ArrowDown, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function CanvasForm({ onImageUpload, ticketInfo, setTicketInfo, ticketRef }) {
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => onImageUpload(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicketInfo(prev => ({ ...prev, [name]: value }));
    };

    const generateTicket = async () => {
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
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <div className="space-y-6">
                <div className="relative group">
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="bg-sky-50 border-2 border-dashed border-sky-200 rounded-lg p-6 text-center hover:border-sky-300 transition-colors">
                        <ArrowDown className="mx-auto h-8 w-8 text-sky-500 mb-2" />
                        <span className="text-sm text-sky-700">Upload Background Image</span>
                    </div>
                </div>

                <div>
                    <Label htmlFor="eventName">Event Name</Label>
                    <Input
                        id="eventName"
                        name="eventName"
                        value={ticketInfo.eventName}
                        onChange={handleChange}
                        placeholder="Enter event name"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            value={ticketInfo.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                            id="time"
                            name="time"
                            type="time"
                            value={ticketInfo.time}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="section">Section</Label>
                        <Input
                            id="section"
                            name="section"
                            value={ticketInfo.section}
                            onChange={handleChange}
                            placeholder="Section"
                        />
                    </div>
                    <div>
                        <Label htmlFor="row">Row</Label>
                        <Input
                            id="row"
                            name="row"
                            value={ticketInfo.row}
                            onChange={handleChange}
                            placeholder="Row"
                        />
                    </div>
                    <div>
                        <Label htmlFor="seat">Seat</Label>
                        <Input
                            id="seat"
                            name="seat"
                            value={ticketInfo.seat}
                            onChange={handleChange}
                            placeholder="Seat"
                        />
                    </div>
                </div>
                
                <Button 
                    onClick={generateTicket}
                    className="w-full bg-sky-900 hover:bg-sky-800 text-white"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Download Ticket
                </Button>
            </div>
        </div>
    );
}