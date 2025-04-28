import EntryCard from "./EntryCard";
import useEntries from "../../../hooks/useEntries";
import { Pagination } from "./Pagination";
import { Spinner } from "@/components/shared/Spinner";
import { Container } from "@/components/shared/Container";

const EntriesViewPage = () => {
  const { entries, pagination, loading, error, fetchEntries } = useEntries();

  if (loading) return <Spinner />;

  return (
    <Container className="text-center">
      <p className="font-cinzel text-xl">
        Your journey. Each entry reveals the path you&apos;ve traveled, shaped by Stoic wisdom and personal growth.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        {error && <div>Error: {error}</div>}
        {entries.map((entry) => (
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
    </Container>
  );
};

export default EntriesViewPage;
