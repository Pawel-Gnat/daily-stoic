import { ReflectionForm } from "./ReflectionForm";
import { DailyEntryDisplay } from "./DailyEntryDisplay";
import { useDailyEntry } from "../../../hooks/useDailyEntry";
import type { CreateEntryDto } from "@/types";
import { Spinner } from "../../shared/Spinner";
import { NavLink } from "@/components/navigation/NavLink";
import { ScrollText } from "lucide-react";

export default function IndexPageView() {
  const { entry, isLoading, createEntry } = useDailyEntry();

  const handleEntryCreated = async (formData: CreateEntryDto) => {
    await createEntry(formData);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Daily Stoic Reflection</h1>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl flex flex-col gap-4 text-center">
      <p>
        Discover ancient wisdom through personal reflection. Answer three questions to receive a personalized Stoic
        perspective on your life&apos;s journey.
      </p>
      <NavLink href="/entries" className="mx-auto">
        <ScrollText className="h-4 w-4" /> View Example Reflections
      </NavLink>
      <div className="mt-6">
        {entry ? <DailyEntryDisplay entry={entry} /> : <ReflectionForm onEntryCreated={handleEntryCreated} />}
      </div>
    </div>
  );
}
