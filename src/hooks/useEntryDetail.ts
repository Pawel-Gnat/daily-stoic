import { useState, useEffect } from "react";
import type { EntryDto } from "@/types";
import { toast } from "sonner";

export function useEntryDetail(entryId: string) {
  const [entry, setEntry] = useState<EntryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntry = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/entries/${entryId}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message || "An error occurred");
      } else {
        const data = await res.json();
        setEntry(data);
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
