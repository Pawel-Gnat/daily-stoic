import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { CreateEntryDto, EntryDto, UserDto } from "@/types";

interface Props {
  user: UserDto | undefined;
}

export function useDailyEntry({ user }: Props) {
  const [entry, setEntry] = useState<EntryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodayEntry = async () => {
    if (!user) return;
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
      setEntry(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch today's entry";
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createEntry = async (data: CreateEntryDto) => {
    if (!user) return;
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
