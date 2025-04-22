import { OpenRouterService } from "./openrouter.service";
import type { CreateEntryDto } from "@/types";

const OPENROUTER_API_KEY = import.meta.env.OPENROUTER_API_KEY;

export class AIService {
  private openRouter: OpenRouterService;

  constructor() {
    this.openRouter = new OpenRouterService({ apiKey: OPENROUTER_API_KEY });
  }

  /**
   * Generates a stoic sentence based on user's answers
   * @param context User's answers to daily questions
   * @returns Generated sentence and generation duration
   * @throws Error if generation fails
   */
  async generateStoicSentence(context: CreateEntryDto): Promise<{ sentence: string; duration: number }> {
    const startTime = performance.now();

    try {
      const systemMessage = this.openRouter.createSystemMessage(
        "You are a Stoic philosopher assistant. Generate a wise, stoic sentence that addresses the user's reflections. Please respond in language of the user's message."
      );

      const userMessage = this.openRouter.createUserMessage(
        `Based on these reflections:
        - What matters most: ${context.what_matters_most}
        - Fears of loss: ${context.fears_of_loss}
        - Personal goals: ${context.personal_goals}
        
        Generate a stoic wisdom that addresses these reflections.`
      );

      const response = await this.openRouter.createChatCompletion({
        messages: [systemMessage, userMessage],
        temperature: 0.7,
        maxTokens: 500,
      });

      const duration = Math.round(performance.now() - startTime);

      return {
        sentence: response.choices[0].message.content,
        duration,
      };
    } catch (error) {
      throw new Error(`Failed to generate stoic sentence: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}
