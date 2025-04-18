import React, { useState } from "react";
import EntryCard from "./EntryCard";
import useEntries from "../hooks/useEntries";
import { Pagination } from "./ui/pagination";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const EntriesView = () => {
  const { entries, pagination, loading, error, fetchEntries, deleteEntry } = useEntries();
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = (id: string) => {
    setSelectedEntryId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedEntryId) {
      await deleteEntry(selectedEntryId);
      setShowModal(false);
      setSelectedEntryId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedEntryId(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} onDelete={() => handleDeleteClick(entry.id)} />
      ))}
      <Pagination
        page={pagination.current_page}
        total={pagination.total_pages}
        onPageChange={(page: number) => fetchEntries(page)}
      />
      <DeleteConfirmationModal isOpen={showModal} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
    </div>
  );
};

export default EntriesView;
