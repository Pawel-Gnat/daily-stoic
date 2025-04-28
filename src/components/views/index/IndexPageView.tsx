import { ReflectionForm } from "./ReflectionForm";
import { DailyEntryDisplay } from "./DailyEntryDisplay";
import { useDailyEntry } from "../../../hooks/useDailyEntry";
import type { CreateEntryDto } from "@/types";
import { Spinner } from "../../shared/Spinner";
import { NavLink } from "@/components/navigation/NavLink";
import { ScrollText } from "lucide-react";
import { Container } from "@/components/shared/Container";

export default function IndexPageView() {
  const { entry, isLoading, createEntry } = useDailyEntry();

  const handleEntryCreated = async (formData: CreateEntryDto) => {
    await createEntry(formData);
  };

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Spinner />
      </div>
    );
  }

  return (
    <Container className="flex flex-col gap-4 text-center">
      <p className="font-cinzel text-xl">
        Discover ancient wisdom through personal reflection. Answer three questions to receive a personalized Stoic
        perspective on your life&apos;s journey.
      </p>
      <NavLink href="/entries" className="mx-auto">
        <ScrollText className="h-4 w-4" /> View Example Reflections
      </NavLink>
      <div className="mt-6">
        {entry ? <DailyEntryDisplay entry={entry} /> : <ReflectionForm onEntryCreated={handleEntryCreated} />}
      </div>
    </Container>
  );
}
