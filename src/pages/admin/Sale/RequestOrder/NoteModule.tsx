import React, { useState, useEffect } from 'react';

interface NoteModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (comment: string) => void;
    itemName: string;
}

const NoteModal: React.FC<NoteModalProps> = ({ open, onClose, onSubmit, itemName }) => {
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (open) {
            setComment(''); // Reset comment when opening
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
                <div className="p-4">
                    <h2 className="text-base sm:text-lg font-semibold mb-2">
                        Add Note for: <span className="font-medium text-gray-700">{itemName}</span>
                    </h2>
                    <textarea
                        className="w-full border border-gray-300 p-2 rounded mb-4 resize-none text-sm sm:text-base"
                        rows={4}
                        placeholder="Enter your comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-3 sm:px-4 py-1 border border-gray-300 text-sm rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onSubmit(comment);
                                setComment('');
                            }}
                            className="px-3 sm:px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteModal;

