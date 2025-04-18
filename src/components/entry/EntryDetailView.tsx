"use client";
import React, { useState } from "react";
import { useEntryDetail } from "../../hooks/useEntryDetail";
import EntryDetailCard from "./EntryDetailCard";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import BackButton from "./BackButton.tsx";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";
import { useNavigate } from "../../hooks/useNavigate";

interface EntryDetailViewProps {
  entryId: string;
}

const EntryDetailView: React.FC<EntryDetailViewProps> = ({ entryId }) => {
  const { entry, loading, error, deleteEntry } = useEntryDetail(entryId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const success = await deleteEntry();
    if (success) {
      toast.success("Entry deleted successfully");
      navigate("/entries");
    } else {
      toast.error("Failed to delete entry");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!entry) return <div>Entry not found</div>;

  return (
    <div className="p-4">
      <BackButton />
      <EntryDetailCard entry={entry} />
      <button onClick={() => setIsModalOpen(true)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        Delete Entry
      </button>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onConfirm={() => {
          setIsModalOpen(false);
          handleDelete();
        }}
        onCancel={() => setIsModalOpen(false)}
      />
      <Toaster />
    </div>
  );
};

export default EntryDetailView;
