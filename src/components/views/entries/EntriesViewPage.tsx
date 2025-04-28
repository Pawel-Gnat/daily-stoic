import React, { useState } from "react";
import EntryCard from "./EntryCard";
import useEntries from "../../../hooks/useEntries";
import { Pagination } from "./Pagination";
import DeleteConfirmationModal from "../entry/DeleteConfirmationModal";
import { Spinner } from "@/components/shared/Spinner";
import { Container } from "@/components/shared/Container";

const EntriesViewPage = () => {
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Spinner />
      </div>
    );
  }

  return (
    <Container className="flex flex-wrap gap-4 justify-center flex-col items-center text-center">
      <p className="font-cinzel text-xl">
        Your journey. Each entry reveals the path you&apos;ve traveled, shaped by Stoic wisdom and personal growth.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        {error && <div>Error: {error}</div>}
        {entries.map((entry) => (
          // <EntryCard key={entry.id} entry={entry} onDelete={() => handleDeleteClick(entry.id)} />
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
      {pagination.total_pages > 1 && (
        <Pagination
          page={pagination.current_page}
          total={pagination.total_pages}
          onPageChange={(page: number) => fetchEntries(page)}
        />
      )}
      {/* <DeleteConfirmationModal isOpen={showModal} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} /> */}
    </Container>
  );
};

export default EntriesViewPage;
