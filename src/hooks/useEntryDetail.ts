import { useState, useEffect } from "react";
import type { EntryDto, UserDto } from "@/types";
import { toast } from "sonner";
import { findEntryById } from "@/lib/entries-helpers";

interface UseEntryDetailProps {
  entryId: string;
  user: UserDto | undefined;
}

export function useEntryDetail({ entryId, user }: UseEntryDetailProps) {
  const [entry, setEntry] = useState<EntryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntry = async () => {
    if (!user) {
      const exampleEntry = findEntryById(entryId);
      if (exampleEntry) {
        setEntry(exampleEntry);
      } else {
        setError("Example entry not found");
      }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/entries/${entryId}`);
      if (res.ok) {
        const data = await res.json();
        setEntry(data);
      } else {
        const data = await res.json();
        setError(data.error?.message || "An error occurred");
      }
    } catch (err) {
      console.error("Error fetching entry:", err);
      setError("An error occurred while fetching the entry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryId]);

  const deleteEntry = async (): Promise<boolean> => {
    try {
      const res = await fetch(`/api/entries/${entryId}`, { method: "DELETE" });
      if (res.ok) {
        return true;
      } else {
        const data = await res.json();
        setError(data.error?.message || "An error occurred while deleting the entry");
        toast.error(data.error?.message || "Error deleting entry");
        return false;
      }
    } catch (err) {
      console.error("Error deleting entry:", err);
      setError("An error occurred while deleting the entry");
      toast.error("Error deleting entry");
      return false;
    }
  };

  return { entry, loading, error, deleteEntry };
}
