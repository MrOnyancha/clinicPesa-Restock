import { FaComments, FaPaperPlane } from "react-icons/fa";
import { useState } from "react";
import { TableCell } from "@/components/ui/table";
import NoteModal from "./NoteModule";

function NotesCell({ product }: { product: any }) {
    const [showNotes, setShowNotes] = useState(false);
    const [noteModalOpen, setNoteModalOpen] = useState(false);

    let parsedNotes: any[] = [];

    try {
        const rawNotes = typeof product.notes === "string"
            ? JSON.parse(product.notes)
            : product.notes;

        parsedNotes = Array.isArray(rawNotes) ? rawNotes : [];
    } catch (error) {
        console.error("Failed to parse notes:", error);
        parsedNotes = [];
    }


    const handleNoteSubmit = (noteData: any) => {
        console.log("Submitted note:", noteData);
        setNoteModalOpen(false);
    };

    return (
        <TableCell className="relative">
            <button
                type="button"
                className="relative p-1 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                onClick={() => {
                    setShowNotes(!showNotes);
                }}
                aria-label={`Show ${parsedNotes.length} notes`}
            >
                <FaComments size={20} />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full px-1.5 leading-none">
                    {parsedNotes.length}
                </span>
            </button>

            {showNotes && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="absolute z-50 top-full right-0 mt-2 w-80 max-h-64 overflow-y-auto bg-white border border-gray-300 rounded shadow-xl p-4 text-sm"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-base">
                            Notes ({parsedNotes.length})
                        </h4>
                        <button
                            onClick={() => setShowNotes(false)}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            Close
                        </button>
                    </div>

                    <ul className="space-y-3">
                        {parsedNotes.map((note: any, index: number) => (
                            <li
                                key={index}
                                className="p-2 border border-gray-200 rounded bg-gray-50"
                            >
                                <p>
                                    <span className="font-semibold">Note {index + 1}:</span>{" "}
                                    {note.comment}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    By: <span className="font-light">{note.commentBy}</span> <br />
                                    Time:{" "}
                                    {new Date(note.commentTime).toLocaleString(undefined, {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                    })}
                                </p>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                                        onClick={() => setNoteModalOpen(true)}
                                        aria-label="Add new comment"
                                    >
                                        <FaPaperPlane />
                                        <span className="hidden sm:inline">Add Comment</span>
                                    </button>
                                </div>
                            </li>

                        ))}
                    </ul>

                    {/* Add Comment Button */}

                </div>
            )}

            {/* Note Modal */}
            <NoteModal
                open={noteModalOpen}
                itemName={product?.itemName || ""}
                onClose={() => setNoteModalOpen(false)}
                onSubmit={handleNoteSubmit}
            />
        </TableCell>
    );
}

export default NotesCell;
