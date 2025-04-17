import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useOpenRouter } from "@/lib/hooks/useOpenRouter";
import type { CreateEntryDto, EntryDto } from "@/types";

const OPENROUTER_API_KEY = import.meta.env.OPENROUTER_API_KEY;

export function useDailyEntry() {
  const [entry, setEntry] = useState<EntryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { generateStoicSentence } = useOpenRouter({
    apiKey: OPENROUTER_API_KEY,
  });

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

      const data = await response.json();

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
  const createEntry = async (data: CreateEntryDto) => {
    setIsLoading(true);
    try {
      const startTime = performance.now();

      // First, generate the stoic sentence
      const generatedSentence = await generateStoicSentence({
        what_matters_most: data.what_matters_most,
        fears_of_loss: data.fears_of_loss,
        personal_goals: data.personal_goals,
      });

      const generateDuration = Math.round(performance.now() - startTime);

      // Then, save the entry with the generated sentence
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          generated_sentence: generatedSentence,
          generate_duration: generateDuration,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to save entry");
      }

      const savedEntry = await response.json();
      setEntry(savedEntry);
    } catch (error) {
      throw error instanceof Error ? error : new Error("Failed to create entry");
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
