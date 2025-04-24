import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { CreateEntryDto, EntryDto } from "@/types";

export function useDailyEntry() {
  const [entry, setEntry] = useState<EntryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodayEntry = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/entries/today", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to fetch today's entry");
      }

      const data = await response.json();

      if (data) {
        setEntry(data);
      } else {
        setEntry(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch today's entry";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createEntry = async (data: CreateEntryDto) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to create entry");
      }

      const savedEntry = await response.json();
      setEntry(savedEntry);
      toast.success("Entry created successfully");

      return savedEntry;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create entry";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayEntry();
  }, []);

  return {
    entry,
    isLoading,
    createEntry,
  };
}
