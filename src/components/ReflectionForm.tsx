import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { CreateEntryDto } from "@/types";
import { useForm } from "react-hook-form";
import { createEntrySchema } from "@/lib/schemas/entry.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextareaField } from "./form/TextareaField";

interface ReflectionFormProps {
  onEntryCreated: (data: CreateEntryDto) => Promise<void>;
}

export function ReflectionForm({ onEntryCreated }: ReflectionFormProps) {
  const form = useForm<z.infer<typeof createEntrySchema>>({
    resolver: zodResolver(createEntrySchema),
    defaultValues: {
      what_matters_most: "",
      fears_of_loss: "",
      personal_goals: "",
    },
  });

  const watchTextareaMattersMost = form.watch("what_matters_most");
  const watchTextareaFearsOfLoss = form.watch("fears_of_loss");
  const watchTextareaPersonalGoals = form.watch("personal_goals");

  async function onSubmit(values: z.infer<typeof createEntrySchema>) {
    try {
      await onEntryCreated(values);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TextareaField
            control={form.control}
            name="what_matters_most"
            label="What matters most to you today?"
            placeholder="Reflect on what truly matters..."
            description={`${watchTextareaMattersMost.length} / 500`}
          />

          <TextareaField
            control={form.control}
            name="fears_of_loss"
            label="What are your fears of loss?"
            placeholder="What do you fear losing..."
            description={`${watchTextareaFearsOfLoss.length} / 500`}
          />

          <TextareaField
            control={form.control}
            name="personal_goals"
            label="What are your personal goals?"
            placeholder="What do you want to achieve..."
            description={`${watchTextareaPersonalGoals.length} / 500`}
          />

          <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving reflection...
              </>
            ) : (
              "Save Reflection"
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
