import type { SupabaseClient } from "../../db/supabase.client";
import type { Entry, CreateEntryDto, EntryListQueryParams, EntryListResponseDto } from "../../types";
import { AIService } from "./ai.service";

/**
 * Service for managing entries
 */
export class EntryService {
  private aiService: AIService;

  constructor(private supabase: SupabaseClient) {
    this.aiService = new AIService();
  }

  /**
   * Creates a new entry with AI-generated stoic sentence
   * @param userId User ID
   * @param data Entry data from user
   * @returns Created entry
   * @throws Error if creation fails
   */
  async createEntry(userId: string, data: CreateEntryDto): Promise<Entry> {
    // Generate stoic sentence
    const { sentence, duration } = await this.aiService.generateStoicSentence(data);

    // Create entry in database
    const { data: entry, error } = await this.supabase
      .from("entries")
      .insert({
        user_id: userId,
        what_matters_most: data.what_matters_most,
        fears_of_loss: data.fears_of_loss,
        personal_goals: data.personal_goals,
        generated_sentence: sentence,
        generate_duration: duration,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create entry:", error);
      throw new Error("Failed to create entry");
    }

    return entry;
  }

  /**
   * Retrieves paginated list of user's entries
   * @param userId User ID
   * @param query Query parameters for pagination and sorting
   * @returns Entries with pagination metadata
   */
  async getEntries(userId: string, query: EntryListQueryParams): Promise<EntryListResponseDto> {
    // Calculate offset
    const offset = (query.page - 1) * query.limit;

    // Get total count
    const { count, error: countError } = await this.supabase
      .from("entries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      console.error("Failed to get entries count:", countError);
      throw new Error("Failed to get entries");
    }

    // Get entries
    const [field, direction] = query.sort.split(":") as [string, "asc" | "desc"];
    const { data: entries, error } = await this.supabase
      .from("entries")
      .select()
      .eq("user_id", userId)
      .order(field, { ascending: direction === "asc" })
      .range(offset, offset + query.limit - 1);

    if (error) {
      console.error("Failed to get entries:", error);
      throw new Error("Failed to get entries");
    }

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / query.limit);

    return {
      data: entries,
      pagination: {
        current_page: query.page,
        total_pages: totalPages,
        total_items: totalItems,
        has_next: query.page < totalPages,
      },
    };
  }

  /**
   * Retrieves a single entry
   * @param userId User ID
   * @param entryId Entry ID
   * @returns Entry or null if not found
   */
  async getEntry(userId: string, entryId: string): Promise<Entry | null> {
    const { data: entry, error } = await this.supabase
      .from("entries")
      .select()
      .eq("user_id", userId)
      .eq("id", entryId)
      .single();

    if (error) {
      // If no entry was found, return null
      if (error.message?.includes("No rows found")) {
        return null;
      }
      console.error("Failed to get entry:", error);
      throw new Error("Failed to get entry");
    }

    return entry;
  }

  /**
   * Deletes an entry
   * @param userId User ID
   * @param entryId Entry ID
   * @throws Error if deletion fails
   */
  async deleteEntry(userId: string, entryId: string): Promise<void> {
    const { error } = await this.supabase.from("entries").delete().eq("user_id", userId).eq("id", entryId);

    if (error) {
      console.error("Failed to delete entry:", error);
      throw new Error("Failed to delete entry");
    }
  }
}
