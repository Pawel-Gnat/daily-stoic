import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { questions } from "@/lib/question-helpers";
import type { EntryDto } from "@/types";
import { BookOpenText, Feather } from "lucide-react";

interface DailyEntryDisplayProps {
  entry: EntryDto;
}

export function DailyEntryDisplay({ entry }: DailyEntryDisplayProps) {
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
        <CardTitle className="flex items-center gap-2">
          <BookOpenText className="w-4 h-4" /> {formatDate(entry.created_at)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-left">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">{questions[0].question}</h3>
          <p className="p-3 bg-paper rounded-md">{entry.what_matters_most}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">{questions[1].question}</h3>
          <p className="p-3 bg-paper rounded-md">{entry.fears_of_loss}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">{questions[2].question}</h3>
          <p className="p-3 bg-paper rounded-md">{entry.personal_goals}</p>
        </div>

        <div className="space-y-2 pt-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Feather className="h-4 w-4" /> Stoic Wisdom
          </h3>
          <blockquote className="font-cinzel p-3 bg-golden/30 rounded-md text-balance">
            {entry.generated_sentence}
          </blockquote>
        </div>
      </CardContent>
    </Card>
  );
}
