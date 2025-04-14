import { Toaster } from "@/components/ui/sonner";
import ReflectionForm from "./ReflectionForm";
import DailyEntryDisplay from "./DailyEntryDisplay";
import { useDailyEntry } from "./hooks/useDailyEntry";
import type { CreateEntryDto } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReloadIcon } from "@radix-ui/react-icons";

// Simple spinner for loading states
const Spinner = () => (
  <div className="flex justify-center items-center min-h-[300px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Error message component
const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <Alert variant="destructive" className="my-4">
    <AlertDescription className="flex items-center justify-between">
      <span>{message}</span>
      <button
        onClick={onRetry}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
      >
        <ReloadIcon className="mr-2 h-4 w-4" />
        Retry
      </button>
    </AlertDescription>
  </Alert>
);

export default function IndexPageView() {
  const { entry, isLoading, error, createEntry, fetchTodayEntry } = useDailyEntry();

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

      {error && <ErrorMessage message={error} onRetry={fetchTodayEntry} />}

      {entry ? <DailyEntryDisplay entry={entry} /> : <ReflectionForm onEntryCreated={handleEntryCreated} />}

      <Toaster />
    </div>
  );
}
