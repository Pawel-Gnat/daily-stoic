import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { CreateEntryDto, EntryDto, EntryListResponseDto } from "@/types";

export function useDailyEntry() {
  const [entry, setEntry] = useState<EntryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch today's entry if it exists
  const fetchTodayEntry = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/entries?page=1&limit=1&sort=created_at:desc");

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to fetch today's entry");
      }

      const data: EntryListResponseDto = await response.json();

      // If we have an entry for today, set it
      if (data.data.length > 0) {
        setEntry(data.data[0]);
      } else {
        setEntry(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch today's entry";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching entry:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new entry
  const createEntry = async (data: CreateEntryDto): Promise<EntryDto | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to create entry");
      }

      const newEntry: EntryDto = await response.json();
      setEntry(newEntry);
      toast.success("Your reflection has been saved!");
      return newEntry;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save your reflection";
      setError(errorMessage);
      toast.error(`${errorMessage}. Please try again.`);
      console.error("Error creating entry:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Load the entry data when the component mounts
  useEffect(() => {
    fetchTodayEntry();
  }, []);

  return {
    entry,
    isLoading,
    error,
    createEntry,
  };
}
