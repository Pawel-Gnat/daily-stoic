import { NavLink } from "@/components/navigation/NavLink";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen, Scroll } from "lucide-react";

export const NoEntriesCard = () => {
  return (
    <Card className="w-full bg-paper">
      <CardHeader className="flex flex-col items-center gap-2">
        <BookOpen className="w-10 h-10" />
        <p>You haven&apos;t created any entries yet.</p>
      </CardHeader>
      <CardContent>
        <NavLink href="/" className="mx-auto">
          <Scroll className="h-4 w-4" /> Create your first entry
        </NavLink>
      </CardContent>
    </Card>
  );
};
