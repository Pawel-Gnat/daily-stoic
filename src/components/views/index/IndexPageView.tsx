import { ReflectionForm } from "./ReflectionForm";
import { EntryDetailCard } from "../entry/EntryDetailCard";
import { useDailyEntry } from "../../../hooks/useDailyEntry";
import type { CreateEntryDto, UserDto } from "@/types";
import { Spinner } from "../../shared/Spinner";
import { NavLink } from "@/components/navigation/NavLink";
import { Container } from "@/components/shared/Container";
import { Icon } from "@/lib/icons";

interface Props {
  user: UserDto | undefined;
}

export default function IndexPageView({ user }: Props) {
  const { entry, isLoading, createEntry } = useDailyEntry({ user });

  const handleEntryCreated = async (formData: CreateEntryDto) => {
    await createEntry(formData);
  };

  if (user && isLoading) return <Spinner />;

  return (
    <Container className="text-center">
      <p className="font-cinzel text-xl">
        {entry
          ? `Reflect on your today's entry.`
          : `Discover ancient wisdom through personal reflection. Answer three questions to receive a personalized Stoic
        perspective on your life's journey.`}
      </p>
      {!user && (
        <NavLink href="/entries" className="mx-auto">
          <Icon name="entries" /> View Example Reflections
        </NavLink>
      )}
      <div className="mt-6">
        {entry ? (
          <EntryDetailCard entry={entry} />
        ) : (
          <ReflectionForm onEntryCreated={handleEntryCreated} disabled={!user} />
        )}
      </div>
    </Container>
  );
}
