import { useState, useEffect, useCallback } from "react";
import type { EntryDto, EntryListResponseDto, PaginationMetadata } from "../types";
import { toast } from "sonner";
import { sampleEntries } from "../db/sample-entries";

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
  // const params = new URLSearchParams(window.location.search);
  // const page = params.get("page") || 1;

  const fetchEntries = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setEntries(sampleEntries.data);
      setPagination(sampleEntries.pagination);
      setLoading(false);
      return;
    }

    try {
      // const res = await fetch(`/api/entries?page=${page}&limit=10`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      const res = await fetch(`/api/entries?page=${page}&limit=10`);
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
  }, []);

  return { entries, pagination, loading, error, fetchEntries };
};

export default useEntries;
