import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { CreateEntryDto } from "@/types";
import { toast } from "sonner";
import { createEntrySchema } from "@/lib/schemas/entry.schema";
import type { z } from "zod";

interface ReflectionFormProps {
  onEntryCreated: (data: CreateEntryDto) => Promise<void>;
}

type FormData = z.infer<typeof createEntrySchema>;

export default function ReflectionForm({ onEntryCreated }: ReflectionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(createEntrySchema),
    defaultValues: {
      what_matters_most: "",
      fears_of_loss: "",
      personal_goals: "",
    },
  });

  // Watch form values for character count
  const values = watch();

  const onSubmit = async (data: FormData) => {
    try {
      await onEntryCreated(data);
    } catch (error) {
      toast.error("Failed to save your reflection. Please try again.");
      console.error("Error creating entry:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Today's Reflection</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">What matters most to you?</label>
            <Textarea
              {...register("what_matters_most")}
              className={errors.what_matters_most ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            <div className="flex justify-between">
              {errors.what_matters_most ? (
                <p className="text-sm text-destructive">{errors.what_matters_most.message}</p>
              ) : (
                <p className="text-sm text-muted-foreground">&nbsp;</p>
              )}
              <p className="text-sm text-muted-foreground">{values.what_matters_most?.length || 0}/500</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">What do you fear losing?</label>
            <Textarea
              {...register("fears_of_loss")}
              className={errors.fears_of_loss ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            <div className="flex justify-between">
              {errors.fears_of_loss ? (
                <p className="text-sm text-destructive">{errors.fears_of_loss.message}</p>
              ) : (
                <p className="text-sm text-muted-foreground">&nbsp;</p>
              )}
              <p className="text-sm text-muted-foreground">{values.fears_of_loss?.length || 0}/500</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">What do you want to achieve?</label>
            <Textarea
              {...register("personal_goals")}
              className={errors.personal_goals ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            <div className="flex justify-between">
              {errors.personal_goals ? (
                <p className="text-sm text-destructive">{errors.personal_goals.message}</p>
              ) : (
                <p className="text-sm text-muted-foreground">&nbsp;</p>
              )}
              <p className="text-sm text-muted-foreground">{values.personal_goals?.length || 0}/500</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Reflection"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
