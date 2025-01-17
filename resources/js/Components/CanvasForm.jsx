import React, { useState } from 'react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Label } from "@/Components/ui/label"

// We're expanding the form to handle ticket-specific information
export default function CanvasForm({ onImageUpload, onTicketInfoChange }) {
    // State for all ticket information
    const [ticketInfo, setTicketInfo] = useState({
        eventName: '',
        date: '',
        time: '',
        section: '',
        row: '',
        seat: '',
        price: '',
        backgroundImage: null
    });

    // Handle background image upload
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Update both the background image and notify parent
                setTicketInfo(prev => ({
                    ...prev,
                    backgroundImage: reader.result
                }));
                onImageUpload(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle all input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedInfo = {
            ...ticketInfo,
            [name]: value
        };
        setTicketInfo(updatedInfo);
        onTicketInfoChange(updatedInfo);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold mb-4">Ticket Information</h2>
                
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="eventName">Event Name</Label>
                        <Input
                            id="eventName"
                            name="eventName"
                            value={ticketInfo.eventName}
                            onChange={handleInputChange}
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
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="time">Time</Label>
                            <Input
                                id="time"
                                name="time"
                                type="time"
                                value={ticketInfo.time}
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
                                placeholder="Section"
                            />
                        </div>
                        <div>
                            <Label htmlFor="row">Row</Label>
                            <Input
                                id="row"
                                name="row"
                                value={ticketInfo.row}
                                onChange={handleInputChange}
                                placeholder="Row"
                            />
                        </div>
                        <div>
                            <Label htmlFor="seat">Seat</Label>
                            <Input
                                id="seat"
                                name="seat"
                                value={ticketInfo.seat}
                                onChange={handleInputChange}
                                placeholder="Seat"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            name="price"
                            value={ticketInfo.price}
                            onChange={handleInputChange}
                            placeholder="Enter ticket price"
                        />
                    </div>

                    <div>
                        <Label htmlFor="image-upload">Custom Background (optional)</Label>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>
            </div>

            <Button className="w-full">Generate Ticket</Button>
        </div>
    );
}