import { useState } from "react";
import { OpenRouterService, OpenRouterError } from "../services/openrouter/openrouter.service";
import type { ChatCompletionResponse } from "@/types/openrouter";

interface UseOpenRouterOptions {
  apiKey: string;
  defaultModel?: string;
}

interface UseOpenRouterReturn {
  generateStoicSentence: (context: {
    what_matters_most: string;
    fears_of_loss: string;
    personal_goals: string;
  }) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export function useOpenRouter({ apiKey, defaultModel }: UseOpenRouterOptions): UseOpenRouterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = new OpenRouterService({ apiKey, defaultModel });

  const generateStoicSentence = async (context: {
    what_matters_most: string;
    fears_of_loss: string;
    personal_goals: string;
  }): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const systemMessage = service.createSystemMessage(
        "You are a wise Stoic philosopher. Based on the user's reflection, generate a single meaningful Stoic sentence that addresses their concerns and goals. The sentence should be concise, profound, and directly related to their situation."
      );

      const userMessage = service.createUserMessage(
        `What matters most to me: ${context.what_matters_most}\n` +
          `My fears of loss: ${context.fears_of_loss}\n` +
          `My personal goals: ${context.personal_goals}`
      );

      const response = await service.createChatCompletion({
        messages: [systemMessage, userMessage],
        temperature: 0.7,
        maxTokens: 500,
      });

      const generatedSentence = response.choices[0]?.message?.content;

      if (!generatedSentence) {
        throw new Error("No sentence was generated");
      }

      return generatedSentence;
    } catch (err) {
      const errorMessage = err instanceof OpenRouterError ? err.message : "Failed to generate Stoic sentence";

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateStoicSentence,
    isLoading,
    error,
  };
}
