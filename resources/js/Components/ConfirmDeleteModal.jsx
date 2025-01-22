import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <h2 className="text-lg font-bold">Confirm Deletion</h2>
                </DialogHeader>
                <p>Are you sure you want to delete this ticket? This action cannot be undone.</p>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 