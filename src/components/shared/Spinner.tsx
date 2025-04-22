import { Loader2 } from "lucide-react";

export const Spinner = () => (
  <div className="flex justify-center items-center min-h-[300px]">
    <Loader2 className="h-12 w-12 animate-spin" />
  </div>
);
