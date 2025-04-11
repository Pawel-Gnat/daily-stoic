import type { CreateEntryDto } from "../../types";

/**
 * Service for generating stoic sentences using AI
 */
export class AIService {
  private readonly TIMEOUT_MS = 10000; // 10 seconds timeout

  /**
   * Generates a stoic sentence based on user's answers
   * @param context User's answers to daily questions
   * @returns Generated sentence and generation duration
   * @throws Error if generation fails
   */
  async generateStoicSentence(context: CreateEntryDto): Promise<{ sentence: string; duration: number }> {
    try {
      const startTime = Date.now();

      // Implementacja komunikacji z OpenRouter.ai
      const response = await this.callAIModel(context);

      const endTime = Date.now();
      const duration = Math.round(endTime - startTime);

      return {
        sentence: response,
        duration,
      };
    } catch (error) {
      console.error("AI generation failed:", error);
      throw new Error("Failed to generate stoic sentence");
    }
  }

  /**
   * Makes the actual API call to the AI model
   * @param context User's answers
   * @returns Generated sentence
   * @throws Error if the API call fails
   */
  private async callAIModel(context: CreateEntryDto): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      // TODO: Implement actual OpenRouter.ai API call
      // This is a placeholder implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      clearTimeout(timeoutId);
      return "The Stoics taught that material things alone cannot secure happiness or virtue, and that a good person is one who finds happiness within themselves. Remember: you cannot control what happens to you, but you can always control how you respond.";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("AI generation timed out");
      }
      throw error; // Re-throw other errors for upstream handling
    }
  }
}
