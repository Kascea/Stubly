import React from 'react';

export default function ImageVisualizer({ image, description }) {
    return (
        <div className="bg-gray-100 rounded-lg p-4">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
                {image && (
                    <div className="mb-4">
                        <img
                            src={image}
                            alt="Uploaded preview"
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                )}
                <h2 className="text-xl font-bold mb-2">Ticket Preview</h2>
                <p className="text-sky-900">{description || 'No description provided'}</p>
            </div>
        </div>
    );
}

