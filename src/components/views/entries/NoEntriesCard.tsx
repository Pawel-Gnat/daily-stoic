import { NavLink } from "@/components/navigation/NavLink";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icon } from "@/lib/icons";

export const NoEntriesCard = () => {
  return (
    <Card className="w-full bg-paper">
      <CardHeader className="flex flex-col items-center gap-2">
        <Icon name="empty-book" />
        <p>You haven&apos;t created any entries yet.</p>
      </CardHeader>
      <CardContent>
        <NavLink href="/" className="mx-auto">
          <Icon name="empty-entry" /> Create your first entry
        </NavLink>
      </CardContent>
    </Card>
  );
};
