import React, { useState } from "react";
import EntryCard from "./EntryCard";
import useEntries from "../../../hooks/useEntries";
import { Pagination } from "./Pagination";
import DeleteConfirmationModal from "../entry/DeleteConfirmationModal";
import { Spinner } from "@/components/shared/Spinner";

const EntriesView = () => {
  const { entries, pagination, loading, error, fetchEntries } = useEntries();
  // const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  // const [showModal, setShowModal] = useState(false);

  // const handleDeleteClick = (id: string) => {
  //   setSelectedEntryId(id);
  //   setShowModal(true);
  // };

  // const handleConfirmDelete = async () => {
  //   if (selectedEntryId) {
  //     await deleteEntry(selectedEntryId);
  //     setShowModal(false);
  //     setSelectedEntryId(null);
  //   }
  // };

  // const handleCancelDelete = () => {
  //   setShowModal(false);
  //   setSelectedEntryId(null);
  // };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Spinner />
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {entries.map((entry) => (
        // <EntryCard key={entry.id} entry={entry} onDelete={() => handleDeleteClick(entry.id)} />
        <EntryCard key={entry.id} entry={entry} />
      ))}
      <Pagination
        page={pagination.current_page}
        total={pagination.total_pages}
        onPageChange={(page: number) => fetchEntries(page)}
      />
      {/* <DeleteConfirmationModal isOpen={showModal} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} /> */}
    </div>
  );
};

export default EntriesView;
