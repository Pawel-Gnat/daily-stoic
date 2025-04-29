import { useState, useEffect, useCallback } from "react";
import type { EntryDto, EntryListResponseDto, PaginationMetadata, UserDto } from "../types";
import { toast } from "sonner";
import { sampleEntries } from "@/lib/entries-helpers";

interface Props {
  user: UserDto | undefined;
}

const useEntries = ({ user }: Props) => {
  const [entries, setEntries] = useState<EntryDto[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    has_next: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(
    async (page = 1) => {
      if (!user) {
        setEntries(sampleEntries.data);
        setPagination(sampleEntries.pagination);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/entries?page=${page}&limit=10`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: EntryListResponseDto = await res.json();
        setEntries(data.data);
        setPagination(data.pagination);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error fetching entries");
        toast.error(err instanceof Error ? err.message : "Error fetching entries");
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    fetchEntries(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { entries, pagination, loading, error, fetchEntries };
};

export default useEntries;
