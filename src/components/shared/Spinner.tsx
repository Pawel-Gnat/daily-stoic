import { Loader2 } from "lucide-react";

export const Spinner = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Loader2 className="h-12 w-12 animate-spin text-golden" />
  </div>
);
