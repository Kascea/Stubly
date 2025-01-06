import React, { useState } from 'react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Label } from "@/Components/ui/label"

export default function CanvasForm({ onImageUpload, onDescriptionChange }) {
    const [description, setDescription] = useState('');

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

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        onDescriptionChange(e.target.value);
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="image-upload">Upload Reference Image (optional)</Label>
                <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </div>
            <div>
                <Label htmlFor="description">Ticket Description</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter ticket description..."
                    rows={4}
                />
            </div>
            <Button>Generate Ticket</Button>
        </div>
    );
}

