import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EntryDto } from "@/types";

interface DailyEntryDisplayProps {
  entry: EntryDto;
}

export default function DailyEntryDisplay({ entry }: DailyEntryDisplayProps) {
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Daily Reflection</CardTitle>
        <p className="text-sm text-muted-foreground">{formatDate(entry.created_at)}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">What matters most to you?</h3>
          <p className="p-3 bg-muted rounded-md">{entry.what_matters_most}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">What do you fear losing?</h3>
          <p className="p-3 bg-muted rounded-md">{entry.fears_of_loss}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">What do you want to achieve?</h3>
          <p className="p-3 bg-muted rounded-md">{entry.personal_goals}</p>
        </div>

        <div className="space-y-2 pt-4">
          <h3 className="text-sm font-semibold">Generated Stoic Wisdom</h3>
          <blockquote className="italic border-l-4 pl-4 py-2 bg-accent/20 rounded-r-md">
            {entry.generated_sentence}
          </blockquote>
        </div>
      </CardContent>
    </Card>
  );
}
