import React from 'react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Label } from "@/Components/ui/label"
import html2canvas from 'html2canvas';

export default function CanvasForm({ onImageUpload, ticketInfo, setTicketInfo, ticketRef }) {
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUpload(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicketInfo(prev => ({
            ...prev,
            [name]: value
        }));
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
        <div className="space-y-4">
            <div>
                <Label htmlFor="image-upload">Upload Background Image</Label>
                <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </div>
            <div>
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                    id="eventName"
                    name="eventName"
                    value={ticketInfo.eventName}
                    onChange={handleChange}
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
                    />
                </div>
                <div>
                    <Label htmlFor="row">Row</Label>
                    <Input
                        id="row"
                        name="row"
                        value={ticketInfo.row}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label htmlFor="seat">Seat</Label>
                    <Input
                        id="seat"
                        name="seat"
                        value={ticketInfo.seat}
                        onChange={handleChange}
                    />
                </div>
            </div>
            
            <Button 
                onClick={generateTicket}
                className="w-full"
            >
                Generate Ticket
            </Button>
        </div>
    );
}