import { ReflectionForm } from "./ReflectionForm";
import { DailyEntryDisplay } from "./DailyEntryDisplay";
import { useDailyEntry } from "../hooks/useDailyEntry";
import type { CreateEntryDto } from "@/types";
import { Spinner } from "./shared/Spinner";

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
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Daily Stoic Reflection</h1>
      {entry ? <DailyEntryDisplay entry={entry} /> : <ReflectionForm onEntryCreated={handleEntryCreated} />}
    </div>
  );
}
