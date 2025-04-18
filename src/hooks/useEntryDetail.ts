"use client";

import { useState, useEffect } from "react";
import type { EntryDto } from "@/types";

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
        setError(data.error?.message || "Wystąpił błąd");
      } else {
        const data = await res.json();
        setEntry(data);
      }
    } catch (err) {
      console.error("Error fetching entry:", err);
      setError("Wystąpił błąd podczas pobierania wpisu");
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
        setError(data.error?.message || "Błąd podczas usuwania wpisu");
        return false;
      }
    } catch (err) {
      console.error("Error deleting entry:", err);
      setError("Wystąpił błąd podczas usuwania wpisu");
      return false;
    }
  };

  return { entry, loading, error, deleteEntry };
}
