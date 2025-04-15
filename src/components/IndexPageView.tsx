import { ReflectionForm } from "./ReflectionForm";
import { DailyEntryDisplay } from "./DailyEntryDisplay";
import { useDailyEntry } from "./hooks/useDailyEntry";
import type { CreateEntryDto } from "@/types";

// Simple spinner for loading states
const Spinner = () => (
  <div className="flex justify-center items-center min-h-[300px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

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
