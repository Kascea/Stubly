import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CanvasForm from '@/Components/CanvasForm';
import ImageVisualizer from '@/Components/ImageVisualizer';

export default function Canvas() {
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-sky-900">
                    Canvas
                </h2>
            }
        >
            <Head title="Canvas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-sky-200">
                        <div className="p-6 text-sky-900">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-1/3">
                                    <CanvasForm 
                                        onImageUpload={setImage}
                                        onDescriptionChange={setDescription}
                                    />
                                </div>
                                <div className="w-full md:w-2/3">
                                    <ImageVisualizer 
                                        image={image}
                                        description={description}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

