import { useState } from "react";
import { useOpenRouter } from "@/hooks/useOpenRouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import type { CreateEntryDto } from "@/types";

interface ReflectionFormProps {
  onEntryCreated: (data: CreateEntryDto) => Promise<void>;
}

export function ReflectionForm({ onEntryCreated }: ReflectionFormProps) {
  const [whatMattersMost, setWhatMattersMost] = useState("");
  const [fearsOfLoss, setFearsOfLoss] = useState("");
  const [personalGoals, setPersonalGoals] = useState("");
  const [generatedSentence, setGeneratedSentence] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await onEntryCreated({
        what_matters_most: whatMattersMost,
        fears_of_loss: fearsOfLoss,
        personal_goals: personalGoals,
      });

      // Reset form after successful save
      setWhatMattersMost("");
      setFearsOfLoss("");
      setPersonalGoals("");
      setGeneratedSentence("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save reflection");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="whatMattersMost" className="block text-sm font-medium">
            What matters most to you today?
          </label>
          <Textarea
            id="whatMattersMost"
            value={whatMattersMost}
            onChange={(e) => setWhatMattersMost(e.target.value)}
            maxLength={500}
            required
            placeholder="Reflect on what truly matters..."
            className="min-h-[100px]"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="fearsOfLoss" className="block text-sm font-medium">
            What are your fears of loss?
          </label>
          <Textarea
            id="fearsOfLoss"
            value={fearsOfLoss}
            onChange={(e) => setFearsOfLoss(e.target.value)}
            maxLength={500}
            required
            placeholder="What do you fear losing..."
            className="min-h-[100px]"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="personalGoals" className="block text-sm font-medium">
            What are your personal goals?
          </label>
          <Textarea
            id="personalGoals"
            value={personalGoals}
            onChange={(e) => setPersonalGoals(e.target.value)}
            maxLength={500}
            required
            placeholder="What do you want to achieve..."
            className="min-h-[100px]"
            disabled={isLoading}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {generatedSentence && (
          <Alert>
            <AlertDescription className="font-medium italic">"{generatedSentence}"</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving reflection...
            </>
          ) : (
            "Save Reflection"
          )}
        </Button>
      </form>
    </Card>
  );
}
