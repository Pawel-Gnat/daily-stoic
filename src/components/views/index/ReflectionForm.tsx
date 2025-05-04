import { Card } from "@/components/ui/card";
import type { CreateEntryDto } from "@/types";
import { useForm } from "react-hook-form";
import { createEntrySchema } from "@/lib/schemas/entry.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { TextareaField } from "../../form/TextareaField";
import { questions } from "@/lib/question-helpers";
import { Button } from "@/components/shared/Button";
import { Icon } from "@/lib/icons";

interface ReflectionFormProps {
  onEntryCreated: (data: CreateEntryDto) => Promise<void>;
  disabled?: boolean;
}

export function ReflectionForm({ onEntryCreated, disabled = false }: ReflectionFormProps) {
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

  const submitButtonText = disabled ? (
    <>
      <Icon name="blockedEntry" />
      Sign in to add reflection
    </>
  ) : form.formState.isSubmitting ? (
    <>
      <Icon name="loader" className="animate-spin" />
      Adding reflection...
    </>
  ) : (
    <>
      <Icon name="emptyEntry" />
      Add Reflection
    </>
  );

  return (
    <Card className="p-6 max-w-2xl text-left shadow-xl">
      <Form {...form}>
        <form data-testid="reflection-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TextareaField
            control={form.control}
            name="what_matters_most"
            label={questions[0].question}
            placeholder={questions[0].placeholder}
            description={`${watchTextareaMattersMost.length} / 500`}
            disabled={disabled}
            dataTestId="reflection-form-textarea-matters-most"
          />

          <TextareaField
            control={form.control}
            name="fears_of_loss"
            label={questions[1].question}
            placeholder={questions[1].placeholder}
            description={`${watchTextareaFearsOfLoss.length} / 500`}
            disabled={disabled}
            dataTestId="reflection-form-textarea-fears-of-loss"
          />

          <TextareaField
            control={form.control}
            name="personal_goals"
            label={questions[2].question}
            placeholder={questions[2].placeholder}
            description={`${watchTextareaPersonalGoals.length} / 500`}
            disabled={disabled}
            dataTestId="reflection-form-textarea-personal-goals"
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting || disabled}
            className="w-full"
            dataTestId="reflection-form-submit-button"
          >
            {submitButtonText}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
