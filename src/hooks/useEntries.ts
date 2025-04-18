import { useState, useEffect, useCallback } from "react";
import type { EntryDto, EntryListResponseDto, PaginationMetadata } from "../types";
import { toast } from "sonner";

const useEntries = () => {
  const [entries, setEntries] = useState<EntryDto[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    has_next: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    // Check if user is authenticated by checking token
    const token = localStorage.getItem("token");
    if (!token) {
      try {
        const res = await fetch("/data/sample-entries.json");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const sampleData = await res.json();
        setEntries(sampleData.data);
        setPagination(sampleData.pagination);
      } catch (err: any) {
        setError(err.message || "Error fetching sample entries");
        toast.error(err.message || "Error fetching sample entries");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const res = await fetch(`/api/entries?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: EntryListResponseDto = await res.json();
      setEntries(data.data);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "Error fetching entries");
      toast.error(err.message || "Error fetching entries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries(1);
  }, [fetchEntries]);

  const deleteEntry = useCallback(
    async (id: string) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("You must be logged in to delete an entry");
        }
        const res = await fetch(`/api/entries/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`Failed to delete entry. Status: ${res.status}`);
        }
        await fetchEntries(pagination.current_page);
        toast.success("Entry deleted successfully");
      } catch (err: any) {
        setError(err.message || "Error deleting entry");
        toast.error(err.message || "Error deleting entry");
      }
    },
    [fetchEntries, pagination.current_page]
  );

  return { entries, pagination, loading, error, fetchEntries, deleteEntry };
};

export default useEntries;
