import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { CreateEntryDto, EntryDto } from "@/types";
import { EntryService } from "@/lib/services/entry.service";
import { supabaseClient, DEFAULT_USER_ID } from "@/db/supabase.client";

// Initialize service
const entryService = new EntryService(supabaseClient);

export function useDailyEntry() {
  const [entry, setEntry] = useState<EntryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch today's entry if it exists
  const fetchTodayEntry = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get entries for today with pagination
      const response = await entryService.getEntries(DEFAULT_USER_ID, {
        page: 1,
        limit: 1,
        sort: "created_at:desc",
      });

      // If we have an entry for today, set it
      if (response.data.length > 0) {
        setEntry(response.data[0]);
      } else {
        setEntry(null);
      }
    } catch (err) {
      const errorMessage = "Failed to fetch today's entry";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new entry
  const createEntry = async (data: CreateEntryDto): Promise<EntryDto | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const newEntry = await entryService.createEntry(DEFAULT_USER_ID, data);
      setEntry(newEntry);
      toast.success("Your reflection has been saved!");
      return newEntry;
    } catch (err) {
      const errorMessage = "Failed to save your reflection";
      setError(errorMessage);
      toast.error(`${errorMessage}. Please try again.`);
      console.error(err);
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
    fetchTodayEntry,
  };
}
