import React from "react";
import type { EntryDto } from "../types";

interface EntryCardProps {
  entry: EntryDto;
  onDelete: () => void;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry, onDelete }) => {
  return (
    <div className="border rounded p-4 mb-4">
      <h2 className="text-xl font-bold">{entry.what_matters_most}</h2>
      <p className="text-sm text-gray-600">{new Date(entry.created_at).toLocaleDateString()}</p>
      <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

export default EntryCard;
